// routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const { followUser, unfollowUser, getFollowers, getFollowing } = require('../controllers/userController');

// --- Watchlist Routes ---
router.post('/watchlist', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const exists = user.watchlist.find(m => m.id === req.body.id);
        if (!exists) {
            user.watchlist.push(req.body);
            await user.save();
        }
        res.json(user.watchlist);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add to watchlist' });
    }
});

router.get('/watchlist', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user.watchlist);
});

router.delete('/watchlist/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.watchlist = user.watchlist.filter(m => m.id !== parseInt(req.params.id));
        await user.save();
        res.json(user.watchlist);
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove from watchlist' });
    }
});

// --- Social Features: Follow/Unfollow ---
router.post('/:id/follow', authMiddleware, followUser);
router.post('/:id/unfollow', authMiddleware, unfollowUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

// List all users (for social features)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, 'name username _id');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
