import React, { useEffect, useState } from "react";
import axios from "axios";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/watchlist");
        setWatchlist(res.data.watchlist || []);
      } catch (err) {
        setError("Failed to load watchlist");
      }
      setLoading(false);
    };
    fetchWatchlist();
  }, []);

  return (
    <div className="watchlist-container">
      <h2>My Watchlist</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <ul>
        {watchlist.map(movie => (
          <li key={movie.tmdbId || movie.id}>
            <strong>{movie.title}</strong>
          </li>
        ))}
      </ul>
      {!loading && watchlist.length === 0 && <div>No movies in your watchlist.</div>}
    </div>
  );
};

export default Watchlist;
