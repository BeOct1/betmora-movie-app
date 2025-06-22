import Review from '../models/Review.js';

// Add a review
export const addReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;
  if (!movieId || rating == null) return res.status(400).json({ message: 'Movie, rating required' });
  const review = await Review.create({
    user: req.userId,
    movieId,
    rating,
    comment,
  });
  res.status(201).json(review);
};

// Get all reviews for a movie
export const getMovieReviews = async (req, res) => {
  const { movieId } = req.params;
  const reviews = await Review.find({ movieId }).populate('user', 'name');
  res.json(reviews);
};

// Get all reviews by a user
export const getUserReviews = async (req, res) => {
  const reviews = await Review.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(reviews);
};

// Get average rating for a movie
export const getMovieRating = async (req, res) => {
  const { movieId } = req.params;
  const reviews = await Review.find({ movieId });
  if (!reviews.length) return res.json({ avg: null, count: 0 });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  res.json({ avg, count: reviews.length });
};
