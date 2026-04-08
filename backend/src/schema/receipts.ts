import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { transactions } from "./transactions.js";
import { users } from "./users.js";

export const receipts = pgTable("receipts", {
  id: text("id").primaryKey(), // RCP-001
  transactionId: text("transaction_id").notNull().unique().references(() => transactions.id),
  companyName: text("company_name").default("BAGONG JAYA MOTOR"),
  companyAddress: text("company_address"),
  printedAt: timestamp("printed_at"),
  printedByAdminId: text("printed_by_admin_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Receipt = typeof receipts.$inferSelect;