import mongoose from 'mongoose';

const WatchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: String, required: true },
  title: { type: String, required: true },
  poster: { type: String }
});

const Watchlist = mongoose.model('Watchlist', WatchlistSchema);

export default Watchlist;
