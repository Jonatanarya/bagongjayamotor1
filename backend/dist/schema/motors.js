"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.motors = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.motors = (0, pg_core_1.pgTable)("motors", {
    id: (0, pg_core_1.text)("id").primaryKey(), // MTR-001
    merk: (0, pg_core_1.varchar)("merk", { length: 100 }).notNull(),
    tipe: (0, pg_core_1.varchar)("tipe", { length: 100 }).notNull(),
    tahun: (0, pg_core_1.integer)("tahun").notNull(),
    harga: (0, pg_core_1.bigint)("harga", { mode: "number" }).notNull(),
    kilometer: (0, pg_core_1.integer)("kilometer"), // NEW FIELD
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Tersedia"), // Tersedia | Terjual
    imageUrl: (0, pg_core_1.text)("image_url"),
    deskripsi: (0, pg_core_1.text)("deskripsi"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => ({
    // Unique constraint to prevent duplicates
    uniqueMotor: (0, pg_core_1.unique)().on(table.merk, table.tipe, table.tahun),
}));
//# sourceMappingURL=motors.js.map