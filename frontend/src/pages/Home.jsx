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

  // Netflix-style horizontal scroll row
  const MovieRow = ({ title, movies, loading, error, icon }) => (
    <section className="movie-row-section">
      <h2 className="movie-row-title">
        {icon && <span className="movie-row-icon">{icon}</span>} {title}
      </h2>
      {loading ? (
        <div className="movie-row-skeleton">
          {[...Array(6)].map((_, i) => <div className="movie-card-skeleton" key={i} />)}
        </div>
      ) : error ? (
        <div className="movie-row-error">{error}</div>
      ) : movies && movies.length ? (
        <div className="movie-row-scroll">
          {movies.map(movie => <MovieCard key={movie.id || movie.tmdbId} movie={movie} />)}
        </div>
      ) : (
        <div className="movie-row-empty">No movies found.</div>
      )}
    </section>
  );

  return (
    <main className={`home-bg-netflix${theme === 'dark' ? ' dark-mode' : ''}`}> 
      <header className="home-header-netflix">
        <div className="home-hero-netflix">
          <span className="movie-icon-netflix">🎬</span>
          <h1 className="home-title-netflix">Welcome to BetMora</h1>
          <p className="home-subtitle-netflix">Your personalized movie universe. Discover, search, and manage your favorites in style.</p>
          <nav className="home-action-netflix" aria-label="Quick navigation">
            <Link to="/search" className="home-btn-netflix" aria-label="Start Exploring">Start Exploring</Link>
            {user && (
              <Link to="/social" className="home-btn-netflix" aria-label="Go to Social">Social</Link>
            )}
          </nav>
        </div>
      </header>
      {/* Netflix-style rows: Just For You, Continue Watching, Because You Liked, Top Rated, Trending */}
      {user && <MovieRow
        title="Just For You"
        icon="✨"
        movies={personalized}
        loading={loadingPersonalized}
        error={errorPersonalized}
      />}
      {user && <MovieRow
        title="Continue Watching"
        icon="⏯️"
        movies={continueWatching}
        loading={loadingCW}
        error={errorCW}
      />}
      {user && <MovieRow
        title="Because You Liked..."
        icon="💡"
        movies={becauseYouLiked}
        loading={loadingBYL}
        error={errorBYL}
      />}
      <section className="movie-row-section">
        <h2 className="movie-row-title"><span className="movie-row-icon">🔥</span> Trending Now</h2>
        <Recommendations type="trending" rowStyle />
      </section>
      <section className="movie-row-section">
        <h2 className="movie-row-title"><span className="movie-row-icon">🏆</span> Top Rated Movies</h2>
        <Recommendations type="top-rated" rowStyle />
      </section>
      <footer className="home-footer-netflix">
        &copy; {new Date().getFullYear()}, 3MTT Capstone Project | BeTech Solution
      </footer>
    </main>
  );
};

export default Home;
