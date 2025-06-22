// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/styles.css'; // Ensure you have the correct path to your CSS file 
import axios from 'axios';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
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

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-links">
                {user && (
                    <>
                        <Link to="/">Home</Link>
                        <Link to="/search">Search</Link>
                        <Link to="/watchlist">Watchlist</Link>
                    </>
                )}
            </div>
            <div className="auth-links">
                <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle dark/light mode">
                    {theme === 'dark' ? '🌞' : '🌙'}
                </button>
                {user ? (
                    <>
                        <span>Welcome, {user.name}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
