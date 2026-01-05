import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  email: text().primaryKey(),
  name: text().notNull()
});
export const journalTable = pgTable("journals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user: text().notNull(),
  title: text().notNull(),
  body: text().notNull(),
  createdAt: timestamp({ mode: "date", withTimezone: true }).notNull().defaultNow()
});