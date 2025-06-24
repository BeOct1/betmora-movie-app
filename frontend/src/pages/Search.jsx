import React, { useState, useEffect } from 'react';
import API from '../api';
import MovieCard from '../components/MovieCard.jsx';
import '../styles/styles.css';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);
    const [genre, setGenre] = useState('');
    const [year, setYear] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');

    useEffect(() => {
        // Fetch genres from backend (proxy to TMDB)
        API.get('/recommendations/genres')
            .then(res => setGenres(res.data || []));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const params = {
                query,
                year,
                minRating,
                sortBy,
            };
            if (genre) params.with_genres = genre;
            const res = await API.get('/recommendations/search', { params });
            setResults(res.data || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-bg">
            <div className="search-dialog-container">
                <h2 className="form-dialog-title">Search Movies</h2>
                <form onSubmit={handleSearch} className="search-dialog-form">
                    <input
                        type="text"
                        placeholder="Enter movie title"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <div className="search-dialog-row">
                        <select value={genre} onChange={e => setGenre(e.target.value)}>
                            <option value="">All Genres</option>
                            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                        <input
                            type="number"
                            placeholder="Year"
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            min={1900}
                            max={new Date().getFullYear()}
                        />
                        <input
                            type="number"
                            placeholder="Min Rating"
                            value={minRating}
                            onChange={e => setMinRating(e.target.value)}
                            min={0}
                            max={10}
                        />
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="popularity.desc">Most Popular</option>
                            <option value="release_date.desc">Newest</option>
                            <option value="vote_average.desc">Top Rated</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
                <div className="movie-grid">
                    {results.length > 0 ? (
                        results.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                    ) : (
                        !loading && <p className="no-results">No results.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
