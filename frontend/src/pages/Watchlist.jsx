import React, { useEffect, useState } from 'react';
import API from '../api';
import MovieCard from '../components/MovieCard';
import '../styles/styles.css'; // Ensure you have the correct path to your CSS file
// Ensure you have axios installed and configured for your API requests

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWatchlist = async () => {
        try {
            const res = await API.get('/watchlist');
            setWatchlist(res.data.watchlist);
        } catch (err) {
            alert('Failed to load watchlist.');
        } finally {
            setLoading(false);
        }
    };

    const removeMovie = async (id) => {
        try {
            await API.delete(`/watchlist/${id}`);
            setWatchlist((prev) => prev.filter((movie) => movie.tmdbId !== id));
        } catch (err) {
            alert('Failed to remove movie');
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    return (
        <div className="form-container">
            <h2>Your Watchlist</h2>
            {loading ? (
                <p>Loading...</p>
            ) : watchlist.length > 0 ? (
                <div className="movie-grid">
                    {watchlist.map((movie) => (
                        <MovieCard
                            key={movie.tmdbId}
                            movie={movie}
                            isInWatchlist
                            onRemove={removeMovie}
                        />
                    ))}
                </div>
            ) : (
                <p>watchlist is empty.</p>
            )}
        </div>
    );
};

export default Watchlist;
