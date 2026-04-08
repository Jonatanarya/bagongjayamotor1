"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthToken = createAuthToken;
exports.verifyAuthToken = verifyAuthToken;
exports.getAuthUserFromToken = getAuthUserFromToken;
const crypto_1 = __importDefault(require("crypto"));
const database_js_1 = require("../config/database.js");
const users_js_1 = require("../schema/users.js");
const drizzle_orm_1 = require("drizzle-orm");
const TOKEN_TTL_SECONDS = 60 * 60 * 12;
function getSecret() {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
        throw new Error('AUTH_SECRET belum dikonfigurasi.');
    }
    return secret;
}
function toBase64Url(value) {
    return Buffer.from(value).toString('base64url');
}
function fromBase64Url(value) {
    return Buffer.from(value, 'base64url').toString('utf8');
}
function createAuthToken(payload) {
    const fullPayload = {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    };
    const encodedPayload = toBase64Url(JSON.stringify(fullPayload));
    const signature = crypto_1.default
        .createHmac('sha256', getSecret())
        .update(encodedPayload)
        .digest('base64url');
    return `${encodedPayload}.${signature}`;
}
function verifyAuthToken(token) {
    if (!token) {
        return null;
    }
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) {
        return null;
    }
    const expectedSignature = crypto_1.default
        .createHmac('sha256', getSecret())
        .update(encodedPayload)
        .digest('base64url');
    if (signature !== expectedSignature) {
        return null;
    }
    try {
        const payload = JSON.parse(fromBase64Url(encodedPayload));
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            return null;
        }
        return payload;
    }
    catch {
        return null;
    }
}
async function getAuthUserFromToken(token) {
    const payload = verifyAuthToken(token);
    if (!payload) {
        return null;
    }
    const [user] = await database_js_1.db
        .select({
        id: users_js_1.users.id,
        email: users_js_1.users.email,
        name: users_js_1.users.name,
        role: users_js_1.users.role,
    })
        .from(users_js_1.users)
        .where((0, drizzle_orm_1.eq)(users_js_1.users.id, payload.userId))
        .limit(1);
    return user ?? null;
}
//# sourceMappingURL=auth.js.map