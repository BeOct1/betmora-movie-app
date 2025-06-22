import express from 'express';
import { addReview, getMovieReviews, getMovieRating, getUserReviews } from '../controllers/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Add a review (auth required)
router.post('/', authMiddleware, addReview);
// Get all reviews for a movie
router.get('/:movieId', getMovieReviews);
// Get average rating for a movie
router.get('/:movieId/avg', getMovieRating);
// Get all reviews by the logged-in user
router.get('/user', authMiddleware, getUserReviews);

export default router;
