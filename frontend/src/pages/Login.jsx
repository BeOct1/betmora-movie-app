import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/styles.css';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('All fields are required');
    await login(email, password);
    navigate('/');
  };

  return (
    <div className="form-dialog-bg">
      <div className="form-dialog-container">
        <img src="/logo.svg" alt="Logo" className="spinning-logo" style={{ margin: '0 auto 1rem', display: 'block', height: 56, width: 56 }} />
        <h2 className="form-dialog-title">Login</h2>
        <form onSubmit={handleSubmit} className="form-dialog-form">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
