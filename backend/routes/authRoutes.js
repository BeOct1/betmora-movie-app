// routes/authRoutes.js
import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
} from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
// routes/authRoutes.js
// This code defines the authentication routes for user registration, login, logout, and fetching the current user.
// It uses Express.js to create a router and maps HTTP methods to controller functions.
// The `registerUser`, `loginUser`, `logoutUser`, and `getCurrentUser` functions are imported from the `authController.js` file.
// The `authMiddleware` is used to protect the `/me` route, ensuring that only authenticated users can access their information.
// The router is then exported for use in the main application file, allowing it to be mounted on a specific path in the server.
// This modular approach helps keep the code organized and maintainable, separating concerns between routing and business logic.
// The routes are designed to handle user authentication in a RESTful manner, providing endpoints
