import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/styles.css';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/search">Search</Link>
          <Link to="/watchlist">Watchlist</Link>
        </div>
        <div className="auth-links">
          <span>{user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="home-content">
        <h1>🎬 Welcome to BeTech Movie Recommendation App-Betmora, {user?.name}!</h1>
        <p>Discover and manage your favorite movies.</p>
      </div>
    </div>
  );
};

export default Home;
