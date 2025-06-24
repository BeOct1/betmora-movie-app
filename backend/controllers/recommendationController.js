// backend/controllers/recommendationController.js
// Handles personalized recommendations: continue watching, because you liked, etc.
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const axios = require('axios');

// Helper: fetch movie details from TMDB
async function fetchMovieDetails(movieIds) {
  const apiKey = process.env.TMDB_API_KEY;
  const promises = movieIds.map(id =>
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`).then(res => res.data)
  );
  return Promise.all(promises);
}

// GET /api/continue-watching
exports.getContinueWatching = async (req, res) => {
  try {
    // Simulate: movies in watchlist with progress < 100
    const userId = req.user.id;
    const watchlist = await Watchlist.find({ user: userId, progress: { $lt: 100 } });
    const movieIds = watchlist.map(item => item.movieId);
    if (!movieIds.length) return res.json([]);
    const movies = await fetchMovieDetails(movieIds);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch continue watching.' });
  }
};

// GET /api/because-you-liked
exports.getBecauseYouLiked = async (req, res) => {
  try {
    // Simulate: recommend based on favorites (get genres from favorites, recommend similar)
    const userId = req.user.id;
    const favorites = await Favorite.find({ user: userId });
    const favoriteIds = favorites.map(f => f.movieId);
    if (!favoriteIds.length) return res.json([]);
    // Fetch genres from favorite movies
    const favoriteMovies = await fetchMovieDetails(favoriteIds.slice(0, 5));
    const genreIds = [...new Set(favoriteMovies.flatMap(m => m.genres.map(g => g.id)))];
    // Get recommendations from TMDB by genre
    const apiKey = process.env.TMDB_API_KEY;
    const genrePromises = genreIds.slice(0, 2).map(gid =>
      axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${gid}&sort_by=popularity.desc`).then(res => res.data.results)
    );
    const genreResults = await Promise.all(genrePromises);
    // Flatten, filter out already-favorited, and limit
    const recommended = genreResults.flat().filter(m => !favoriteIds.includes(m.id)).slice(0, 12);
    res.json(recommended);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recommendations.' });
  }
};

// GET /api/recommendations/personalized
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    // 1. Get user's favorites, reviews, and watchlist
    const [favorites, reviews, watchlist] = await Promise.all([
      Favorite.find({ user: userId }),
      Review.find({ user: userId }),
      Watchlist.find({ user: userId })
    ]);
    // 2. Collect genre and actor/director preferences
    let genreCounts = {}, actorCounts = {}, directorCounts = {};
    const allMovieIds = [
      ...favorites.map(f => f.movieId),
      ...reviews.map(r => r.movieId),
      ...watchlist.map(w => w.movieId)
    ];
    const uniqueMovieIds = [...new Set(allMovieIds)].slice(0, 10);
    const apiKey = process.env.TMDB_API_KEY;
    const movieDetails = await fetchMovieDetails(uniqueMovieIds);
    movieDetails.forEach(m => {
      if (m.genres) m.genres.forEach(g => { genreCounts[g.id] = (genreCounts[g.id] || 0) + 1; });
      if (m.credits && m.credits.cast) m.credits.cast.slice(0, 5).forEach(a => { actorCounts[a.id] = (actorCounts[a.id] || 0) + 1; });
      if (m.credits && m.credits.crew) m.credits.crew.filter(c => c.job === 'Director').forEach(d => { directorCounts[d.id] = (directorCounts[d.id] || 0) + 1; });
    });
    // 3. Get top genres, actors, directors
    const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => id);
    const topActors = Object.entries(actorCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => id);
    const topDirectors = Object.entries(directorCounts).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([id]) => id);
    // 4. Query TMDB for recommendations
    let recs = [];
    if (topGenres.length) {
      // By genre
      const genreRes = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${topGenres.join(',')}&sort_by=popularity.desc&with_cast=${topActors.join(',')}&with_crew=${topDirectors.join(',')}`);
      recs = genreRes.data.results || [];
    }
    // Fallback: trending
    if (!recs.length) {
      const trendRes = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
      recs = trendRes.data.results || [];
    }
    // Remove already-favorited/watched
    const seenIds = new Set(allMovieIds);
    const personalized = recs.filter(m => !seenIds.has(m.id)).slice(0, 16);
    res.json(personalized);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch personalized recommendations.' });
  }
};
