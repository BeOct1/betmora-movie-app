import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  createWatchlist,
  getWatchlists,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  renameWatchlist,
  deleteWatchlist
} from '../controllers/watchlistController.js';

const router = express.Router();

// Default watchlist routes
router.post('/', authMiddleware, addToWatchlist);
router.get('/', authMiddleware, getWatchlist);
router.delete('/:id', authMiddleware, removeFromWatchlist);

// Custom watchlist routes
router.post('/custom', authMiddleware, createWatchlist);
router.get('/custom', authMiddleware, getWatchlists);
router.post('/custom/add', authMiddleware, addMovieToWatchlist);
router.post('/custom/remove', authMiddleware, removeMovieFromWatchlist);
router.post('/custom/rename', authMiddleware, renameWatchlist);
router.post('/custom/delete', authMiddleware, deleteWatchlist);

export default router;
