import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/styles.css'; // Ensure you have the correct path to your CSS file
import { PlayCircleFilled } from '@mui/icons-material';

const MovieCard = ({ movie, isInWatchlist, onRemove }) => {
    const navigate = useNavigate();
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);

    const handleAdd = async () => {
        try {
            await API.post('/watchlist', {
                tmdbId: movie.id,
                title: movie.title,
                poster: movie.poster_path,
            });
            alert('Movie added to watchlist!');
        } catch (err) {
            alert('Failed to add movie.');
        }
    };

    const handleRemove = () => {
        onRemove(movie.tmdbId);
    };

    const handleDetails = () => {
        navigate(`/movie/${movie.id || movie.tmdbId}`);
    };

    const handleWatchTrailer = async (e) => {
        e.stopPropagation();
        try {
            const res = await API.get(`/movies/${movie.id || movie.tmdbId}/trailer`);
            setTrailerUrl(res.data.url);
            setShowTrailer(true);
        } catch {
            alert('Trailer not available');
        }
    };

    return (
        <div
            className="movie-card"
            style={{ cursor: 'pointer', position: 'relative' }}
            onClick={handleDetails}
        >
            <img
                src={
                    movie.poster_path || movie.poster
                        ? `https://image.tmdb.org/t/p/w300/${movie.poster_path || movie.poster}`
                        : 'https://via.placeholder.com/300x450?text=No+Image'
                }
                alt={movie.title}
            />
            <h4>{movie.title}</h4>
            <button
                className="trailer-btn"
                onClick={handleWatchTrailer}
                style={{
                    background: '#ff9800',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 20,
                    padding: '0.4rem 1.2rem',
                    fontWeight: 700,
                    marginBottom: 8,
                    marginTop: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255,152,0,0.15)'
                }}
                onMouseDown={e => e.stopPropagation()}
            >
                <PlayCircleFilled style={{ marginRight: 4 }} /> Trailer
            </button>
            {!isInWatchlist ? (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAdd();
                    }}
                >
                    Add to Watchlist
                </button>
            ) : (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                    }}
                >
                    Remove
                </button>
            )}
            {showTrailer && trailerUrl && (
                <div className="trailer-modal" onClick={e => { e.stopPropagation(); setShowTrailer(false); }}>
                    <div className="trailer-modal-content" onClick={e => e.stopPropagation()}>
                        <iframe width="100%" height="315" src={trailerUrl.replace('watch?v=', 'embed/')} title="Trailer" frameBorder="0" allowFullScreen></iframe>
                        <button onClick={() => setShowTrailer(false)} style={{ marginTop: 8 }}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieCard;
