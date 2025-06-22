import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser)
    return res.status(400).json({ message: 'User with this email or username already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  const token = createToken(user._id);
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Changed for local development
    sameSite: 'Lax', // Changed for local development
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({ user: { name: user.name, username: user.username, email: user.email } });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = createToken(user._id);
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Changed for local development
    sameSite: 'Lax', // Changed for local development
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ user: { name: user.name, email: user.email } });
};

export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // Changed for local development
    sameSite: 'Lax', // Changed for local development
  });
  res.json({ message: 'Logged out' });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  res.json({ name: user.name, email: user.email });
};

export const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, 10);
  await user.save();
  res.json({ name: user.name, email: user.email });
};
