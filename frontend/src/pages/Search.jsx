import React, { useState } from 'react';
import API from '../api';
import MovieCard from '../components/MovieCard';
import '../styles/styles.css'; // Ensure you have the correct path to your CSS file


const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        try {
            const res = await API.get(`/movies/search?query=${query}`);
            setResults(res.data.results);
        } catch (err) {
            alert('Failed to fetch movies.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Search Movies</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter movie title"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
            <div className="movie-grid">
                {results.length > 0 ? (
                    results.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                ) : (
                    !loading && <p>No results.</p>
                )}
            </div>
        </div>
    );
};

export default Search;
