"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
dotenv_1.default.config();
// Database connection
const connectionString = process.env.DATABASE_URL;
// Create postgres client
const client = (0, postgres_1.default)(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
});
exports.client = client;
// Create drizzle instance
exports.db = (0, postgres_js_1.drizzle)(client);
//# sourceMappingURL=database.js.map