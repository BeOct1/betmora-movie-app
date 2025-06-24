// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/styles.css'; // Ensure you have the correct path to your CSS file 
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MovieIcon from '@mui/icons-material/Movie';
import logo from '../../public/logo.svg';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);

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
        <AppBar position="static" sx={{
            background: 'linear-gradient(90deg, #141e30 0%, #243b55 100%)',
            boxShadow: '0 4px 24px rgba(20,30,48,0.4)'
        }}>
            <Toolbar sx={{ minHeight: 72, px: { xs: 1, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <img src={logo} alt="BetMora Logo" className="spinning-logo" style={{ height: 48, width: 48, marginRight: 12 }} />
                    <MovieIcon sx={{ fontSize: 36, color: '#ff9800', mr: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1, color: '#fff', mr: 4 }}>
                        BetMora
                    </Typography>
                    {user && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/"
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    px: 2,
                                    '&:hover': { background: 'rgba(255,152,0,0.1)' }
                                }}
                            >
                                Home
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/search"
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    px: 2,
                                    '&:hover': { background: 'rgba(255,152,0,0.1)' }
                                }}
                            >
                                Search
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/watchlist"
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    px: 2,
                                    '&:hover': { background: 'rgba(255,152,0,0.1)' }
                                }}
                            >
                                Watchlist
                            </Button>
                        </Box>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={toggleTheme} color="inherit" aria-label="Toggle dark/light mode" sx={{
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: 2,
                        '&:hover': { background: 'rgba(255,255,255,0.18)' }
                    }}>
                        {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    {user ? (
                        <>
                            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500, mr: 2 }}>
                                Welcome, {user.name}
                            </Typography>
                            <Button
                                color="secondary"
                                onClick={handleLogout}
                                variant="contained"
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    background: '#ff9800',
                                    color: '#222',
                                    boxShadow: 'none',
                                    '&:hover': { background: '#ffa726' }
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color="secondary"
                                onClick={() => setOpenLogin(true)}
                                variant="contained"
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    background: '#ff9800',
                                    color: '#222',
                                    boxShadow: 'none',
                                    '&:hover': { background: '#ffa726' }
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => setOpenRegister(true)}
                                variant="outlined"
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    borderColor: '#ff9800',
                                    color: '#ff9800',
                                    background: 'rgba(255,152,0,0.08)',
                                    '&:hover': { background: 'rgba(255,152,0,0.18)', borderColor: '#ffa726', color: '#ffa726' }
                                }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
            {/* Login Dialog */}
            <Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ background: '#243b55', color: '#fff' }}>
                    Login
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenLogin(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ background: '#141e30' }}>
                    <Login />
                </DialogContent>
            </Dialog>
            {/* Register Dialog */}
            <Dialog open={openRegister} onClose={() => setOpenRegister(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ background: '#243b55', color: '#fff' }}>
                    Register
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenRegister(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ background: '#141e30' }}>
                    <Register />
                </DialogContent>
            </Dialog>
        </AppBar>
    );
};

export default Navbar;
