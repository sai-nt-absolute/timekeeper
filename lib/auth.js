// lib/auth.js
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function createTokenForUser(user) {
  // minimal payload: id and role
  return jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '4h' });
}

async function verifyToken(token) {
  if (!token) throw new Error('No token');
  const payload = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(payload.id).select('-passwordHash').lean();
  if (!user) throw new Error('User not found');
  return user;
}

// Express-like middleware helper for API routes
async function requireAdmin(req, res) {
  try {
    const header = req.headers.authorization || '';
    const token = header.split(' ')[1];
    const user = await verifyToken(token);
    if (user.role !== 'admin') {
      res.status(403).json({ message: 'Admin only' });
      return null;
    }
    return user;
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: ' + (err.message || 'invalid token') });
    return null;
  }
}

module.exports = { createTokenForUser, verifyToken, requireAdmin };
