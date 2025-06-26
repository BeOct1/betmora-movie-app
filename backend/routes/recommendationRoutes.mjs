console.log('TMDB_API_KEY:', process.env.TMDB_API_KEY);
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const recommendationController = require('../controllers/recommendationController.js');

const router = express.Router();

// New personalized endpoints
router.get('/continue-watching', authMiddleware, recommendationController.getContinueWatching);
router.get('/because-you-liked', authMiddleware, recommendationController.getBecauseYouLiked);
router.get('/personalized', authMiddleware, recommendationController.getPersonalizedRecommendations);

export default router;
