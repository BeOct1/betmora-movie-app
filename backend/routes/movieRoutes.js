//Handles searching TMDB via the backend.
import express from 'express';
import fetch from 'node-fetch';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

router.get('/search', authMiddleware, async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ message: 'Missing query' });

    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.results || []);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch movies' });
    }
});

// Get movie trailer from TMDB
router.get('/:id/trailer', async (req, res) => {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    const movieId = req.params.id;
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const trailer = (data.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
    if (trailer) {
      res.json({ key: trailer.key, url: `https://www.youtube.com/watch?v=${trailer.key}` });
    } else {
      res.status(404).json({ message: 'Trailer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trailer' });
  }
});

export default router;
// This code defines a route for searching movies using the TMDB API.
// It uses the Express.js framework to create a router and defines a GET endpoint at `/search`.
// The route is protected by an authentication middleware (`authMiddleware`), ensuring that only authenticated users