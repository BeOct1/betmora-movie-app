import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        email: payload.email,
        username: payload.name,
        avatar: payload.picture,
        // Add other fields as needed
      });
      await user.save();
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ user, token: jwtToken });
  } catch (err) {
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

export default router;
