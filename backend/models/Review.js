import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true }, // TMDB movie ID
  rating: { type: Number, min: 0, max: 10, required: true },
  comment: { type: String, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
