import { pgTable, text, integer, bigint, varchar, timestamp, unique } from "drizzle-orm/pg-core";

export const motors = pgTable(
  "motors",
  {
    id: text("id").primaryKey(), // MTR-001
    merk: varchar("merk", { length: 100 }).notNull(),
    tipe: varchar("tipe", { length: 100 }).notNull(),
    tahun: integer("tahun").notNull(),
    harga: bigint("harga", { mode: "number" }).notNull(),
    kilometer: integer("kilometer"), // NEW FIELD
    status: varchar("status", { length: 50 }).default("Tersedia"), // Tersedia | Terjual
    imageUrl: text("image_url"),
    deskripsi: text("deskripsi"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    // Unique constraint to prevent duplicates
    uniqueMotor: unique().on(table.merk, table.tipe, table.tahun),
  })
);

export type Motor = typeof motors.$inferSelect;
export type CreateMotorInput = Omit<typeof motors.$inferInsert, "id" | "createdAt" | "updatedAt">;
export type UpdateMotorInput = Partial<CreateMotorInput>;