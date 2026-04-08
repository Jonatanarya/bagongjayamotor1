import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { suggestions } from '../schema/suggestions.js';
import { suggestionService } from '../services/suggestion.service.js';
import { requireAdmin } from './admin.routes.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const suggestions = await suggestionService.getAllSuggestions();
    res.json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { nama, pesan, email } = req.body;
    if (!pesan || pesan.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Pesan saran wajib diisi.' });
    }

    const suggestion = await suggestionService.createSuggestion({
      customerName: nama?.trim() || 'Anonim',
      message: pesan.trim(),
      email: email?.trim() || null,
    });

    res.status(201).json({ success: true, data: suggestion });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const [deletedSuggestion] = await db
      .delete(suggestions)
      .where(eq(suggestions.id, id))
      .returning({ id: suggestions.id });

    if (!deletedSuggestion) {
      return res.status(404).json({ success: false, error: 'Saran tidak ditemukan.' });
    }

    res.json({ success: true, data: deletedSuggestion });
  } catch (error) {
    next(error);
  }
});

export default router;
