import React, { useEffect, useState } from 'react';
import API from '../api';
import MovieCard from '../components/MovieCard';
import '../styles/styles.css';

const Watchlist = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWatchlist = async () => {
        try {
            const res = await API.get('/watchlist');
            setMovies(res.data);
        } catch (err) {
            alert('Failed to fetch watchlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await API.delete(`/watchlist/${id}`);
            setMovies(prev => prev.filter(m => m.id !== id));
        } catch (err) {
            alert('Could not remove movie');
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    return (
        <div className="page-container">
            <h2>My Watchlist</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="movie-grid">
                    {movies.length === 0 ? <p>Watchlist is empty.</p> : movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} onAction={() => handleRemove(movie.id)} actionLabel="Remove" />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;
