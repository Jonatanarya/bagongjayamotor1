import { pgTable, text, bigint, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const sellRequests = pgTable("sell_requests", {
  id: text("id").primaryKey(), // REQ-001
  customerName: text("customer_name").notNull(),
  customerWa: text("customer_wa").notNull(),
  customerAddress: text("customer_address").notNull(),
  merk: varchar("merk", { length: 100 }).notNull(),
  tipe: varchar("tipe", { length: 100 }).notNull(),
  tahun: integer("tahun").notNull(),
  hargaPenawaran: bigint("harga_penawaran", { mode: "number" }).notNull(),
  deskripsi: text("deskripsi"),
  imageUrl: text("image_url"),
  status: varchar("status", { length: 50 }).default("Pending"), // Pending | Contacted | Rejected | Accepted
  createdByAdminId: text("created_by_admin_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SellRequest = typeof sellRequests.$inferSelect;
export type CreateSellRequestInput = Omit<typeof sellRequests.$inferInsert, "id" | "createdAt" | "updatedAt">;