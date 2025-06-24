import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api';
import '../styles/styles.css';

const Social = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await API.get('/users');
      setUsers(res.data.filter(u => u._id !== user._id));
      setLoading(false);
    };
    const fetchSocial = async () => {
      const [fRes, gRes] = await Promise.all([
        API.get(`/users/${user._id}/followers`),
        API.get(`/users/${user._id}/following`)
      ]);
      setFollowers(fRes.data);
      setFollowing(gRes.data);
    };
    fetchUsers();
    fetchSocial();
  }, [user._id]);

  const handleFollow = async (id) => {
    await API.post(`/users/${id}/follow`);
    window.location.reload();
  };
  const handleUnfollow = async (id) => {
    await API.post(`/users/${id}/unfollow`);
    window.location.reload();
  };

  return (
    <div className="form-container">
      <h2>Social</h2>
      <h3>All Users</h3>
      {loading ? <div>Loading...</div> : (
        <ul>
          {users.map(u => (
            <li key={u._id} style={{ marginBottom: 8 }}>
              {u.name} (@{u.username})
              {following.some(f => f._id === u._id) ? (
                <button className="button" onClick={() => handleUnfollow(u._id)} style={{ marginLeft: 8 }}>Unfollow</button>
              ) : (
                <button className="button" onClick={() => handleFollow(u._id)} style={{ marginLeft: 8 }}>Follow</button>
              )}
            </li>
          ))}
        </ul>
      )}
      <h3>Followers</h3>
      <ul>
        {followers.map(f => <li key={f._id}>{f.name} (@{f.username})</li>)}
      </ul>
      <h3>Following</h3>
      <ul>
        {following.map(f => <li key={f._id}>{f.name} (@{f.username})</li>)}
      </ul>
    </div>
  );
};

export default Social;
