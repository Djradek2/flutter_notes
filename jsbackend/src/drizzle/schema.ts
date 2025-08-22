//TODO: unused. remove

import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core"

export const UserTable = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name", {length: 255}).notNull(),
  password: varchar("password", {length: 255}).notNull().default("1234"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})