// utils_api.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./lib/models/User');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri, { dbName: 'watch_marketplace' });
  isConnected = true;

  // seed admin (non-blocking)
  try {
    const existing = await User.findOne({ email: 'admin@example.com' }).lean();
    if (!existing) {
      const hash = await bcrypt.hash('adminW123', 10);
      await User.create({ email: 'admin@example.com', passwordHash: hash, role: 'admin' });
      console.log('Seeded admin (admin@example.com / adminW123). Change immediately.');
    }
  } catch (err) {
    console.warn('Seed admin error:', err.message);
  }
}

module.exports = { connectDB };
