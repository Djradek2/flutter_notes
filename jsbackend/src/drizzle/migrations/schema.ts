import { pgTable, serial, varchar, timestamp, foreignKey, integer, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const member = pgTable("member", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	password: varchar({ length: 255 }).default('1234').notNull(),
});

export const notes = pgTable("notes", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "notes_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	userId: integer("user_id").notNull(),
	title: varchar().notNull(),
	text: varchar(),
	active: boolean().default(true).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [member.id],
			name: "owner"
		}),
]);
