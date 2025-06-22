import React from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/styles.css'; // Ensure you have the correct path to your CSS file
// Ensure you have axios installed and configured for your API requests

const MovieCard = ({ movie, isInWatchlist, onRemove }) => {
    const navigate = useNavigate();

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

    return (
        <div
            className="movie-card"
            style={{ cursor: 'pointer' }}
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
        </div>
    );
};

export default MovieCard;
