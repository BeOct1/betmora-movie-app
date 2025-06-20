import React, { useState } from 'react';
import API from '../api';
import MovieCard from '../components/MovieCard';
import '../styles/styles.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await API.get(`/movies/search?query=${query}`);
            setResults(res.data);
        } catch (err) {
            alert('Failed to fetch movies');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToWatchlist = async (movie) => {
        try {
            await API.post('/watchlist', movie);
            alert('Added to Watchlist');
        } catch (err) {
            alert('Could not add movie');
        }
    };

    return (
        <div className="page-container">
            <h2>Search Movies</h2>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search for a movie"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="movie-grid">
                    {results.length === 0 ? <p>No results</p> : results.map(movie => (
                        <MovieCard key={movie.id} movie={movie} onAction={handleAddToWatchlist} actionLabel="Add to Watchlist" />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
