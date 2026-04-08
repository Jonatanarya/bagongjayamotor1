"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestionService = exports.SuggestionService = void 0;
const database_js_1 = require("../config/database.js");
const suggestions_js_1 = require("../schema/suggestions.js");
const drizzle_orm_1 = require("drizzle-orm");
const id_generator_js_1 = require("../utils/id-generator.js");
class SuggestionService {
    async createSuggestion(data) {
        const id = await (0, id_generator_js_1.generateId)("SGT");
        const [suggestion] = await database_js_1.db
            .insert(suggestions_js_1.suggestions)
            .values({ id, customerName: data.customerName || "Anonim", message: data.message, email: data.email || null })
            .returning();
        return suggestion;
    }
    async getAllSuggestions() {
        return database_js_1.db
            .select()
            .from(suggestions_js_1.suggestions)
            .orderBy((0, drizzle_orm_1.desc)(suggestions_js_1.suggestions.createdAt));
    }
}
exports.SuggestionService = SuggestionService;
exports.suggestionService = new SuggestionService();
//# sourceMappingURL=suggestion.service.js.map