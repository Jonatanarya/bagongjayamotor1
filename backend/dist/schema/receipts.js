"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receipts = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const transactions_js_1 = require("./transactions.js");
const users_js_1 = require("./users.js");
exports.receipts = (0, pg_core_1.pgTable)("receipts", {
    id: (0, pg_core_1.text)("id").primaryKey(), // RCP-001
    transactionId: (0, pg_core_1.text)("transaction_id").notNull().unique().references(() => transactions_js_1.transactions.id),
    companyName: (0, pg_core_1.text)("company_name").default("BAGONG JAYA MOTOR"),
    companyAddress: (0, pg_core_1.text)("company_address"),
    printedAt: (0, pg_core_1.timestamp)("printed_at"),
    printedByAdminId: (0, pg_core_1.text)("printed_by_admin_id").references(() => users_js_1.users.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
//# sourceMappingURL=receipts.js.map