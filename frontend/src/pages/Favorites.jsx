import React, { useEffect, useState } from 'react';
import API from '../api';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
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
    <main className="dashboard-bg">
      <section className="form-container">
        <h2>Your Favorites</h2>
        {loading ? (
          <div className="movie-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : favorites.length > 0 ? (
          <div className="movie-grid">
            {favorites.map(movie => (
              <MovieCard key={movie.tmdbId} movie={movie} isFavorite onRemoveFavorite={removeFavorite} aria-label={`Remove ${movie.title} from favorites`} />
            ))}
          </div>
        ) : (
          <div style={{ color: '#aaa', textAlign: 'center', margin: '2rem', fontSize: '1rem' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>❤️</div>
            <div>No favorites yet. Start adding movies you love!</div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Favorites;
