"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const drizzle_orm_1 = require("drizzle-orm");
const database_js_1 = require("../config/database.js");
const suggestions_js_1 = require("../schema/suggestions.js");
const suggestion_service_js_1 = require("../services/suggestion.service.js");
const admin_routes_js_1 = require("./admin.routes.js");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    try {
        const suggestions = await suggestion_service_js_1.suggestionService.getAllSuggestions();
        res.json({ success: true, data: suggestions });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const { nama, pesan, email } = req.body;
        if (!pesan || pesan.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Pesan saran wajib diisi.' });
        }
        const suggestion = await suggestion_service_js_1.suggestionService.createSuggestion({
            customerName: nama?.trim() || 'Anonim',
            message: pesan.trim(),
            email: email?.trim() || null,
        });
        res.status(201).json({ success: true, data: suggestion });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', admin_routes_js_1.requireAdmin, async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const [deletedSuggestion] = await database_js_1.db
            .delete(suggestions_js_1.suggestions)
            .where((0, drizzle_orm_1.eq)(suggestions_js_1.suggestions.id, id))
            .returning({ id: suggestions_js_1.suggestions.id });
        if (!deletedSuggestion) {
            return res.status(404).json({ success: false, error: 'Saran tidak ditemukan.' });
        }
        res.json({ success: true, data: deletedSuggestion });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=suggestion.routes.js.map