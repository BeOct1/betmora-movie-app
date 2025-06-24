import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/styles.css';
import Recommendations from '../components/Recommendations';

const Home = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.classList.toggle('dark-mode', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  return (
    <div className={`home-bg-simple${theme === 'dark' ? ' dark-mode' : ''}`}> 
      <div className="home-header-simple">
        <button className="theme-toggle-btn-simple" onClick={toggleTheme} aria-label="Toggle dark/light mode">
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        <span className="movie-icon-simple">🎬</span>
        <h1 className="home-title-simple">Welcome to BeTech Movie Recommendation App | by Bitrus Edward</h1>
        <p className="home-subtitle-simple">Discover, search, and manage your favorite movies in style.</p>
      </div>
      <div className="home-action-simple">
        <Link to="/search" className="home-btn-simple">Start Exploring</Link>
        {user && (
          <Link to="/social" className="home-btn-simple" style={{ marginTop: 16 }}>Social</Link>
        )}
      </div>
      {/* Movie grid or recommendations can go here */}
      <section style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
        <h2 style={{ color: '#91F726', textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24, letterSpacing: 1 }}>
          Recommended For You
        </h2>
        <Recommendations />
      </section>
      {/* Top Rated Movies section */}
      <section style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
        <h2 style={{ color: '#FFD700', textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24, letterSpacing: 1 }}>
          Top Rated Movies
        </h2>
        <Recommendations type="top-rated" />
      </section>
      <footer className="home-footer-simple">
        &copy; {new Date().getFullYear()}, 3MTT Capstone Project | BeTech Solution
      </footer>
    </div>
  );
};

export default Home;
