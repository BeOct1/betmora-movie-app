import React, { useEffect, useState } from 'react';
import API from '../api';
import MovieCard from '../components/MovieCard.jsx';
import SkeletonCard from '../components/SkeletonCard';
import '../styles/styles.css';

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
        <main className="dashboard-bg">
            <section className="form-container">
                <h2>Your Watchlist</h2>
                {loading ? (
                    <div className="movie-grid">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : watchlist.length > 0 ? (
                    <div className="movie-grid">
                        {watchlist.map((movie) => (
                            <MovieCard
                                key={movie.tmdbId}
                                movie={movie}
                                isInWatchlist
                                onRemove={removeMovie}
                                aria-label={`Remove ${movie.title} from watchlist`}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ color: '#aaa', textAlign: 'center', margin: '2rem', fontSize: '1rem' }}>
                        <div style={{ fontSize: 48, marginBottom: 8 }}>🍿</div>
                        <div>Your watchlist is empty. Start adding movies to watch later!</div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Watchlist;
