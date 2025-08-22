import { relations } from "drizzle-orm/relations";
import { member, notes } from "./schema.js";

export const notesRelations = relations(notes, ({one}) => ({
	member: one(member, {
		fields: [notes.userId],
		references: [member.id]
	}),
}));

export const memberRelations = relations(member, ({many}) => ({
	notes: many(notes),
}));