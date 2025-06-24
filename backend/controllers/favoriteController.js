import Favorite from '../models/Favorite.js';

// Add a movie to favorites
export const addFavorite = async (req, res) => {
  const { tmdbId, title, poster } = req.body;
  if (!tmdbId || !title) return res.status(400).json({ message: 'Missing TMDB ID or title' });
  try {
    const exists = await Favorite.findOne({ user: req.user._id, tmdbId });
    if (exists) return res.status(400).json({ message: 'Already in favorites' });
    const fav = await Favorite.create({ user: req.user._id, tmdbId, title, poster });
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to favorites' });
  }
};

// Get all favorites for a user
export const getFavorites = async (req, res) => {
  try {
    const favs = await Favorite.find({ user: req.user._id });
    res.json(favs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
};

// Remove a favorite
export const removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user._id, tmdbId: req.params.id });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};
