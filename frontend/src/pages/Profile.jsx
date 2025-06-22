import React, { useEffect, useState } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/styles.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [watchlists, setWatchlists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [renameList, setRenameList] = useState({ oldName: '', newName: '' });
  const [addMovie, setAddMovie] = useState({ listName: '', tmdbId: '', title: '', poster: '' });
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState('');

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, password: '', confirmPassword: '' });
    API.get('/reviews/user')
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]));
    API.get('/watchlist/custom')
      .then(res => setWatchlists(res.data))
      .catch(() => setWatchlists([]));
  }, [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await API.put('/auth/profile', { name: form.name, email: form.email, password: form.password });
      setMessage('Profile updated!');
      setForm({ ...form, password: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Watchlist handlers
  const handleCreateList = async () => {
    if (!newListName) return;
    setWatchlistLoading(true);
    setError('');
    try {
      const res = await API.post('/watchlist/custom', { name: newListName });
      setWatchlists(res.data);
      setNewListName('');
      setMessage('Watchlist created!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create list');
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleRenameList = async (oldName) => {
    if (!renameList.newName) return;
    setWatchlistLoading(true);
    setError('');
    try {
      const res = await API.post('/watchlist/custom/rename', { oldName, newName: renameList.newName });
      setWatchlists(res.data);
      setRenameList({ oldName: '', newName: '' });
      setMessage('Watchlist renamed!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to rename list');
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleDeleteList = async (name) => {
    if (!window.confirm('Delete this watchlist?')) return;
    setWatchlistLoading(true);
    setError('');
    try {
      const res = await API.post('/watchlist/custom/delete', { name });
      setWatchlists(res.data);
      setMessage('Watchlist deleted.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete list');
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleAddMovie = async (listName) => {
    if (!addMovie.tmdbId || !addMovie.title) return;
    setWatchlistLoading(true);
    setError('');
    try {
      const res = await API.post('/watchlist/custom/add', {
        listName,
        movie: {
          tmdbId: addMovie.tmdbId,
          title: addMovie.title,
          poster: addMovie.poster,
        },
      });
      setWatchlists(watchlists.map(wl => wl.name === listName ? res.data : wl));
      setAddMovie({ listName: '', tmdbId: '', title: '', poster: '' });
      setMessage('Movie added!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add movie');
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleRemoveMovie = async (listName, tmdbId) => {
    if (!window.confirm('Remove this movie from the list?')) return;
    setWatchlistLoading(true);
    setError('');
    try {
      const res = await API.post('/watchlist/custom/remove', { listName, tmdbId });
      setWatchlists(watchlists.map(wl => wl.name === listName ? res.data : wl));
      setMessage('Movie removed.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove movie');
    } finally {
      setWatchlistLoading(false);
    }
  };

  // Review management
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    setReviewLoading(id);
    setError('');
    try {
      await API.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
      setMessage('Review deleted.');
    } catch (err) {
      setError('Failed to delete review.');
    } finally {
      setReviewLoading('');
    }
  };

  if (!user) return <div className="form-container"><p>Please log in.</p></div>;

  return (
    <div className="dashboard-bg">
      <div className="form-container" style={{ maxWidth: 700 }}>
        <h2>User Profile</h2>
        <div style={{ marginBottom: 16, background: '#f8f8f8', padding: 12, borderRadius: 6 }}>
          <strong>Name:</strong> {user.name} <br />
          <strong>Email:</strong> {user.email} <br />
          <strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
        </div>
        <form onSubmit={handleUpdate} style={{ marginBottom: 16 }}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="New Password (optional)" type="password" />
          <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" type="password" />
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Update Profile'}</button>
        </form>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
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
                <button
                  style={{ marginLeft: 12 }}
                  onClick={() => handleDeleteReview(r._id)}
                  disabled={reviewLoading === r._id}
                  type="button"
                >
                  {reviewLoading === r._id ? 'Deleting...' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        )}
        <hr />
        <h3>Your Watchlists</h3>
        <div style={{ marginBottom: 16 }}>
          <input
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
            placeholder="New watchlist name"
            style={{ marginRight: 8 }}
            disabled={watchlistLoading}
          />
          <button onClick={handleCreateList} type="button" disabled={watchlistLoading}>Create</button>
        </div>
        {watchlists.length === 0 ? <p>No watchlists yet.</p> : (
          <ul style={{ paddingLeft: 0 }}>
            {watchlists.map(wl => (
              <li key={wl.name} style={{ marginBottom: 18, listStyle: 'none', border: '1px solid #eee', borderRadius: 6, padding: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong>{wl.name}</strong>
                  <button onClick={() => setRenameList({ oldName: wl.name, newName: '' })} type="button" disabled={watchlistLoading}>Rename</button>
                  <button onClick={() => handleDeleteList(wl.name)} type="button" disabled={watchlistLoading}>Delete</button>
                </div>
                {renameList.oldName === wl.name && (
                  <div style={{ marginTop: 6 }}>
                    <input
                      value={renameList.newName}
                      onChange={e => setRenameList({ ...renameList, newName: e.target.value })}
                      placeholder="New name"
                      style={{ marginRight: 8 }}
                      disabled={watchlistLoading}
                    />
                    <button onClick={() => handleRenameList(wl.name)} type="button" disabled={watchlistLoading}>Save</button>
                    <button onClick={() => setRenameList({ oldName: '', newName: '' })} type="button" disabled={watchlistLoading}>Cancel</button>
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <strong>Movies:</strong>
                  {wl.movies.length === 0 ? <span> (none)</span> : null}
                  <ul style={{ paddingLeft: 16, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {wl.movies.map(m => (
                      <li key={m.tmdbId} style={{ marginBottom: 4, listStyle: 'none', border: '1px solid #ddd', borderRadius: 4, padding: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {m.poster && <img src={`https://image.tmdb.org/t/p/w92/${m.poster}`} alt={m.title} style={{ width: 40, borderRadius: 3 }} />}
                        <span>{m.title}</span>
                        <button style={{ marginLeft: 8 }} onClick={() => handleRemoveMovie(wl.name, m.tmdbId)} type="button" disabled={watchlistLoading}>Remove</button>
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 6 }}>
                    <input
                      value={addMovie.listName === wl.name ? addMovie.tmdbId : ''}
                      onChange={e => setAddMovie({ ...addMovie, listName: wl.name, tmdbId: e.target.value })}
                      placeholder="TMDB ID"
                      style={{ width: 80, marginRight: 4 }}
                      disabled={watchlistLoading}
                    />
                    <input
                      value={addMovie.listName === wl.name ? addMovie.title : ''}
                      onChange={e => setAddMovie({ ...addMovie, listName: wl.name, title: e.target.value })}
                      placeholder="Title"
                      style={{ width: 120, marginRight: 4 }}
                      disabled={watchlistLoading}
                    />
                    <input
                      value={addMovie.listName === wl.name ? addMovie.poster : ''}
                      onChange={e => setAddMovie({ ...addMovie, listName: wl.name, poster: e.target.value })}
                      placeholder="Poster URL (optional)"
                      style={{ width: 120, marginRight: 4 }}
                      disabled={watchlistLoading}
                    />
                    <button onClick={() => handleAddMovie(wl.name)} type="button" disabled={watchlistLoading}>Add Movie</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button onClick={logout} style={{ marginTop: 24 }}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
