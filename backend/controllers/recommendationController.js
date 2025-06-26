// backend/controllers/recommendationController.js
// Handles personalized recommendations: continue watching, because you liked, etc.
import User from '../models/User.js';
import Favorite from '../models/Favorite.js';
import Review from '../models/Review.js';
import Watchlist from '../models/Watchlist.js';
import axios from 'axios';

// DEBUG: Log TMDB API key to verify it's loaded
console.log('TMDB_API_KEY:', process.env.TMDB_API_KEY);

// Helper: fetch movie details from TMDB
async function fetchMovieDetails(movieIds) {
  const apiKey = process.env.TMDB_API_KEY;
  const promises = movieIds.map(id =>
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`).then(res => res.data)
  );
  return Promise.all(promises);
}

export async function getContinueWatching(req, res) {
  try {
    const userId = req.user.id;
    const watchlist = await Watchlist.find({ user: userId, progress: { $lt: 100 } });
    const movieIds = watchlist.map(item => item.movieId);
    if (!movieIds.length) return res.json([]);
    const movies = await fetchMovieDetails(movieIds);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch continue watching.' });
  }
}

export async function getBecauseYouLiked(req, res) {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.find({ user: userId });
    const favoriteIds = favorites.map(f => f.movieId);
    if (!favoriteIds.length) return res.json([]);
    const favoriteMovies = await fetchMovieDetails(favoriteIds.slice(0, 5));
    const genreIds = [...new Set(favoriteMovies.flatMap(m => m.genres.map(g => g.id)))];
    const apiKey = process.env.TMDB_API_KEY;
    const genrePromises = genreIds.slice(0, 2).map(gid =>
      axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${gid}&sort_by=popularity.desc`).then(res => res.data.results)
    );
    const genreResults = await Promise.all(genrePromises);
    const recommended = genreResults.flat().filter(m => !favoriteIds.includes(m.id)).slice(0, 12);
    res.json(recommended);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recommendations.' });
  }
}

export async function getPersonalizedRecommendations(req, res) {
  try {
    const userId = req.user.id;
    const [favorites, reviews, watchlist] = await Promise.all([
      Favorite.find({ user: userId }),
      Review.find({ user: userId }),
      Watchlist.find({ user: userId })
    ]);
    let genreCounts = {}, actorCounts = {}, directorCounts = {}, yearCounts = {};
    const allMovieIds = [
      ...favorites.map(f => f.movieId),
      ...reviews.map(r => r.movieId),
      ...watchlist.map(w => w.movieId)
    ];
    const uniqueMovieIds = [...new Set(allMovieIds)].slice(0, 15);
    const apiKey = process.env.TMDB_API_KEY;
    const movieDetails = await Promise.all(uniqueMovieIds.map(id =>
      axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits`).then(res => res.data)
    ));
    movieDetails.forEach(m => {
      if (m.genres) m.genres.forEach(g => { genreCounts[g.id] = (genreCounts[g.id] || 0) + 1; });
      if (m.credits && m.credits.cast) m.credits.cast.slice(0, 5).forEach(a => { actorCounts[a.id] = (actorCounts[a.id] || 0) + 1; });
      if (m.credits && m.credits.crew) m.credits.crew.filter(c => c.job === 'Director').forEach(d => { directorCounts[d.id] = (directorCounts[d.id] || 0) + 1; });
      if (m.release_date) {
        const year = m.release_date.slice(0, 4);
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });
    const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => id);
    const topActors = Object.entries(actorCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([id]) => id);
    const topDirectors = Object.entries(directorCounts).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([id]) => id);
    const topYears = Object.entries(yearCounts).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([y]) => y);
    let recs = [];
    if (topGenres.length) {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${topGenres.join(',')}&sort_by=popularity.desc`;
      if (topActors.length) url += `&with_cast=${topActors.join(',')}`;
      if (topDirectors.length) url += `&with_crew=${topDirectors.join(',')}`;
      if (topYears.length) url += `&primary_release_year=${topYears[0]}`;
      const genreRes = await axios.get(url);
      recs = genreRes.data.results || [];
    }
    if (!recs.length) {
      const trendRes = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
      recs = trendRes.data.results || [];
    }
    const seenIds = new Set(allMovieIds);
    const personalized = recs.filter(m => !seenIds.has(m.id)).slice(0, 18);
    res.json(personalized);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch personalized recommendations.' });
  }
}
