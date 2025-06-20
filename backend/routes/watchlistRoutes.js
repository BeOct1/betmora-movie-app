import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist
} from '../controllers/watchlistController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.delete('/:movieId', removeFromWatchlist);

export default router;
// watchlistRoutes.js
// This code defines the routes for managing a user's watchlist in a movie application.