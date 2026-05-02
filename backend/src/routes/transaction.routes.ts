import { Router } from 'express';
import { db } from '../config/database.js';
import { transactions } from '../schema/transactions.js';
import { motors } from '../schema/motors.js';
import { desc, eq, sql } from 'drizzle-orm';
import { generateId } from '../utils/id-generator.js';
import { requireAdmin } from './admin.routes.js';

const router = Router();

router.get('/', requireAdmin, async (_req, res, next) => {
  try {
    const data = await db.select().from(transactions).orderBy(desc(transactions.date), desc(transactions.createdAt));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/summary', requireAdmin, async (_req, res, next) => {
  try {
    const [summary] = await db.execute(sql`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Jual' THEN amount ELSE 0 END), 0) AS total_jual,
        COALESCE(SUM(CASE WHEN type = 'Beli' THEN amount ELSE 0 END), 0) AS total_beli,
        COUNT(*) AS total_transaksi
      FROM transactions
    `);

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const id = await generateId('TRX');
    const type = (req.body?.type === 'Beli' ? 'Beli' : 'Jual') as 'Jual' | 'Beli';
    const motorId = req.body?.motorId || null;

    const payload = {
      id,
      type,
      motorId,
      clientName: req.body?.clientName,
      clientWa: req.body?.clientWa || null,
      amount: Number(req.body?.amount || 0),
      date: req.body?.date,
      notes: req.body?.notes || null,
    };

    const [transaction] = await db.insert(transactions).values(payload).returning();

    // Auto-update status motor jadi Terjual saat transaksi Jual berhasil
    if (type === 'Jual' && motorId) {
      await db.update(motors).set({ status: 'Terjual', updatedAt: new Date() }).where(eq(motors.id, motorId));
    }

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const [transaction] = await db
      .update(transactions)
      .set({
        type: (req.body?.type === 'Beli' ? 'Beli' : 'Jual') as 'Jual' | 'Beli',
        motorId: req.body?.motorId ?? null,
        clientName: req.body?.clientName,
        clientWa: req.body?.clientWa ?? null,
        amount: req.body?.amount ? Number(req.body.amount) : undefined,
        date: req.body?.date,
        notes: req.body?.notes ?? null,
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, id))
      .returning();

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaksi tidak ditemukan.' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const [deletedTransaction] = await db
      .delete(transactions)
      .where(eq(transactions.id, id))
      .returning({ id: transactions.id });

    if (!deletedTransaction) {
      return res.status(404).json({ success: false, error: 'Transaksi tidak ditemukan.' });
    }

    res.json({ success: true, data: deletedTransaction });
  } catch (error) {
    next(error);
  }
});

export default router;
