"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const crypto_1 = __importDefault(require("crypto"));
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const database_js_1 = require("../config/database.js");
const users_js_1 = require("../schema/users.js");
const auth_js_1 = require("../utils/auth.js");
const router = express_1.default.Router();
async function requireAdmin(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
        const user = await (0, auth_js_1.getAuthUserFromToken)(token);
        if (!user || user.role !== 'ADMIN') {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        req.authUser = user;
        next();
    }
    catch (error) {
        next(error);
    }
}
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body ?? {};
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email dan password wajib diisi.' });
        }
        const [user] = await database_js_1.db.select().from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.email, email)).limit(1);
        if (!user?.password) {
            return res.status(401).json({ success: false, error: 'Email atau password salah.' });
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, error: 'Email atau password salah.' });
        }
        const token = (0, auth_js_1.createAuthToken)({
            userId: user.id,
            email: user.email,
            role: user.role ?? 'ADMIN',
        });
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role ?? 'ADMIN',
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/session', requireAdmin, async (req, res) => {
    const authUser = req.authUser;
    res.json({
        success: true,
        data: {
            user: authUser,
        },
    });
});
router.post('/logout', requireAdmin, async (_req, res) => {
    res.json({
        success: true,
        data: {
            loggedOut: true,
        },
    });
});
router.get('/admins', requireAdmin, async (_req, res, next) => {
    try {
        const adminUsers = await database_js_1.db
            .select({
            id: users_js_1.users.id,
            email: users_js_1.users.email,
            name: users_js_1.users.name,
            role: users_js_1.users.role,
            createdAt: users_js_1.users.createdAt,
        })
            .from(users_js_1.users)
            .where((0, drizzle_orm_1.eq)(users_js_1.users.role, 'ADMIN'));
        res.json({ success: true, data: adminUsers });
    }
    catch (error) {
        next(error);
    }
});
router.post('/admins', requireAdmin, async (req, res, next) => {
    try {
        const { email, name, password } = req.body ?? {};
        if (!email || !name || !password) {
            return res.status(400).json({ success: false, error: 'Email, nama, dan password wajib diisi.' });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ success: false, error: 'Password minimal 6 karakter.' });
        }
        const [existingUser] = await database_js_1.db.select().from(users_js_1.users).where((0, drizzle_orm_1.eq)(users_js_1.users.email, email)).limit(1);
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email sudah terdaftar.' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const [newUser] = await database_js_1.db
            .insert(users_js_1.users)
            .values({
            id: crypto_1.default.randomUUID(),
            email,
            name,
            password: hashedPassword,
            role: 'ADMIN',
        })
            .returning({
            id: users_js_1.users.id,
            email: users_js_1.users.email,
            name: users_js_1.users.name,
            role: users_js_1.users.role,
            createdAt: users_js_1.users.createdAt,
        });
        res.status(201).json({ success: true, data: newUser });
    }
    catch (error) {
        next(error);
    }
});
router.put('/admins/:id', requireAdmin, async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const { name, email } = req.body ?? {};
        const [updatedUser] = await database_js_1.db
            .update(users_js_1.users)
            .set({
            name,
            email,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(users_js_1.users.id, id))
            .returning({
            id: users_js_1.users.id,
            email: users_js_1.users.email,
            name: users_js_1.users.name,
            role: users_js_1.users.role,
            createdAt: users_js_1.users.createdAt,
        });
        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'Admin tidak ditemukan.' });
        }
        res.json({ success: true, data: updatedUser });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/admins/:id', requireAdmin, async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const [deletedUser] = await database_js_1.db
            .delete(users_js_1.users)
            .where((0, drizzle_orm_1.eq)(users_js_1.users.id, id))
            .returning({ id: users_js_1.users.id });
        if (!deletedUser) {
            return res.status(404).json({ success: false, error: 'Admin tidak ditemukan.' });
        }
        res.json({ success: true, data: { id } });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map