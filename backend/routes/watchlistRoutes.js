import express from 'express';
import { addToWatchlist, getWatchlist, removeFromWatchlist } from '../controllers/watchlistController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', authMiddleware, addToWatchlist);
router.get('/', authMiddleware, getWatchlist);
router.delete('/:id', authMiddleware, removeFromWatchlist);

export default router;
