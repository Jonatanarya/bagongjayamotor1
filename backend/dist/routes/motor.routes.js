"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const motor_service_js_1 = require("../services/motor.service.js");
const admin_routes_js_1 = require("./admin.routes.js");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    try {
        const { search, status, limit, offset } = req.query;
        const data = await motor_service_js_1.motorService.getAllMotors({
            search: typeof search === 'string' ? search : '',
            status: typeof status === 'string' ? status : undefined,
            limit: typeof limit === 'string' ? Number(limit) : 50,
            offset: typeof offset === 'string' ? Number(offset) : 0,
        });
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
router.get('/dashboard/summary', async (_req, res, next) => {
    try {
        const data = await motor_service_js_1.motorService.getMotorStats();
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const motor = await motor_service_js_1.motorService.getMotorById(String(req.params.id));
        res.json({ success: true, data: motor });
    }
    catch (error) {
        next(error);
    }
});
router.post('/', admin_routes_js_1.requireAdmin, async (req, res, next) => {
    try {
        const motor = await motor_service_js_1.motorService.createMotor(req.body);
        res.status(201).json({ success: true, data: motor });
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', admin_routes_js_1.requireAdmin, async (req, res, next) => {
    try {
        const motor = await motor_service_js_1.motorService.updateMotor(String(req.params.id), req.body);
        res.json({ success: true, data: motor });
    }
    catch (error) {
        next(error);
    }
});
router.patch('/:id/status', admin_routes_js_1.requireAdmin, async (req, res, next) => {
    try {
        const status = req.body?.status === 'Terjual' ? 'Terjual' : 'Tersedia';
        const motor = await motor_service_js_1.motorService.toggleStatus(String(req.params.id), status);
        res.json({ success: true, data: motor });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', admin_routes_js_1.requireAdmin, async (req, res, next) => {
    try {
        const id = String(req.params.id);
        await motor_service_js_1.motorService.deleteMotor(id);
        res.json({ success: true, data: { id } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=motor.routes.js.map