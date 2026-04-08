import { Router } from 'express';
import { motorService } from '../services/motor.service.js';
import { requireAdmin } from './admin.routes.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { search, status, limit, offset } = req.query;
    const data = await motorService.getAllMotors({
      search: typeof search === 'string' ? search : '',
      status: typeof status === 'string' ? status : undefined,
      limit: typeof limit === 'string' ? Number(limit) : 50,
      offset: typeof offset === 'string' ? Number(offset) : 0,
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard/summary', async (_req, res, next) => {
  try {
    const data = await motorService.getMotorStats();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const motor = await motorService.getMotorById(String(req.params.id));
    res.json({ success: true, data: motor });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const motor = await motorService.createMotor(req.body);
    res.status(201).json({ success: true, data: motor });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const motor = await motorService.updateMotor(String(req.params.id), req.body);
    res.json({ success: true, data: motor });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const status = req.body?.status === 'Terjual' ? 'Terjual' : 'Tersedia';
    const motor = await motorService.toggleStatus(String(req.params.id), status);
    res.json({ success: true, data: motor });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await motorService.deleteMotor(id);
    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
});

export default router;
