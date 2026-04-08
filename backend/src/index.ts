import crypto from 'crypto';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { users } from './schema/users.js';
import suggestionRoutes from './routes/suggestion.routes.js';
import adminRoutes from './routes/admin.routes.js';
import motorRoutes from './routes/motor.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import requestRoutes from './routes/request.routes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

const corsOrigin =
  process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) || [
    'http://localhost:5173',
    'http://localhost:5174',
  ];

async function ensureDefaultAdmin() {
  const [adminUser] = await db.select().from(users).where(eq(users.email, 'admin@bagongjaya.com')).limit(1);
  const hashedPassword = await bcrypt.hash('admin123', 10);

  if (!adminUser) {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: 'admin@bagongjaya.com',
      name: 'Administrator',
      password: hashedPassword,
      role: 'ADMIN',
    });
    return;
  }

  if (!adminUser.password) {
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, adminUser.id));
  }
}

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (_req, res) => {
  try {
    await db.execute('SELECT 1');
    res.json({
      status: 'OK',
      message: 'Bagong Jaya Motor API is running',
      database: 'Connected',
    });
  } catch (error) {
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

app.use('/api/admin', adminRoutes);
app.use('/api/motors', motorRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/suggestions', suggestionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

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
