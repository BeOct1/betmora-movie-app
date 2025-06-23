import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MovieIcon from '@mui/icons-material/Movie';

const Home = () => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: `linear-gradient(rgba(20,30,48,0.85), rgba(36,59,85,0.95)), url('/image.jpg') center/cover no-repeat`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <MovieIcon sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
        <Typography variant="h3" sx={{ color: '#0E0F12', fontWeight: 700, mb: 2, letterSpacing: 1, maxWidth: 520, lineHeight: 1.2, textAlign: 'center' }}>
          🎬 Welcome to BeTech Movie Recommendation App by Bitrus Edward
        </Typography>
        <Typography variant="h6" sx={{ color: '#0E0F12', mb: 3, fontWeight: 400, maxWidth: 520, lineHeight: 1.5 }}>
          Discover, search, and manage your favorite movies in style.
        </Typography>
      </Box>
      <Box
        sx={{
          background: 'rgba(20,30,48,0.85)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(20,30,48,0.5)',
          p: { xs: 3, sm: 6 },
          mt: 0,
          mb: 6,
          textAlign: 'center',
          maxWidth: 600,
        }}
      >
        <Button
          component={Link}
          to="/search"
          size="large"
          variant="contained"
          sx={{
            background: '#91F726',
            color: '#0E0F12',
            fontWeight: 700,
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: 20,
            boxShadow: '0 2px 8px rgba(145,247,38,0.15)',
            transition: 'background 0.2s, transform 0.2s',
            '&:hover': { background: '#7ED520', transform: 'scale(1.05)' },
          }}
        >
          Start Exploring
        </Button>
      </Box>
      {/* Movie grid or recommendations can go here */}
      <Box component="footer" sx={{
        width: '100%',
        textAlign: 'center',
        py: 2,
        mt: 4,
        color: '#91F726',
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: 1,
        background: 'rgba(20,30,48,0.85)',
        borderTop: '1px solidrgb(53, 55, 50)',
        position: 'fixed',
        left: 0,
        bottom: 0,
        zIndex: 1000
      }}>
        &copy; {new Date().getFullYear()}, 3MTT Capstone Project | BeTech Solution
      </Box>
    </Box>
  );
};

export default Home;
