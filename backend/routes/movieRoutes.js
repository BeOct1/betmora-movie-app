// routes/movies.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie`,
            {
                params: {
                    api_key: TMDB_API_KEY,
                    query,
                },
            }
        );
        res.json(response.data.results);
    } catch (err) {
        res.status(500).json({ message: 'TMDB search failed' });
    }
});

module.exports = router;
