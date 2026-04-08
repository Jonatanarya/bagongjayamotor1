"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
function errorHandler(err, req, res, next) {
    console.error('API Error:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
}
//# sourceMappingURL=error.js.map