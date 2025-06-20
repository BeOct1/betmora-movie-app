// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://betmora-backend.onrender.com/api',
  withCredentials: true,
});

export default API;
