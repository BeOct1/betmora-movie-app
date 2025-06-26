import React, { useState } from "react";
import axios from "axios";

const MediaSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/movies/search?query=${encodeURIComponent(query)}`);
      setResults(res.data.results || []);
    } catch (err) {
      setError("Search failed");
    }
    setLoading(false);
  };

  return (
    <div className="media-search-container">
      <h2>Search Movies</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, genre, year..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      <ul>
        {results.map(movie => (
          <li key={movie.id}>
            <strong>{movie.title}</strong> ({movie.release_date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MediaSearch;
