import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';

const AppRouter = () => {
    const { user } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />
                <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
                <Route path="/watchlist" element={user ? <Watchlist /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
