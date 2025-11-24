// pages/api/auth/login.js
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../utils_api';
import User from '../../../models_api/User';
import { createTokenForUser } from '../../../lib/apiAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createTokenForUser(user);
    return res.json({ token, role: user.role, email: user.email });
  } catch (err) {
    console.error('Auth error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
