// lib/db.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

let isConnected = false;

async function connectDB() {
  if (isConnected) return mongoose;
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI environment variable missing');
  await mongoose.connect(uri, { dbName: 'watch_marketplace' });
  isConnected = true;

  // Seed admin if not present
  try {
    const existing = await User.findOne({ email: 'admin@example.com' }).lean();
    if (!existing) {
      const password = 'adminW123';
      const hash = await bcrypt.hash(password, 10);
      await User.create({ email: 'admin@example.com', passwordHash: hash, role: 'admin' });
      console.log('Seeded admin: admin@example.com / adminW123 — please change immediately.');
    } else {
      console.log('Admin already exists, skipping seed.');
    }
  } catch (err) {
    console.warn('Admin seeding error (non-blocking):', err.message);
  }

  console.log('Connected to MongoDB');
  return mongoose;
}

module.exports = { connectDB };
