import React, { useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/styles.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [watchlists, setWatchlists] = useState([]); // For future custom lists

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, password: '' });
    // Fetch user reviews
    API.get('/reviews/user')
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]));
    // TODO: Fetch user watchlists if supporting custom lists
  }, [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put('/auth/profile', form);
      setMessage('Profile updated!');
    } catch {
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="form-container"><p>Please log in.</p></div>;

  return (
    <div className="dashboard-bg">
      <div className="form-container" style={{ maxWidth: 600 }}>
        <h2>User Profile</h2>
        <form onSubmit={handleUpdate}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="New Password (optional)" type="password" />
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Update Profile'}</button>
        </form>
        {message && <p>{message}</p>}
        <hr />
        <h3>Your Reviews</h3>
        {reviews.length === 0 ? <p>No reviews yet.</p> : (
          <ul style={{ paddingLeft: 0 }}>
            {reviews.map(r => (
              <li key={r._id} style={{ marginBottom: 12, listStyle: 'none', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                <strong>{r.rating}/10</strong> for <em>{r.movieTitle || r.movieId}</em>
                <br />
                <span>{r.comment}</span>
                <br />
                <small>{new Date(r.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
        {/* TODO: Show user watchlists if supporting custom lists */}
        <button onClick={logout} style={{ marginTop: 24 }}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
