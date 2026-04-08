"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_js_1 = require("../config/database.js");
const sellRequests_js_1 = require("../schema/sellRequests.js");
const drizzle_orm_1 = require("drizzle-orm");
const id_generator_js_1 = require("../utils/id-generator.js");
const admin_routes_js_1 = require("./admin.routes.js");
const router = (0, express_1.Router)();
router.get('/', admin_routes_js_1.requireAdmin, async (_req, res, next) => {
    try {
        const data = await database_js_1.db.select().from(sellRequests_js_1.sellRequests).orderBy((0, drizzle_orm_1.desc)(sellRequests_js_1.sellRequests.createdAt));
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const id = await (0, id_generator_js_1.generateId)('REQ');
        const payload = {
            id,
            customerName: req.body?.nama,
            customerWa: req.body?.wa,
            customerAddress: req.body?.alamat,
            merk: req.body?.merk,
            tipe: req.body?.tipe,
            tahun: Number(req.body?.tahun),
            hargaPenawaran: Number(req.body?.hargaPenawaran || 0),
            deskripsi: req.body?.deskripsi || null,
            imageUrl: req.body?.imageUrl || null,
            status: 'Pending',
        };
        const [sellRequest] = await database_js_1.db.insert(sellRequests_js_1.sellRequests).values(payload).returning();
        res.status(201).json({ success: true, data: sellRequest });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', admin_routes_js_1.requireAdmin, async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const [sellRequest] = await database_js_1.db
            .update(sellRequests_js_1.sellRequests)
            .set({
            status: req.body?.status,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(sellRequests_js_1.sellRequests.id, id))
            .returning();
        if (!sellRequest) {
            return res.status(404).json({ success: false, error: 'Request tidak ditemukan.' });
        }
        res.json({ success: true, data: sellRequest });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', admin_routes_js_1.requireAdmin, async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const [deletedRequest] = await database_js_1.db
            .delete(sellRequests_js_1.sellRequests)
            .where((0, drizzle_orm_1.eq)(sellRequests_js_1.sellRequests.id, id))
            .returning({ id: sellRequests_js_1.sellRequests.id });
        if (!deletedRequest) {
            return res.status(404).json({ success: false, error: 'Request tidak ditemukan.' });
        }
        res.json({ success: true, data: deletedRequest });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=request.routes.js.map