import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendations = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/recommendations");
        setMovies(res.data || []);
      } catch (err) {
        setError("Failed to load recommendations");
      }
      setLoading(false);
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="recommendations-container">
      <h2>Recommended For You</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <strong>{movie.title}</strong>
          </li>
        ))}
      </ul>
      {!loading && movies.length === 0 && <div>No recommendations yet.</div>}
    </div>
  );
};

export default Recommendations;
