"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.motorService = exports.MotorService = void 0;
const database_js_1 = require("../config/database.js");
const motors_js_1 = require("../schema/motors.js");
const drizzle_orm_1 = require("drizzle-orm");
const id_generator_js_1 = require("../utils/id-generator.js");
class MotorService {
    async getAllMotors(filters) {
        const { search = "", status, limit = 10, offset = 0 } = filters;
        const conditions = [];
        if (search) {
            conditions.push((0, drizzle_orm_1.sql) `${motors_js_1.motors.merk} ILIKE ${`%${search}%`} OR ${motors_js_1.motors.tipe} ILIKE ${`%${search}%`}`);
        }
        if (status) {
            conditions.push((0, drizzle_orm_1.eq)(motors_js_1.motors.status, status));
        }
        const [data, [{ count }]] = await Promise.all([
            database_js_1.db
                .select()
                .from(motors_js_1.motors)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(motors_js_1.motors.createdAt))
                .limit(limit)
                .offset(offset),
            database_js_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(motors_js_1.motors).where((0, drizzle_orm_1.and)(...conditions)),
        ]);
        return { motors: data, total: Number(count) };
    }
    async getMotorById(id) {
        const [motor] = await database_js_1.db.select().from(motors_js_1.motors).where((0, drizzle_orm_1.eq)(motors_js_1.motors.id, id));
        if (!motor)
            throw new Error("Motor tidak ditemukan");
        return motor;
    }
    async createMotor(data) {
        const id = await (0, id_generator_js_1.generateId)("MTR");
        const [motor] = await database_js_1.db
            .insert(motors_js_1.motors)
            .values({ ...data, id })
            .returning();
        return motor;
    }
    async updateMotor(id, data) {
        const [motor] = await database_js_1.db
            .update(motors_js_1.motors)
            .set({ ...data, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(motors_js_1.motors.id, id))
            .returning();
        if (!motor)
            throw new Error("Motor tidak ditemukan");
        return motor;
    }
    async deleteMotor(id) {
        await database_js_1.db.delete(motors_js_1.motors).where((0, drizzle_orm_1.eq)(motors_js_1.motors.id, id));
    }
    async toggleStatus(id, status) {
        return this.updateMotor(id, { status });
    }
    async getMotorStats() {
        const result = await database_js_1.db.execute((0, drizzle_orm_1.sql) `
      SELECT
        COUNT(*) FILTER (WHERE status = 'Tersedia') as available,
        COUNT(*) FILTER (WHERE status = 'Terjual') as sold,
        COALESCE(SUM(harga), 0) as total_value
      FROM motors
    `);
        return result[0];
    }
}
exports.MotorService = MotorService;
exports.motorService = new MotorService();
//# sourceMappingURL=motor.service.js.map