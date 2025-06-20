// src/App.js
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AppRouter from './AppRouter.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
// If you have a NotificationProvider, import it. Otherwise, use a placeholder.
// import NotificationProvider from './context/NotificationProvider.jsx';
const NotificationProvider = ({ children }) => children; // Remove this if you have the real provider

function Dashboard() {
  return <h2>Welcome to 🎬 Betmora </h2>;
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <GoogleOAuthProvider clientId="240218761531-6c18rp9326jmdl5ebvhm3g4mnkcjaia3.apps.googleusercontent.com">
      <NotificationProvider>
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle dark/light mode">
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </NotificationProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
