// Helper file - stores generic non-api functions 

import { and, eq } from "drizzle-orm";
import { member, notes } from "../drizzle/migrations/schema.js";
import { db } from '../drizzle/db.js';
import type { JSON_notes } from "../types/JSON_notes.js";

// selects all notes of given user in db and returns them as a JSON object
// @param userID 
// @returns JSON - object
async function getUserNotes (user_id : number) {
  try {
    const results = await db
    .select({
      title: notes.title,
      text: notes.text
    })
    .from(notes)
    .where(
      and(
        eq(notes.userId, user_id),
        eq(notes.active, true)
      )
    );
    return results; //JSON.stringify(results)
  } catch (err) {
    console.error("DB select failed: ", err)
    return false 
  }
}

// wipes all notes of user in db -> inserts json data as new notes -> return success bool
// @param user_id
// @param json_data - JSON containing all of the user's saved notes, app.use(express.json()) converts it to an object automatically
// @returns Boolean
async function backupToDB (user_id : number, json_data : JSON_notes) {
  try {
    await db
    .update(notes)
    .set({ active: false })
    .where(eq(notes.userId, user_id));
  } catch (err) {
    console.error("Failed to mark old backup as inactive: ", err)
    return false
  }

  for (const note_instance of json_data.notes) {
    try {
      await db
      .insert(notes)
      .values({
        userId: user_id,
        title: note_instance.title,
        text: note_instance.text,
      });
    } catch (err) {
      console.error("DB insertion failed: ", err)
      try {
        await db
        .update(notes)
        .set({ active: false })
        .where(eq(notes.userId, user_id));
      } catch (err_restore) {
        console.error(`Failed to restore original note backup for user_id ${user_id}: `, err)
      }
      return false
    }
  }

  try{
    await db
    .delete(notes)
    .where(
      and(
        eq(notes.userId, user_id),
        eq(notes.active, false)
      )
    );
  } catch (err) {
    console.error(`Failed to remove old backup for user_id ${user_id}: `, err)
  }
  
  return true
}

export { getUserNotes, backupToDB };