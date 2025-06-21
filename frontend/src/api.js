// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Use this for local development
  baseURL: 'https://betmora-backend.onrender.com/api', // Uncomment for production
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },  
  withCredentials: true,
});

export default API;
