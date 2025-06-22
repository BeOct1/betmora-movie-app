import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import '../styles/styles.css';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`);
        if (!res.ok) throw new Error('Failed to fetch movie details');
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get(`/reviews/${id}`);
        setReviews(res.data);
        const avgRes = await API.get(`/reviews/${id}/avg`);
        setAvgRating(avgRes.data.avg);
      } catch {
        setReviews([]);
        setAvgRating(null);
      }
    };
    fetchReviews();
  }, [id, refresh]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/reviews', { movieId: id, rating, comment: reviewText });
      setReviewText('');
      setRating(5);
      setRefresh(r => !r);
    } catch (err) {
      alert('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="form-container"><p>Loading...</p></div>;
  if (error) return <div className="form-container"><p>{error}</p></div>;
  if (!movie) return null;

  return (
    <div className="dashboard-bg">
      <div className="form-container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}` : '/image.jpg'}
            alt={movie.title}
            style={{ borderRadius: 12, width: 200, minWidth: 150 }}
          />
          <div>
            <h2>{movie.title} ({movie.release_date?.slice(0, 4)})</h2>
            <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(', ')}</p>
            <p><strong>TMDB Rating:</strong> {movie.vote_average} / 10</p>
            <p><strong>App Rating:</strong> {avgRating ? avgRating.toFixed(1) : 'N/A'} / 10</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
            <p><strong>Runtime:</strong> {movie.runtime} min</p>
            <p><strong>Cast:</strong> {movie.credits?.cast?.slice(0, 5).map(c => c.name).join(', ')}</p>
            {/* Ratings/reviews */}
            <div style={{ marginTop: 24 }}>
              <h3>User Ratings & Reviews</h3>
              <form onSubmit={handleReviewSubmit} style={{ marginBottom: 16 }}>
                <label>
                  Your Rating:
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    style={{ width: 60, marginLeft: 8 }}
                  />
                </label>
                <br />
                <textarea
                  placeholder="Write a review..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  rows={2}
                  style={{ width: '100%', marginTop: 8 }}
                />
                <br />
                <button type="submit" disabled={submitting || !reviewText.trim()} style={{ marginTop: 8 }}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
              {reviews.length === 0 ? (
                <p>No reviews yet.</p>
              ) : (
                <ul style={{ paddingLeft: 0 }}>
                  {reviews.map(r => (
                    <li key={r._id} style={{ marginBottom: 12, listStyle: 'none', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                      <strong>{r.user?.name || 'User'}:</strong> <span style={{ color: '#ff9800' }}>{r.rating}/10</span>
                      <br />
                      <span>{r.comment}</span>
                      <br />
                      <small>{new Date(r.createdAt).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Trailer if available */}
            {movie.videos?.results?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3>Trailer</h3>
                <iframe
                  width="320"
                  height="180"
                  src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
