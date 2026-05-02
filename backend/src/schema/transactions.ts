import { pgTable, text, bigint, integer, varchar, date, timestamp } from "drizzle-orm/pg-core";
import { motors } from "./motors.js";

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(), // TRX-001
  type: text("type", { enum: ["Jual", "Beli"] }).notNull(),
  motorId: text("motor_id").references(() => motors.id),
  // Detail motor — diinput manual oleh admin
  motorMerk: varchar("motor_merk", { length: 100 }),
  motorTipe: varchar("motor_tipe", { length: 100 }),
  motorWarna: varchar("motor_warna", { length: 100 }),
  motorTahun: integer("motor_tahun"),
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