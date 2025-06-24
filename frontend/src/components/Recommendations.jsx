import React, { useEffect, useState } from 'react';
import API from '../api';
import '../styles/styles.css';

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

  if (loading) return <div className="spinner" style={{ margin: '2rem auto' }}></div>;
  if (!movies.length) return <div style={{ color: '#aaa', textAlign: 'center', margin: '2rem' }}>No movies found.</div>;

  return (
    <div className="movie-grid" style={{ margin: '2rem 0' }}>
      {movies.slice(0, 8).map(movie => (
        <div className="movie-card" key={movie.id} style={{ minWidth: 180 }}>
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
            alt={movie.title}
            style={{ borderRadius: 12, width: '100%', marginBottom: 8 }}
          />
          <h4 style={{ color: '#91F726', fontWeight: 600, fontSize: '1.1rem', margin: '0.5rem 0' }}>{movie.title}</h4>
          <p style={{ color: '#ccc', fontSize: 13, margin: 0 }}>{movie.release_date?.slice(0, 4)}</p>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
