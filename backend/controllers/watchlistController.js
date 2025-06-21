const Watchlist = require('../models/Watchlist');

exports.addToWatchlist = async (req, res) => {
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

exports.getWatchlist = async (req, res) => {
    try {
        const watchlist = await Watchlist.find({ user: req.user._id });
        res.json({ watchlist });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch watchlist' });
    }
};

exports.removeFromWatchlist = async (req, res) => {
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

exports.clearWatchlist = async (req, res) => {
    try {
        await Watchlist.deleteMany({ user: req.user._id });
        res.json({ message: 'Watchlist cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to clear watchlist' });
    }
};

