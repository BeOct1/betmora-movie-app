import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/styles.css'; // Ensure you have the correct path to your CSS file
import { PlayCircleFilled } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useToast } from '../context/ToastContext.jsx';

const MovieCard = ({ movie, isInWatchlist, onRemove, isFavorite, onRemoveFavorite }) => {
    const navigate = useNavigate();
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [isFav, setIsFav] = useState(isFavorite || false);
    const toast = useToast();

    const handleAdd = async () => {
        try {
            await API.post('/watchlist', {
                tmdbId: movie.id,
                title: movie.title,
                poster: movie.poster_path,
            });
            toast.showToast('Movie added to watchlist!', 'success');
        } catch (err) {
            toast.showToast('Failed to add movie.', 'error');
        }
    };

    const handleRemove = () => {
        onRemove(movie.tmdbId);
        toast.showToast('Movie removed from watchlist.', 'info');
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
            toast.showToast('Trailer not available', 'error');
        }
    };

    const handleAddFavorite = async (e) => {
        e.stopPropagation();
        try {
            await API.post('/favorites', {
                tmdbId: movie.id || movie.tmdbId,
                title: movie.title,
                poster: movie.poster_path || movie.poster,
            });
            setIsFav(true);
            toast.showToast('Added to favorites!', 'success');
        } catch {
            toast.showToast('Failed to add to favorites.', 'error');
        }
    };
    const handleRemoveFavorite = async (e) => {
        e.stopPropagation();
        try {
            await API.delete(`/favorites/${movie.id || movie.tmdbId}`);
            setIsFav(false);
            if (onRemoveFavorite) onRemoveFavorite(movie.id || movie.tmdbId);
            toast.showToast('Removed from favorites.', 'info');
        } catch {
            toast.showToast('Failed to remove from favorites.', 'error');
        }
    };

    return (
        <section
            className="movie-card"
            style={{ cursor: 'pointer', position: 'relative' }}
            tabIndex={0}
            aria-label={`View details for ${movie.title}`}
            onClick={handleDetails}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleDetails(); }}
        >
            <img
                src={
                    movie.poster_path || movie.poster
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path || movie.poster}`
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={movie.title}
                style={{ borderRadius: 12 }}
            />
            <h4>{movie.title}</h4>
            <button
                className="trailer-btn"
                aria-label={`Watch trailer for ${movie.title}`}
                onClick={handleWatchTrailer}
                onMouseDown={e => e.stopPropagation()}
                tabIndex={0}
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
            >
                <PlayCircleFilled style={{ marginRight: 4 }} /> Trailer
            </button>
            {/* Share Button */}
            <button
                className="trailer-btn"
                aria-label={`Copy link to ${movie.title}`}
                tabIndex={0}
                style={{ background: '#91F726', color: '#181a15', marginBottom: 8 }}
                onClick={e => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(window.location.origin + `/movie/${movie.id || movie.tmdbId}`);
                    toast.showToast('Link copied to clipboard! ', 'success', {
                        action: {
                            label: 'Undo',
                            onClick: () => toast.showToast('Share undone.', 'info')
                        }
                    });
                }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.target.click(); }}
                onMouseDown={e => e.stopPropagation()}
            >
                <span role="img" aria-label="share" style={{ marginRight: 6 }}>🔗</span> Share
            </button>
            {/* Twitter Share */}
            <button
                className="trailer-btn"
                aria-label={`Share ${movie.title} to X`}
                tabIndex={0}
                style={{ background: '#1da1f2', color: '#fff', marginBottom: 8 }}
                onClick={e => {
                    e.stopPropagation();
                    const url = encodeURIComponent(window.location.origin + `/movie/${movie.id || movie.tmdbId}`);
                    const text = encodeURIComponent(`Check out ${movie.title} on Betmora!`);
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.target.click(); }}
                onMouseDown={e => e.stopPropagation()}
            >
                <span role="img" aria-label="twitter" style={{ marginRight: 6 }}>🐦</span> X
            </button>
            {/* Facebook Share */}
            <button
                className="trailer-btn"
                aria-label={`Share ${movie.title} to Facebook`}
                tabIndex={0}
                style={{ background: '#4267B2', color: '#fff', marginBottom: 8 }}
                onClick={e => {
                    e.stopPropagation();
                    const url = encodeURIComponent(window.location.origin + `/movie/${movie.id || movie.tmdbId}`);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.target.click(); }}
                onMouseDown={e => e.stopPropagation()}
            >
                <span role="img" aria-label="facebook" style={{ marginRight: 6 }}>📘</span> Facebook
            </button>
            {/* WhatsApp Share */}
            <button
                className="trailer-btn"
                aria-label={`Share ${movie.title} to WhatsApp`}
                tabIndex={0}
                style={{ background: '#25D366', color: '#fff', marginBottom: 8 }}
                onClick={e => {
                    e.stopPropagation();
                    const url = encodeURIComponent(window.location.origin + `/movie/${movie.id || movie.tmdbId}`);
                    const text = encodeURIComponent(`Check out ${movie.title} on Betmora!`);
                    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
                }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.target.click(); }}
                onMouseDown={e => e.stopPropagation()}
            >
                <span role="img" aria-label="whatsapp" style={{ marginRight: 6 }}>🟢</span> WhatsApp
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
            <span style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                {isFav ? (
                    <FavoriteIcon style={{ color: '#ff1744', fontSize: 28, cursor: 'pointer' }} onClick={handleRemoveFavorite} titleAccess="Remove from Favorites" />
                ) : (
                    <FavoriteBorderIcon style={{ color: '#fff', fontSize: 28, cursor: 'pointer' }} onClick={handleAddFavorite} titleAccess="Add to Favorites" />
                )}
            </span>
            {showTrailer && trailerUrl && (
                <div className="trailer-modal" onClick={e => { e.stopPropagation(); setShowTrailer(false); }}>
                    <div className="trailer-modal-content" onClick={e => e.stopPropagation()}>
                        <iframe width="100%" height="315" src={trailerUrl.replace('watch?v=', 'embed/')} title="Trailer" frameBorder="0" allowFullScreen></iframe>
                        <button onClick={() => setShowTrailer(false)} style={{ marginTop: 8 }}>Close</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MovieCard;
