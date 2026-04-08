import crypto from 'crypto';
import express from 'express';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { users } from '../schema/users.js';
import { createAuthToken, getAuthUserFromToken } from '../utils/auth.js';

const router = express.Router();

async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const user = await getAuthUserFromToken(token);

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    (req as express.Request & { authUser?: typeof user }).authUser = user;
    next();
  } catch (error) {
    next(error);
  }
}

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email dan password wajib diisi.' });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user?.password) {
      return res.status(401).json({ success: false, error: 'Email atau password salah.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Email atau password salah.' });
    }

    const token = createAuthToken({
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
  } catch (error) {
    next(error);
  }
});

router.get('/session', requireAdmin, async (req, res) => {
  const authUser = (req as express.Request & { authUser?: { id: string; email: string; name: string; role: string | null } }).authUser;

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
    const adminUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, 'ADMIN'));

    res.json({ success: true, data: adminUsers });
  } catch (error) {
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

    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      });

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
});

router.put('/admins/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const { name, email } = req.body ?? {};

    const [updatedUser] = await db
      .update(users)
      .set({
        name,
        email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      });

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'Admin tidak ditemukan.' });
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete('/admins/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!deletedUser) {
      return res.status(404).json({ success: false, error: 'Admin tidak ditemukan.' });
    }

    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
});

export { requireAdmin };
export default router;
