import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Watchlist from './pages/Watchlist.jsx';

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
