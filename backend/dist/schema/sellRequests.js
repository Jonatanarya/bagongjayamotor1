"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellRequests = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.sellRequests = (0, pg_core_1.pgTable)("sell_requests", {
    id: (0, pg_core_1.text)("id").primaryKey(), // REQ-001
    customerName: (0, pg_core_1.text)("customer_name").notNull(),
    customerWa: (0, pg_core_1.text)("customer_wa").notNull(),
    customerAddress: (0, pg_core_1.text)("customer_address").notNull(),
    merk: (0, pg_core_1.varchar)("merk", { length: 100 }).notNull(),
    tipe: (0, pg_core_1.varchar)("tipe", { length: 100 }).notNull(),
    tahun: (0, pg_core_1.integer)("tahun").notNull(),
    hargaPenawaran: (0, pg_core_1.bigint)("harga_penawaran", { mode: "number" }).notNull(),
    deskripsi: (0, pg_core_1.text)("deskripsi"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Pending"), // Pending | Contacted | Rejected | Accepted
    createdByAdminId: (0, pg_core_1.text)("created_by_admin_id"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
//# sourceMappingURL=sellRequests.js.map