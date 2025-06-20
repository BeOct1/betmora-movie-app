// src/App.js
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppRouter from './AppRouter';

function Dashboard() {
  return <h2>Welcome to 🎬 Betmora </h2>;
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
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
