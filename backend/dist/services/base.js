"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.sendResponse = sendResponse;
exports.sendError = sendError;
// Utility functions
function generateId(prefix, number) {
    return `${prefix}-${number.toString().padStart(3, '0')}`;
}
function sendResponse(res, status, data, message) {
    return res.status(status).json({
        success: status < 400,
        data,
        message,
    });
}
function sendError(res, error) {
    console.error('API Error:', error);
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
    return res.status(status).json({
        success: false,
        error: message,
    });
}
//# sourceMappingURL=base.js.map