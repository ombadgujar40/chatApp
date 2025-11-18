// server/controllers/auth.controller.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/asyncHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'replace_with_a_secret';
const JWT_EXPIRES_IN = '7d';

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// POST /api/auth/login
// body: { email, password, name? }
// If user doesn't exist, create it (testing mode). If exists, verify password (plain compare).
exports.login = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ ok: false, msg: 'email and password required' });

  let user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // create user for testing
    user = await User.create({ email: email.toLowerCase(), password, name: name || email.split('@')[0] });
  } else {
    // plain-text check (testing only)
    if (user.password !== password) {
      return res.status(401).json({ ok: false, msg: 'Invalid credentials' });
    }
  }

  const token = signToken(user);
  res.json({ ok: true, token, user: { self_id: req.user, id: user._id, name: user.name, email: user.email } });
});

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(200).json({ ok: true, user: null });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    return res.json({ ok: true, user });
  } catch (err) {
    return res.status(401).json({ ok: false, msg: 'Invalid token' });
  }
});
