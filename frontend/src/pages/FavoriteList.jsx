import React, { useEffect, useState } from "react";
import axios from "axios";

const FavoriteList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/favorites");
        setFavorites(res.data || []);
      } catch (err) {
        setError("Failed to load favorites");
      }
      setLoading(false);
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (tmdbId) => {
    try {
      await axios.delete(`/api/favorites/${tmdbId}`);
      setFavorites(favorites.filter(f => f.tmdbId !== tmdbId));
    } catch {
      setError("Failed to remove favorite");
    }
  };

  return (
    <div className="favorite-list-container" style={{
      maxWidth: '500px',
      margin: '2rem auto',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <h2 style={{ color: '#1a223f', marginBottom: '0.5rem' }}>My Favorites</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {favorites.map(fav => (
          <li key={fav.tmdbId} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid #eee',
          }}>
            <span><strong>{fav.title}</strong></span>
            <button
              onClick={() => handleRemove(fav.tmdbId)}
              style={{
                background: '#e50914',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '0.3rem 0.7rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >Remove</button>
          </li>
        ))}
      </ul>
      {!loading && favorites.length === 0 && <div>No favorites yet.</div>}
    </div>
  );
};

export default FavoriteList;
