import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext.jsx';

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
        <Route path="/watchlist" element={user ? <Watchlist /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
// This code defines the main application component for a React-based movie watchlist application.
