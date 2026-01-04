import { date, integer, pgTable, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text().notNull().unique(),
  name: text().notNull()
});
export const journalTable = pgTable("journals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  body: text().notNull(),
  createdAt: date().notNull().defaultNow()
});