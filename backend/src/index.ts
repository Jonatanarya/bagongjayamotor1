import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/error';
import { router as authRouter } from 'better-auth/api';
import { toNodeHandler } from 'better-call/node';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { users } from './schema/users.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOrigin = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) || ['http://localhost:5173'];
app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await db.execute('SELECT 1');
    res.json({
      status: 'OK',
      message: 'Bagong Jaya Motor API is running',
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

import suggestionRoutes from './routes/suggestion.routes.js';
import adminRoutes from './routes/admin.routes.js';
import motorRoutes from './routes/motor.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import requestRoutes from './routes/request.routes.js';

// API Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Bagong Jaya Motor API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      motors: 'GET /api/motors',
      suggestions: 'GET /api/suggestions, POST /api/suggestions',
    }
  });
});

const authBaseUrl = process.env.AUTH_BASE_URL ?? `http://localhost:${PORT}/api/auth`;
// @ts-ignore - better-auth type mismatch, works at runtime
const authRoutes = authRouter({ baseURL: authBaseUrl }, {
  plugins: [drizzleAdapter(db, { schema: { users }, provider: 'pg' })],
});
const authHandler = toNodeHandler(authRoutes.handler);
app.use('/api/auth', (req, res, next) => {
  authHandler(req, res).catch(next);
});

app.use('/api/motors', motorRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
});