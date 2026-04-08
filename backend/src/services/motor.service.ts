import { db } from "../config/database.js";
import { motors } from "../schema/motors.js";
import { eq, like, and, desc, sql } from "drizzle-orm";
import { generateId } from "../utils/id-generator.js";

export class MotorService {
  async getAllMotors(filters: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const { search = "", status, limit = 10, offset = 0 } = filters;

    const conditions = [];
    if (search) {
      conditions.push(
        sql`${motors.merk} ILIKE ${`%${search}%`} OR ${motors.tipe} ILIKE ${`%${search}%`}`
      );
    }
    if (status) {
      conditions.push(eq(motors.status, status));
    }

    const [data, [{ count }]] = await Promise.all([
      db
        .select()
        .from(motors)
        .where(and(...conditions))
        .orderBy(desc(motors.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(motors).where(and(...conditions)),
    ]);

    return { motors: data, total: Number(count) };
  }

  async getMotorById(id: string) {
    const [motor] = await db.select().from(motors).where(eq(motors.id, id));
    if (!motor) throw new Error("Motor tidak ditemukan");
    return motor;
  }

  async createMotor(data: any) {
    const id = await generateId("MTR");
    const [motor] = await db
      .insert(motors)
      .values({ ...data, id })
      .returning();
    return motor;
  }

  async updateMotor(id: string, data: any) {
    const [motor] = await db
      .update(motors)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(motors.id, id))
      .returning();
    if (!motor) throw new Error("Motor tidak ditemukan");
    return motor;
  }

  async deleteMotor(id: string) {
    await db.delete(motors).where(eq(motors.id, id));
  }

  async toggleStatus(id: string, status: "Tersedia" | "Terjual") {
    return this.updateMotor(id, { status });
  }

  async getMotorStats() {
    const result = await db.execute(sql`
      SELECT
        COUNT(*) FILTER (WHERE status = 'Tersedia') as available,
        COUNT(*) FILTER (WHERE status = 'Terjual') as sold,
        COALESCE(SUM(harga), 0) as total_value
      FROM motors
    `);
    return result[0];
  }
}

export const motorService = new MotorService();