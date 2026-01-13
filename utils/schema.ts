import { integer, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  email: text().primaryKey(),
  name: text().notNull(),
  friends: json().$type<string[]>().notNull().default([])
});
export const journalTable = pgTable("journals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user: text().notNull(),
  title: text().notNull(),
  body: text().notNull(),
  createdAt: timestamp({ mode: "date", withTimezone: true }).notNull().defaultNow()
});