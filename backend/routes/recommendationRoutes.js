import express from 'express';
import fetch from 'node-fetch';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Simple recommendations: trending movies from TMDB
router.get('/', authMiddleware, async (req, res) => {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data.results || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
});

export default router;
