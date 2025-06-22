import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch current user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get('/auth/me');
                setUser(res.data.user);
            } catch (err) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await API.post('/auth/login', { email, password });
            setUser(res.data.user);
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, username, email, password) => {
        setLoading(true);
        try {
            const res = await API.post('/auth/register', { name, username, email, password });
            setUser(res.data.user);
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await API.post('/auth/logout');
            setUser(null);
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
