import express from 'express';
import { addToWatchlist, getWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, addToWatchlist);
router.get('/', protect, getWatchlist);
router.delete('/:id', protect, removeFromWatchlist);

export default router;
