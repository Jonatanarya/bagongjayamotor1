"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.suggestions = (0, pg_core_1.pgTable)("suggestions", {
    id: (0, pg_core_1.text)("id").primaryKey(), // SGT-001
    customerName: (0, pg_core_1.text)("customer_name"),
    message: (0, pg_core_1.text)("message").notNull(),
    email: (0, pg_core_1.text)("email"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Unread"), // Unread | Read | Archived
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
//# sourceMappingURL=suggestions.js.map