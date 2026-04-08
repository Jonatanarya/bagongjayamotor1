"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const database_js_1 = require("./config/database.js");
const error_js_1 = require("./middleware/error.js");
const users_js_1 = require("./schema/users.js");
const suggestion_routes_js_1 = __importDefault(require("./routes/suggestion.routes.js"));
const admin_routes_js_1 = __importDefault(require("./routes/admin.routes.js"));
const motor_routes_js_1 = __importDefault(require("./routes/motor.routes.js"));
const transaction_routes_js_1 = __importDefault(require("./routes/transaction.routes.js"));
const request_routes_js_1 = __importDefault(require("./routes/request.routes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 3000);
const corsOrigin = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) || [
    'http://localhost:5173',
    'http://localhost:5174',
];
async function ensureDefaultAdmin() {
    const [adminUser] = await database_js_1.db.select().from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.email, 'admin@bagongjaya.com')).limit(1);
    const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
    if (!adminUser) {
        await database_js_1.db.insert(users_js_1.users).values({
            id: crypto_1.default.randomUUID(),
            email: 'admin@bagongjaya.com',
            name: 'Administrator',
            password: hashedPassword,
            role: 'ADMIN',
        });
        return;
    }
    if (!adminUser.password) {
        await database_js_1.db
            .update(users_js_1.users)
            .set({
            password: hashedPassword,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(users_js_1.users.id, adminUser.id));
    }
}
app.use((0, cors_1.default)({
    origin: corsOrigin,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', async (_req, res) => {
    try {
        await database_js_1.db.execute('SELECT 1');
        res.json({
            status: 'OK',
            message: 'Bagong Jaya Motor API is running',
            database: 'Connected',
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
app.get('/api', (_req, res) => {
    res.json({
        message: 'Bagong Jaya Motor API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            auth: 'POST /api/admin/login, GET /api/admin/session',
            motors: 'GET /api/motors',
            transactions: 'GET /api/transactions',
            requests: 'GET /api/requests, POST /api/requests',
            suggestions: 'GET /api/suggestions, POST /api/suggestions',
        },
    });
});
app.use('/api/admin', admin_routes_js_1.default);
app.use('/api/motors', motor_routes_js_1.default);
app.use('/api/transactions', transaction_routes_js_1.default);
app.use('/api/requests', request_routes_js_1.default);
app.use('/api/suggestions', suggestion_routes_js_1.default);
app.use(error_js_1.notFoundHandler);
app.use(error_js_1.errorHandler);
async function startServer() {
    await ensureDefaultAdmin();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
        console.log(`API docs: http://localhost:${PORT}/api`);
        console.log('Default admin: admin@bagongjaya.com / admin123');
    });
}
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map