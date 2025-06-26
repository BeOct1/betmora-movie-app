import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewList = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/api/reviews/${movieId}`);
        setReviews(res.data || []);
      } catch (err) {
        setError("Failed to load reviews");
      }
      setLoading(false);
    };
    if (movieId) fetchReviews();
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("/api/reviews", { movieId, content: review });
      setReview("");
      setReviews([...reviews, { content: review }]);
    } catch {
      setError("Failed to add review");
    }
  };

  return (
    <div className="review-list-container">
      <h3>Reviews</h3>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <ul>
        {reviews.map((r, i) => (
          <li key={i}>{r.content}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Write a review..."
          required
        />
        <button type="submit">Add Review</button>
      </form>
    </div>
  );
};

export default ReviewList;
