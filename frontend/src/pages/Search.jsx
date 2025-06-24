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
    const [actor, setActor] = useState('');
    const [director, setDirector] = useState('');
    const [runtime, setRuntime] = useState('');
    const [suggestions, setSuggestions] = useState([]);

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
            if (actor) params.with_cast = actor;
            if (director) params.with_crew = director;
            if (runtime) params.with_runtime = runtime;
            const res = await API.get('/recommendations/search', { params });
            setResults(res.data || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAutocomplete = async (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            try {
                const res = await API.get('/recommendations/autocomplete', { params: { query: value } });
                setSuggestions(res.data || []);
            } catch {
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    return (
        <main className="search-bg">
            <section className="search-dialog-container">
                <h2 className="form-dialog-title">Search Movies</h2>
                <form onSubmit={handleSearch} className="search-dialog-form" aria-label="Search movies">
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Enter movie title"
                            value={query}
                            onChange={handleAutocomplete}
                            aria-label="Movie title"
                            style={{ fontSize: '1rem' }}
                            autoComplete="off"
                        />
                        {suggestions.length > 0 && (
                            <ul style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                background: '#222',
                                color: '#fff',
                                zIndex: 10,
                                listStyle: 'none',
                                margin: 0,
                                padding: 0,
                                border: '1px solid #91F726',
                                borderRadius: 4,
                                maxHeight: 180,
                                overflowY: 'auto',
                            }}>
                                {suggestions.map(s => (
                                    <li
                                        key={s.id}
                                        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                                        onClick={() => { setQuery(s.title); setSuggestions([]); }}
                                        tabIndex={0}
                                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setQuery(s.title); setSuggestions([]); } }}
                                    >
                                        {s.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="search-dialog-row">
                        <select value={genre} onChange={e => setGenre(e.target.value)} aria-label="Genre" style={{ fontSize: '1rem' }}>
                            <option value="">All Genres</option>
                            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                        <input
                            type="number"
                            placeholder="Year"
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            aria-label="Year"
                            style={{ fontSize: '1rem' }}
                        />
                        <input
                            type="number"
                            placeholder="Min Rating"
                            value={minRating}
                            onChange={e => setMinRating(e.target.value)}
                            aria-label="Minimum rating"
                            style={{ fontSize: '1rem' }}
                        />
                        <input
                            type="text"
                            placeholder="Actor"
                            value={actor}
                            onChange={e => setActor(e.target.value)}
                            aria-label="Actor"
                            style={{ fontSize: '1rem' }}
                        />
                        <input
                            type="text"
                            placeholder="Director"
                            value={director}
                            onChange={e => setDirector(e.target.value)}
                            aria-label="Director"
                            style={{ fontSize: '1rem' }}
                        />
                        <input
                            type="number"
                            placeholder="Max Runtime (min)"
                            value={runtime}
                            onChange={e => setRuntime(e.target.value)}
                            aria-label="Max runtime"
                            style={{ fontSize: '1rem' }}
                        />
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="Sort by" style={{ fontSize: '1rem' }}>
                            <option value="popularity.desc">Most Popular</option>
                            <option value="vote_average.desc">Highest Rated</option>
                            <option value="release_date.desc">Newest</option>
                        </select>
                    </div>
                    <button type="submit" aria-label="Search" style={{ fontSize: '1rem' }}>
                        Search
                    </button>
                </form>
                <div className="movie-grid">
                    {results.length > 0 ? (
                        results.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                    ) : (
                        !loading && <p className="no-results">No results.</p>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Search;
