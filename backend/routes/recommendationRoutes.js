import express from 'express';
import fetch from 'node-fetch';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// TMDB Service utility
const TMDB_API_KEY = process.env.TMDB_API_KEY || '00e012c8105feb4cf6af96575793c443';
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error('TMDB API error');
  return res.json();
}

// Smarter recommendations: personalized by user watchlist, reviews, and genres
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const User = (await import('../models/User.js')).default;
    const Review = (await import('../models/Review.js')).default;
    const user = await User.findById(userId);
    let genreCounts = {};
    // Collect genres from watchlist
    for (const movie of user.watchlist || []) {
      if (movie.genre_ids) {
        for (const gid of movie.genre_ids) {
          genreCounts[gid] = (genreCounts[gid] || 0) + 1;
        }
      }
    }
    // Collect genres from reviews
    const reviews = await Review.find({ user: userId });
    for (const review of reviews) {
      // Fetch movie details for genre info
      const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${review.movieId}?api_key=${TMDB_API_KEY}`);
      const tmdbData = await tmdbRes.json();
      if (tmdbData.genres) {
        for (const g of tmdbData.genres) {
          genreCounts[g.id] = (genreCounts[g.id] || 0) + 1;
        }
      }
    }
    // Get top genres
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([gid]) => gid);
    // Fetch recommendations from TMDB based on top genres
    let recs = [];
    if (topGenres.length) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${topGenres.join(',')}&sort_by=popularity.desc`;
      const response = await fetch(url);
      const data = await response.json();
      recs = data.results || [];
    } else {
      // Fallback: trending
      const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      recs = data.results || [];
    }
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
});

// Search movies (by title, with filters)
router.get('/search', async (req, res) => {
  try {
    const { query, year, minRating, sortBy } = req.query;
    let params = { query };
    if (year) params.year = year;
    if (minRating) params['vote_average.gte'] = minRating;
    if (sortBy) params.sort_by = sortBy;
    const data = await tmdbFetch('/search/movie', params);
    res.json(data.results || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search movies' });
  }
});

// Get movie details
router.get('/details/:id', async (req, res) => {
  try {
    const data = await tmdbFetch(`/movie/${req.params.id}`, { append_to_response: 'credits,videos,similar,production_companies' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
});

// Get genres from TMDB
router.get('/genres', async (req, res) => {
  try {
    const data = await tmdbFetch('/genre/movie/list');
    res.json(data.genres || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
});

export default router;
