import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

const generateToken = (userId) =>
  jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: JWT_EXPIRY }
  );

const normalizeEmail = (e) => (e || '').toString().toLowerCase().trim();

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const emailNorm = normalizeEmail(email);
    const existing = await User.findOne({ email: emailNorm });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    const user = await User.create({ email: emailNorm, passwordHash: password });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, subscriptionPlan: user.subscriptionPlan }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: normalizeEmail(email) }).select('+passwordHash');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, email: user.email, subscriptionPlan: user.subscriptionPlan }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
