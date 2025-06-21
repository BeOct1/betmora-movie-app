// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: 'https://betmora-backend.onrender.com/api',
  baseURL: 'http://localhost:5000/api', // Uncomment for local development
  timeout: 10000, // Set a timeout for requests
  // Set default headers
  headers: {
    'Content-Type': 'application/json',
  },  
  withCredentials: true,
});

export default API;
