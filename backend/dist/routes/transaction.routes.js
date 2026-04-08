"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_js_1 = require("../config/database.js");
const transactions_js_1 = require("../schema/transactions.js");
const drizzle_orm_1 = require("drizzle-orm");
const id_generator_js_1 = require("../utils/id-generator.js");
const admin_routes_js_1 = require("./admin.routes.js");
const router = (0, express_1.Router)();
router.get('/', admin_routes_js_1.requireAdmin, async (_req, res, next) => {
    try {
        const data = await database_js_1.db.select().from(transactions_js_1.transactions).orderBy((0, drizzle_orm_1.desc)(transactions_js_1.transactions.date), (0, drizzle_orm_1.desc)(transactions_js_1.transactions.createdAt));
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
router.get('/summary', admin_routes_js_1.requireAdmin, async (_req, res, next) => {
    try {
        const [summary] = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Jual' THEN amount ELSE 0 END), 0) AS total_jual,
        COALESCE(SUM(CASE WHEN type = 'Beli' THEN amount ELSE 0 END), 0) AS total_beli,
        COUNT(*) AS total_transaksi
      FROM transactions
    `);
        res.json({ success: true, data: summary });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', admin_routes_js_1.requireAdmin, async (req, res, next) => {
    try {
        const id = await (0, id_generator_js_1.generateId)('TRX');
        const payload = {
            id,
            type: (req.body?.type === 'Beli' ? 'Beli' : 'Jual'),
            motorId: req.body?.motorId || null,
            clientName: req.body?.clientName,
            clientWa: req.body?.clientWa || null,
            amount: Number(req.body?.amount || 0),
            date: req.body?.date,
            notes: req.body?.notes || null,
        };
        const [transaction] = await database_js_1.db.insert(transactions_js_1.transactions).values(payload).returning();
        res.status(201).json({ success: true, data: transaction });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', admin_routes_js_1.requireAdmin, async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const [transaction] = await database_js_1.db
            .update(transactions_js_1.transactions)
            .set({
            type: (req.body?.type === 'Beli' ? 'Beli' : 'Jual'),
            motorId: req.body?.motorId ?? null,
            clientName: req.body?.clientName,
            clientWa: req.body?.clientWa ?? null,
            amount: req.body?.amount ? Number(req.body.amount) : undefined,
            date: req.body?.date,
            notes: req.body?.notes ?? null,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(transactions_js_1.transactions.id, id))
            .returning();
        if (!transaction) {
            return res.status(404).json({ success: false, error: 'Transaksi tidak ditemukan.' });
        }
        res.json({ success: true, data: transaction });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', admin_routes_js_1.requireAdmin, async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const [deletedTransaction] = await database_js_1.db
            .delete(transactions_js_1.transactions)
            .where((0, drizzle_orm_1.eq)(transactions_js_1.transactions.id, id))
            .returning({ id: transactions_js_1.transactions.id });
        if (!deletedTransaction) {
            return res.status(404).json({ success: false, error: 'Transaksi tidak ditemukan.' });
        }
        res.json({ success: true, data: deletedTransaction });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map