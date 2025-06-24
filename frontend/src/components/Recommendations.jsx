import React, { useEffect, useState } from 'react';
import API from '../api';
import '../styles/styles.css';
import SkeletonCard from './SkeletonCard';

const Recommendations = ({ type }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        let res;
        if (type === 'top-rated') {
          // Fetch top rated movies from TMDB directly
          const apiKey = import.meta.env.VITE_TMDB_API_KEY;
          res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`);
          const data = await res.json();
          setMovies(data.results || []);
        } else {
          // Default: recommendations from backend
          res = await API.get('/recommendations');
          setMovies(res.data);
        }
      } catch {
        setMovies([]);
      }
      setLoading(false);
    };
    fetchRecs();
  }, [type]);

  if (loading) return (
    <div className="movie-grid" style={{ margin: '2rem 0' }}>
      {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
  if (!movies.length) return (
    <div style={{ color: '#aaa', textAlign: 'center', margin: '2rem' }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🎬</div>
      <div>No movies found. Try searching for something else!</div>
    </div>
  );

  return (
    <div className="movie-grid" style={{ margin: '2rem 0' }}>
      {movies.slice(0, 8).map(movie => (
        <div className="movie-card" key={movie.id} style={{ minWidth: 180, position: 'relative', background: '#1a2236', borderRadius: 16, boxShadow: '0 2px 12px rgba(20,30,48,0.15)', transition: 'transform 0.2s', cursor: 'pointer' }}
          onClick={() => window.location.href = `/movie/${movie.id}`}
        >
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={movie.title}
            style={{ borderRadius: 12, width: '100%', marginBottom: 8, boxShadow: '0 2px 8px rgba(20,30,48,0.12)' }}
          />
          <h4 style={{ color: '#91F726', fontWeight: 600, fontSize: '1.1rem', margin: '0.5rem 0' }}>{movie.title}</h4>
          <p style={{ color: '#ccc', fontSize: 13, margin: 0 }}>{movie.release_date?.slice(0, 4)}</p>
          {movie.genre_ids && (
            <div style={{ color: '#ff9800', fontSize: 12, margin: '4px 0' }}>
              Genres: {movie.genre_ids.join(', ')}
            </div>
          )}
          <div style={{ color: '#FFD700', fontWeight: 600, fontSize: 14, margin: '4px 0' }}>
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </div>
          <button
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              background: '#ff9800',
              color: '#222',
              border: 'none',
              borderRadius: 20,
              padding: '0.3rem 1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(255,152,0,0.15)'
            }}
            onClick={e => { e.stopPropagation(); window.location.href = `/movie/${movie.id}`; }}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
