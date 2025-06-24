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
  const [similar, setSimilar] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        // Use backend proxy for details
        const res = await API.get(`/recommendations/details/${id}`);
        setMovie(res.data);
        setSimilar(res.data.similar?.results || []);
      } catch (err) {
        setError('Failed to fetch movie details');
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

  const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <section style={{ margin: '1rem 0', border: '1px solid #333', borderRadius: 8, background: '#222' }}>
        <button
          aria-expanded={open}
          aria-controls={`section-${title.replace(/\s/g, '')}`}
          onClick={() => setOpen(o => !o)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(o => !o); }}
          style={{
            width: '100%',
            textAlign: 'left',
            background: 'none',
            border: 'none',
            color: '#FFD700',
            fontWeight: 700,
            fontSize: '1.1rem',
            padding: '0.8rem 1rem',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {title} {open ? '▲' : '▼'}
        </button>
        {open && <div id={`section-${title.replace(/\s/g, '')}`} style={{ padding: '0.5rem 1rem' }}>{children}</div>}
      </section>
    );
  };

  if (loading) return <main className="form-container"><p>Loading...</p></main>;
  if (error) return <main className="form-container"><p>{error}</p></main>;
  if (!movie) return null;

  return (
    <main className="dashboard-bg">
      <section className="form-container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/image.jpg'}
            alt={movie.title}
            style={{ borderRadius: 12, width: 200, minWidth: 150 }}
          />
          <div style={{ flex: 1 }}>
            <h2>{movie.title} ({movie.release_date?.slice(0, 4)})</h2>
            {/* Quick Rate Button */}
            <button
              className="trailer-btn"
              aria-label="Rate this movie"
              style={{ background: '#FFD700', color: '#181a15', fontWeight: 700, margin: '8px 0', fontSize: '1.1rem' }}
              onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              ⭐ Rate this movie
            </button>
            <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(', ')}</p>
            <p><strong>TMDB Rating:</strong> {movie.vote_average} / 10</p>
            <p><strong>App Rating:</strong> {avgRating ? avgRating.toFixed(1) : 'N/A'} / 10</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
            <p><strong>Runtime:</strong> {movie.runtime} min</p>
            <CollapsibleSection title="Cast" defaultOpen={false}>
              {movie.credits?.cast?.length ? (
                <ul style={{ paddingLeft: 0, margin: 0 }}>
                  {movie.credits.cast.slice(0, 10).map(c => (
                    <li key={c.cast_id || c.credit_id} style={{ listStyle: 'none', marginBottom: 4 }}>{c.name} <span style={{ color: '#aaa', fontSize: 13 }}>as {c.character}</span></li>
                  ))}
                </ul>
              ) : 'No cast info.'}
            </CollapsibleSection>
            <CollapsibleSection title="Crew" defaultOpen={false}>
              {movie.credits?.crew?.length ? (
                <ul style={{ paddingLeft: 0, margin: 0 }}>
                  {movie.credits.crew.slice(0, 10).map(c => (
                    <li key={c.credit_id} style={{ listStyle: 'none', marginBottom: 4 }}>{c.name} <span style={{ color: '#aaa', fontSize: 13 }}>({c.job})</span></li>
                  ))}
                </ul>
              ) : 'No crew info.'}
            </CollapsibleSection>
            <CollapsibleSection title="Reviews" defaultOpen={true}>
              <div style={{ marginTop: 8 }}>
                <form id="review-form" onSubmit={handleReviewSubmit} style={{ marginBottom: 16 }} aria-label="Submit a review">
                  <label>
                    Your Rating:
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={rating}
                      onChange={e => setRating(Number(e.target.value))}
                      style={{ width: 60, marginLeft: 8 }}
                      aria-label="Your rating"
                    />
                  </label>
                  <br />
                  <textarea
                    placeholder="Write a review..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    rows={2}
                    style={{ width: '100%', marginTop: 8 }}
                    aria-label="Review text"
                  />
                  <br />
                  <button type="submit" disabled={submitting || !reviewText.trim()} style={{ marginTop: 8 }} aria-label="Submit review">
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
            </CollapsibleSection>
            {/* Share Buttons */}
            <div style={{ display: 'flex', gap: 12, margin: '16px 0', flexWrap: 'wrap' }}>
              <button
                className="trailer-btn"
                aria-label={`Copy link to ${movie.title}`}
                tabIndex={0}
                style={{ background: '#91F726', color: '#181a15' }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + `/movie/${movie.id}`);
                  if (window.confirm('Link copied to clipboard! Undo?')) alert('Share undone.');
                }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.target.click(); }}
              >
                <span role="img" aria-label="share" style={{ marginRight: 6 }}>🔗</span> Share
              </button>
              <button
                className="trailer-btn"
                aria-label={`Share ${movie.title} to X`}
                tabIndex={0}
                style={{ background: '#1da1f2', color: '#fff' }}
                onClick={() => {
                  const url = encodeURIComponent(window.location.origin + `/movie/${movie.id}`);
                  const text = encodeURIComponent(`Check out ${movie.title} on Betmora!`);
                  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.target.click(); }}
              >
                <span role="img" aria-label="twitter" style={{ marginRight: 6 }}>🐦</span> X
              </button>
              <button
                className="trailer-btn"
                aria-label={`Share ${movie.title} to Facebook`}
                tabIndex={0}
                style={{ background: '#4267B2', color: '#fff' }}
                onClick={() => {
                  const url = encodeURIComponent(window.location.origin + `/movie/${movie.id}`);
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.target.click(); }}
              >
                <span role="img" aria-label="facebook" style={{ marginRight: 6 }}>📘</span> Facebook
              </button>
              <button
                className="trailer-btn"
                aria-label={`Share ${movie.title} to WhatsApp`}
                tabIndex={0}
                style={{ background: '#25D366', color: '#fff' }}
                onClick={() => {
                  const url = encodeURIComponent(window.location.origin + `/movie/${movie.id}`);
                  const text = encodeURIComponent(`Check out ${movie.title} on Betmora!`);
                  window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
                }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') e.target.click(); }}
              >
                <span role="img" aria-label="whatsapp" style={{ marginRight: 6 }}>🟢</span> WhatsApp
              </button>
            </div>
            {/* Trailer Modal Overlay */}
            {movie.videos?.results?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3>Trailer</h3>
                <button
                  className="trailer-btn"
                  onClick={() => setShowTrailer(true)}
                  style={{ marginBottom: 8 }}
                >
                  <span role="img" aria-label="play" style={{ marginRight: 6 }}>▶️</span> Watch Trailer
                </button>
                {showTrailer && (
                  <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
                    <div className="trailer-modal-content" onClick={e => e.stopPropagation()}>
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                        title="Movie Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <button onClick={() => setShowTrailer(false)} style={{ marginTop: 8 }}>Close</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Similar Movies (renamed) */}
            {similar.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <h3>You might also like</h3>
                <div className="movie-grid">
                  {similar.slice(0, 6).map(sim => (
                    <div key={sim.id} className="movie-card" style={{ minWidth: 180, cursor: 'pointer' }} onClick={() => window.location.href = `/movie/${sim.id}`}>
                      <img src={sim.poster_path ? `https://image.tmdb.org/t/p/w500/${sim.poster_path}` : '/image.jpg'} alt={sim.title} style={{ borderRadius: 12, width: '100%', marginBottom: 8 }} />
                      <h4 style={{ color: '#91F726', fontWeight: 600, fontSize: '1.1rem', margin: '0.5rem 0' }}>{sim.title}</h4>
                      <p style={{ color: '#ccc', fontSize: 13, margin: 0 }}>{sim.release_date?.slice(0, 4)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MovieDetails;
