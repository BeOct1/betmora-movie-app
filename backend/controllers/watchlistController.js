import Watchlist from '../models/Watchlist.js';
import User from '../models/User.js';

export const addToWatchlist = async (req, res) => {
    const { tmdbId, title, poster } = req.body;

    if (!tmdbId || !title) {
        return res.status(400).json({ message: 'Missing TMDB ID or title' });
    }

    try {
        const exists = await Watchlist.findOne({ user: req.user._id, tmdbId });
        if (exists) return res.status(400).json({ message: 'Already in watchlist' });

        const movie = await Watchlist.create({
            user: req.user._id,
            tmdbId,
            title,
            poster,
        });

        res.status(201).json({ movie });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add to watchlist' });
    }
};

export const getWatchlist = async (req, res) => {
    try {
        const watchlist = await Watchlist.find({ user: req.user._id });
        res.json({ watchlist });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch watchlist' });
    }
};

export const removeFromWatchlist = async (req, res) => {
    try {
        await Watchlist.findOneAndDelete({
            user: req.user._id,
            tmdbId: req.params.id,
        });
        res.json({ message: 'Removed from watchlist' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to remove from watchlist' });
    }
};

export const clearWatchlist = async (req, res) => {
    try {
        await Watchlist.deleteMany({ user: req.user._id });
        res.json({ message: 'Watchlist cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to clear watchlist' });
    }
};

// Create a new custom watchlist
export const createWatchlist = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.watchlists.some(wl => wl.name === name)) return res.status(400).json({ message: 'List already exists' });
  user.watchlists.push({ name, movies: [] });
  await user.save();
  res.status(201).json(user.watchlists);
};

// Get all custom watchlists
export const getWatchlists = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.watchlists);
};

// Add movie to a custom watchlist
export const addMovieToWatchlist = async (req, res) => {
  const { listName, movie } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const list = user.watchlists.find(wl => wl.name === listName);
  if (!list) return res.status(404).json({ message: 'List not found' });
  if (list.movies.some(m => m.tmdbId === movie.tmdbId)) return res.status(400).json({ message: 'Movie already in list' });
  list.movies.push(movie);
  await user.save();
  res.json(list);
};

// Remove movie from a custom watchlist
export const removeMovieFromWatchlist = async (req, res) => {
  const { listName, tmdbId } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const list = user.watchlists.find(wl => wl.name === listName);
  if (!list) return res.status(404).json({ message: 'List not found' });
  list.movies = list.movies.filter(m => m.tmdbId !== tmdbId);
  await user.save();
  res.json(list);
};

// Rename a custom watchlist
export const renameWatchlist = async (req, res) => {
  const { oldName, newName } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const list = user.watchlists.find(wl => wl.name === oldName);
  if (!list) return res.status(404).json({ message: 'List not found' });
  if (user.watchlists.some(wl => wl.name === newName)) return res.status(400).json({ message: 'New name already exists' });
  list.name = newName;
  await user.save();
  res.json(user.watchlists);
};

// Delete a custom watchlist
export const deleteWatchlist = async (req, res) => {
  const { name } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.watchlists = user.watchlists.filter(wl => wl.name !== name);
  await user.save();
  res.json(user.watchlists);
};

