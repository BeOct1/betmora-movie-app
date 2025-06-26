import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReviewList from "./ReviewList";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/api/movies/${id}`);
        setMovie(res.data);
        // Fetch trailer
        const videoRes = await axios.get(`/api/movies/${id}/videos`);
        const yt = (videoRes.data.results || []).find(v => v.site === "YouTube" && v.type === "Trailer");
        setTrailer(yt ? yt.key : null);
      } catch (err) {
        setError("Failed to load movie details");
      }
      setLoading(false);
    };
    if (id) fetchMovie();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!movie) return <div>Movie not found.</div>;

  const shareUrl = window.location.href;

  return (
    <div className="movie-details-container" style={{
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      padding: '2rem',
      margin: '2rem auto',
      maxWidth: '600px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <h2 style={{ color: '#1a223f', marginBottom: '0.5rem' }}>{movie.title}</h2>
      <p style={{ fontSize: '1.1rem' }}>{movie.overview}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Rating:</strong> {movie.vote_average}</p>
      {trailer && (
        <div className="trailer" style={{ margin: '1rem 0' }}>
          <h4>Trailer</h4>
          <iframe
            width="100%"
            height="215"
            src={`https://www.youtube.com/embed/${trailer}`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: '8px' }}
          />
        </div>
      )}
      <div className="share-buttons" style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
        <FacebookShareButton url={shareUrl} quote={movie.title}>
          <img src="/icons8-facebook-48.png" alt="Facebook" width={32} height={32} />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={movie.title}>
          <img src="/icons8-x-50.png" alt="Twitter/X" width={32} height={32} />
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl} title={movie.title}>
          <img src="/icons8-whatsapp-48.png" alt="WhatsApp" width={32} height={32} />
        </WhatsappShareButton>
      </div>
      <ReviewList movieId={id} />
    </div>
  );
};

export default MovieDetails;
