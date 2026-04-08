import { pgTable, text, bigint, date, timestamp } from "drizzle-orm/pg-core";
import { motors } from "./motors.js";

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(), // TRX-001
  type: text("type", { enum: ["Jual", "Beli"] }).notNull(),
  motorId: text("motor_id").references(() => motors.id),
  clientName: text("client_name").notNull(),
  clientWa: text("client_wa"),
  amount: bigint("amount", { mode: "number" }).notNull(),
  date: date("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Transaction = typeof transactions.$inferSelect;
export type CreateTransactionInput = Omit<typeof transactions.$inferInsert, "id" | "createdAt" | "updatedAt">;