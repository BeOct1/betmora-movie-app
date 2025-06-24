import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: String, required: true },
  title: { type: String, required: true },
  poster: { type: String },
  addedAt: { type: Date, default: Date.now }
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);
export default Favorite;
