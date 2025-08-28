// Helper file - stores generic non-api functions 

import { and, eq } from "drizzle-orm";
import { member, notes } from "../drizzle/migrations/schema.js";
import { db } from '../drizzle/db.js';
import type Note from '../types/note.js'

type JSON_note = {
  notes: [{
    title: string;
    text: string;
  }]
};

// selects all notes of given user in db and returns them as a JSON object
// in - userID 
// output - JSON object
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

//wipes all notes of given user in db -> inserts all of the json data as notes -> return success bool
//in - userID, JSON string containing all of user's saved notes
//output - success boolean
async function backupToDB (user_id : number, json_data : JSON_note) {
  //var json_data = JSON.parse(json_string) //json_string is propably already an object

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