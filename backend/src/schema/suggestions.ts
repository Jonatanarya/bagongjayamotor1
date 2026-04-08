import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const suggestions = pgTable("suggestions", {
  id: text("id").primaryKey(), // SGT-001
  customerName: text("customer_name"),
  message: text("message").notNull(),
  email: text("email"),
  status: varchar("status", { length: 50 }).default("Unread"), // Unread | Read | Archived
  createdAt: timestamp("created_at").defaultNow(),
});

export type Suggestion = typeof suggestions.$inferSelect;
export type CreateSuggestionInput = Omit<typeof suggestions.$inferInsert, "id" | "createdAt">;