// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/styles.css';

function Navbar() {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.post('/api/auth/logout', {}, { withCredentials: true });
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/home" className="nav-link">Home</Link>
            {user && (
                <>
                    <Link to="/search" className="nav-link">Search</Link>
                    <Link to="/watchlist" className="nav-link">Watchlist</Link>
                    <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
                </>
            )}
            {!user && (
                <>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/register" className="nav-link">Register</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;
