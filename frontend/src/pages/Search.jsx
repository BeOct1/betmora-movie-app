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
        // Fetch genres from TMDB
        fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`)
            .then(res => res.json())
            .then(data => setGenres(data.genres || []));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Build TMDB query
            let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}`;
            if (query) url += `&query=${encodeURIComponent(query)}`;
            if (genre) url += `&with_genres=${genre}`;
            if (year) url += `&primary_release_year=${year}`;
            if (minRating) url += `&vote_average.gte=${minRating}`;
            if (sortBy) url += `&sort_by=${sortBy}`;
            // If searching by title, use /search/movie endpoint
            if (query) {
                url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
                if (year) url += `&year=${year}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setResults(data.results || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-bg">
            <div className="form-container">
                <h2>Search Movies</h2>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <input
                        type="text"
                        placeholder="Enter movie title"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        style={{ flex: 1, minWidth: 180 }}
                    />
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
                        style={{ width: 90 }}
                    />
                    <input
                        type="number"
                        placeholder="Min Rating"
                        value={minRating}
                        onChange={e => setMinRating(e.target.value)}
                        min={0}
                        max={10}
                        style={{ width: 90 }}
                    />
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="popularity.desc">Most Popular</option>
                        <option value="release_date.desc">Newest</option>
                        <option value="vote_average.desc">Top Rated</option>
                    </select>
                    <button type="submit" disabled={loading} style={{ minWidth: 100 }}>
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
        </div>
    );
};

export default Search;
