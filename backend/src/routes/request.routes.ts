import { Router } from 'express';
import { db } from '../config/database.js';
import { sellRequests } from '../schema/sellRequests.js';
import { desc, eq } from 'drizzle-orm';
import { generateId } from '../utils/id-generator.js';
import { requireAdmin } from './admin.routes.js';

const router = Router();

router.get('/', requireAdmin, async (_req, res, next) => {
  try {
    const data = await db.select().from(sellRequests).orderBy(desc(sellRequests.createdAt));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const id = await generateId('REQ');
    const payload = {
      id,
      customerName: req.body?.nama,
      customerWa: req.body?.wa,
      customerAddress: req.body?.alamat,
      merk: req.body?.merk,
      tipe: req.body?.tipe,
      tahun: Number(req.body?.tahun),
      hargaPenawaran: Number(req.body?.hargaPenawaran || 0),
      deskripsi: req.body?.deskripsi || null,
      imageUrl: req.body?.imageUrl || null,
      fotoDepan: req.body?.fotoDepan || null,
      fotoBelakang: req.body?.fotoBelakang || null,
      fotoSampingKiri: req.body?.fotoSampingKiri || null,
      fotoSampingKanan: req.body?.fotoSampingKanan || null,
      fotoSTNKBPKB: req.body?.fotoSTNKBPKB || null,
      status: 'Pending',
    } as const;

    const [sellRequest] = await db.insert(sellRequests).values(payload).returning();
    res.status(201).json({ success: true, data: sellRequest });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const [sellRequest] = await db
      .update(sellRequests)
      .set({
        status: req.body?.status,
        updatedAt: new Date(),
      })
      .where(eq(sellRequests.id, id))
      .returning();

    if (!sellRequest) {
      return res.status(404).json({ success: false, error: 'Request tidak ditemukan.' });
    }

    res.json({ success: true, data: sellRequest });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const [deletedRequest] = await db
      .delete(sellRequests)
      .where(eq(sellRequests.id, id))
      .returning({ id: sellRequests.id });

    if (!deletedRequest) {
      return res.status(404).json({ success: false, error: 'Request tidak ditemukan.' });
    }

    res.json({ success: true, data: deletedRequest });
  } catch (error) {
    next(error);
  }
});

export default router;
