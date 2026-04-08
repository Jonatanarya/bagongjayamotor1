"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const motors_js_1 = require("./motors.js");
exports.transactions = (0, pg_core_1.pgTable)("transactions", {
    id: (0, pg_core_1.text)("id").primaryKey(), // TRX-001
    type: (0, pg_core_1.text)("type", { enum: ["Jual", "Beli"] }).notNull(),
    motorId: (0, pg_core_1.text)("motor_id").references(() => motors_js_1.motors.id),
    clientName: (0, pg_core_1.text)("client_name").notNull(),
    clientWa: (0, pg_core_1.text)("client_wa"),
    amount: (0, pg_core_1.bigint)("amount", { mode: "number" }).notNull(),
    date: (0, pg_core_1.date)("date").notNull(),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
//# sourceMappingURL=transactions.js.map