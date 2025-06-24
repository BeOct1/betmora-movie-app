import React, { useEffect, useState } from 'react';
import API from '../api';
import MovieCard from '../components/MovieCard';
import '../styles/styles.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await API.get('/favorites');
      setFavorites(res.data);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await API.delete(`/favorites/${id}`);
      setFavorites(favorites.filter(fav => fav.tmdbId !== id));
    } catch {}
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="dashboard-bg">
      <div className="form-container">
        <h2>Your Favorites</h2>
        {loading ? (
          <p>Loading...</p>
        ) : favorites.length > 0 ? (
          <div className="movie-grid">
            {favorites.map(movie => (
              <MovieCard key={movie.tmdbId} movie={movie} isFavorite onRemoveFavorite={removeFavorite} />
            ))}
          </div>
        ) : (
          <p>No favorites yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
