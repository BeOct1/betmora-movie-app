// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Use this for local development
  // baseURL: 'https://betmora-backend.onrender.com/api', // Uncomment for production
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },  
  withCredentials: true,
});

// Fetch Continue Watching and Because You Liked
export const getContinueWatching = async () => {
  const res = await API.get('/recommendations/continue-watching');
  return res.data;
};

export const getBecauseYouLiked = async () => {
  const res = await API.get('/recommendations/because-you-liked');
  return res.data;
};

export const getPersonalizedRecommendations = async () => {
  const res = await API.get('/recommendations/personalized');
  return res.data;
};

export default API;
