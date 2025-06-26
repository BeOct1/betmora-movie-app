import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import * as Sentry from '@sentry/node';

import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import recommendationRoutesMjs from './routes/recommendationRoutes.mjs';
import favoriteRoutes from './routes/favoriteRoutes.js';
import googleAuthRoutes from './routes/googleAuthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Sentry error tracking
Sentry.init({
  dsn: process.env.SENTRY_DSN || 'YOUR_SENTRY_DSN',
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL, // e.g. https://your-frontend.vercel.app
    'http://localhost:3000',
    'http://localhost:5173',
    'https://betmora-frontend.vercel.app', // Add your actual Vercel frontend URL
  ],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  exposedHeaders: 'Set-Cookie',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/recommendations', recommendationRoutesMjs);
app.use('/api/favorites', favoriteRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Mongo connection error:', err));

// Error handling
app.use(Sentry.Handlers.errorHandler());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

