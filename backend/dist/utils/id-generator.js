"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
const database_js_1 = require("../config/database.js");
const index_js_1 = require("../schema/index.js");
const drizzle_orm_1 = require("drizzle-orm");
async function generateId(prefix) {
    let table;
    let idColumn;
    switch (prefix) {
        case "MTR":
            table = index_js_1.motors;
            idColumn = index_js_1.motors.id;
            break;
        case "TRX":
            table = index_js_1.transactions;
            idColumn = index_js_1.transactions.id;
            break;
        case "REQ":
            table = index_js_1.sellRequests;
            idColumn = index_js_1.sellRequests.id;
            break;
        case "SGT":
            table = index_js_1.suggestions;
            idColumn = index_js_1.suggestions.id;
            break;
        case "RCP":
            table = index_js_1.receipts;
            idColumn = index_js_1.receipts.id;
            break;
        default:
            throw new Error(`Unknown prefix: ${prefix}`);
    }
    // Get the latest ID with this prefix
    const [latest] = await database_js_1.db
        .select({ id: idColumn })
        .from(table)
        .where((0, drizzle_orm_1.sql) `${idColumn} LIKE ${prefix + "-%"}`)
        .orderBy((0, drizzle_orm_1.desc)(idColumn))
        .limit(1);
    let nextNumber = 1;
    if (latest?.id) {
        const currentNumber = parseInt(latest.id.split("-")[1]);
        nextNumber = currentNumber + 1;
    }
    return `${prefix}-${nextNumber.toString().padStart(3, "0")}`;
}
//# sourceMappingURL=id-generator.js.map