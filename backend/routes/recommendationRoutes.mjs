import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getContinueWatching, getBecauseYouLiked, getPersonalizedRecommendations } from '../controllers/recommendationController.js';

const router = express.Router();

// Existing recommendations endpoint (already present in old file)
// ...

// New personalized endpoints
router.get('/continue-watching', authMiddleware, getContinueWatching);
router.get('/because-you-liked', authMiddleware, getBecauseYouLiked);
router.get('/personalized', authMiddleware, getPersonalizedRecommendations);

export default router;
