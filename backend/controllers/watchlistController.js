import User from '../models/User.js';

export const getWatchlist = async (req, res) => {
    const user = await User.findById(req.userId);
    res.json(user.watchlist);
};

export const addToWatchlist = async (req, res) => {
    const user = await User.findById(req.userId);

    const exists = user.watchlist.find(movie => movie.id === req.body.id);
    if (exists) return res.status(400).json({ message: 'Already in watchlist' });

    user.watchlist.push(req.body);
    await user.save();

    res.status(201).json({ message: 'Added to watchlist' });
};

export const removeFromWatchlist = async (req, res) => {
    const user = await User.findById(req.userId);

    user.watchlist = user.watchlist.filter(movie => movie.id !== parseInt(req.params.movieId));
    await user.save();

    res.json({ message: 'Removed from watchlist' });
};
// This code defines the watchlist controller for managing a user's movie watchlist.
// It includes functions to get the watchlist, add a movie to the watchlist, and