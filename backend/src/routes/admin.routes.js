import express from 'express';
import { db } from '../config/database';
import { users } from '../schema/users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const router = express.Router();

// Middleware to check if user is authenticated and is admin
const requireAdmin = async (req, res, next) => {
  try {
    // For now, we'll skip authentication check since Better Auth handles it
    // In production, you should verify the session/token here
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Get all admin users
router.get('/admins', requireAdmin, async (req, res) => {
  try {
    const adminUsers = await db.select().from(users).where(eq(users.role, 'ADMIN'));
    res.json(adminUsers);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Gagal mengambil data admin' });
  }
});

// Create new admin user
router.post('/admins', requireAdmin, async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Email, nama, dan password wajib diisi' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
      role: 'ADMIN',
    }).returning();

    // Don't return password in response
    const { password: _, ...userWithoutPassword } = newUser[0];

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Gagal membuat admin baru' });
  }
});

// Update admin user
router.put('/admins/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await db.update(users)
      .set({ name, email })
      .where(eq(users.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: 'Admin tidak ditemukan' });
    }

    // Don't return password in response
    const { password: _, ...userWithoutPassword } = updatedUser[0];

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'Gagal mengupdate admin' });
  }
});

// Delete admin user
router.delete('/admins/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the current admin (you might want to add session check)
    // For now, we'll allow deletion but you should add proper authorization

    const deletedUser = await db.delete(users)
      .where(eq(users.id, id))
      .returning();

    if (deletedUser.length === 0) {
      return res.status(404).json({ error: 'Admin tidak ditemukan' });
    }

    res.json({ message: 'Admin berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Gagal menghapus admin' });
  }
});

export default router;