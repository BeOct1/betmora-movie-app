// routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

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

module.exports = router;
