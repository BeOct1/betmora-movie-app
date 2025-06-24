import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/styles.css';
import Recommendations from '../components/Recommendations';
import MovieCard from '../components/MovieCard.jsx';
import { getContinueWatching, getBecauseYouLiked, getPersonalizedRecommendations } from '../api';

const Home = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [continueWatching, setContinueWatching] = useState(null);
  const [becauseYouLiked, setBecauseYouLiked] = useState(null);
  const [personalized, setPersonalized] = useState(null);
  const [loadingCW, setLoadingCW] = useState(false);
  const [loadingBYL, setLoadingBYL] = useState(false);
  const [loadingPersonalized, setLoadingPersonalized] = useState(false);
  const [errorCW, setErrorCW] = useState(null);
  const [errorBYL, setErrorBYL] = useState(null);
  const [errorPersonalized, setErrorPersonalized] = useState(null);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.classList.toggle('dark-mode', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (user) {
      setLoadingCW(true);
      setLoadingBYL(true);
      setLoadingPersonalized(true);
      getContinueWatching()
        .then(data => setContinueWatching(data))
        .catch(() => setErrorCW('Failed to load.'))
        .finally(() => setLoadingCW(false));
      getBecauseYouLiked()
        .then(data => setBecauseYouLiked(data))
        .catch(() => setErrorBYL('Failed to load.'))
        .finally(() => setLoadingBYL(false));
      getPersonalizedRecommendations()
        .then(data => setPersonalized(data))
        .catch(() => setErrorPersonalized('Failed to load.'))
        .finally(() => setLoadingPersonalized(false));
    }
  }, [user]);

  return (
    <main className={`home-bg-simple${theme === 'dark' ? ' dark-mode' : ''}`}> 
      <header className="home-header-simple">
        <button className="theme-toggle-btn-simple" onClick={toggleTheme} aria-label="Toggle dark/light mode">
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        <span className="movie-icon-simple">🎬</span>
        <h1 className="home-title-simple" style={{ fontSize: '2.2rem' }}>Welcome to BeTech Movie Recommendation App | by Bitrus Edward</h1>
        <p className="home-subtitle-simple" style={{ fontSize: '1.1rem' }}>Discover, search, and manage your favorite movies in style.</p>
      </header>
      <nav className="home-action-simple" aria-label="Quick navigation">
        <Link to="/search" className="home-btn-simple" aria-label="Start Exploring">Start Exploring</Link>
        {user && (
          <Link to="/social" className="home-btn-simple" style={{ marginTop: 16 }} aria-label="Go to Social">Social</Link>
        )}
      </nav>
      {/* Personalized Recommendations Section */}
      {user && (
        <section style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
          <h2 style={{ color: '#91F726', textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24, letterSpacing: 1 }}>
            Just For You
          </h2>
          {loadingPersonalized ? (
            <div className="movie-grid-skeleton">
              {[...Array(6)].map((_, i) => <div className="movie-card-skeleton" key={i} />)}
            </div>
          ) : errorPersonalized ? (
            <div style={{ color: '#f44336', textAlign: 'center' }}>{errorPersonalized}</div>
          ) : personalized && personalized.length ? (
            <div className="movie-grid">
              {personalized.map(movie => <MovieCard key={movie.id || movie.tmdbId} movie={movie} />)}
            </div>
          ) : (
            <div style={{ color: '#aaa', textAlign: 'center' }}>
              <span style={{ fontSize: 32 }}>🎬</span>
              <div>Like, review, or watch movies to get personalized picks!</div>
            </div>
          )}
        </section>
      )}
      {/* Continue Watching Section */}
      {user && (
        <section style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
          <h2 style={{ color: '#00e6e6', textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24, letterSpacing: 1 }}>
            Continue Watching
          </h2>
          {loadingCW ? (
            <div className="movie-grid-skeleton">
              {[...Array(4)].map((_, i) => <div className="movie-card-skeleton" key={i} />)}
            </div>
          ) : errorCW ? (
            <div style={{ color: '#f44336', textAlign: 'center' }}>{errorCW}</div>
          ) : continueWatching && continueWatching.length ? (
            <div className="movie-grid">
              {continueWatching.map(movie => <MovieCard key={movie.id || movie.tmdbId} movie={movie} />)}
            </div>
          ) : (
            <div style={{ color: '#aaa', textAlign: 'center' }}>
              <span style={{ fontSize: 32 }}>⏯️</span>
              <div>No movies to continue. Start watching something!</div>
            </div>
          )}
        </section>
      )}
      {/* Because You Liked Section */}
      {user && (
        <section style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
          <h2 style={{ color: '#ff9800', textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 24, letterSpacing: 1 }}>
            Because you liked...
          </h2>
          {loadingBYL ? (
            <div className="movie-grid-skeleton">
              {[...Array(4)].map((_, i) => <div className="movie-card-skeleton" key={i} />)}
            </div>
          ) : errorBYL ? (
            <div style={{ color: '#f44336', textAlign: 'center' }}>{errorBYL}</div>
          ) : becauseYouLiked && becauseYouLiked.length ? (
            <div className="movie-grid">
              {becauseYouLiked.map(movie => <MovieCard key={movie.id || movie.tmdbId} movie={movie} />)}
            </div>
          ) : (
            <div style={{ color: '#aaa', textAlign: 'center' }}>
              <span style={{ fontSize: 32 }}>💡</span>
              <div>Like some movies to get personalized picks!</div>
            </div>
          )}
        </section>
      )}
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
      <footer className="home-footer-simple" style={{ fontSize: '1rem' }}>
        &copy; {new Date().getFullYear()}, 3MTT Capstone Project | BeTech Solution
      </footer>
    </main>
  );
};

export default Home;
