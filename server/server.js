// server/server.js (Clean version)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/timekeeper', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API Routes - ONLY keep what you actually need
app.use('/api/watches', require('./routes/watchRoutes'));
// DON'T include this line if you don't want auth routes:
// app.use('/api/auth', require('./routes/authRoutes')); 

// Serve React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Time Keeper server running on port ${PORT}`);
});

module.exports = app;
