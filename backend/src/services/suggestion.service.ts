import { db } from "../config/database.js";
import { suggestions } from "../schema/suggestions.js";
import { desc } from "drizzle-orm";
import { generateId } from "../utils/id-generator.js";

export class SuggestionService {
  async createSuggestion(data: { customerName?: string; message: string; email?: string }) {
    const id = await generateId("SGT");
    const [suggestion] = await db
      .insert(suggestions)
      .values({ id, customerName: data.customerName || "Anonim", message: data.message, email: data.email || null })
      .returning();
    return suggestion;
  }

  async getAllSuggestions() {
    return db
      .select()
      .from(suggestions)
      .orderBy(desc(suggestions.createdAt));
  }
}

export const suggestionService = new SuggestionService();