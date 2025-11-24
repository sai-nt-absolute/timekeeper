// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB - ADD YOUR ACTUAL MONGODB URI HERE
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/timekeeper';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// API Routes
app.use('/api/watches', require('./routes/watchRoutes'));

// Serve React app only in production and when build exists
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  console.log('Trying to serve static files from:', buildPath);
  
  // Check if build directory exists
  const fs = require('fs');
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  } else {
    console.log('Build directory does not exist. Serving API only.');
    app.get('*', (req, res) => {
      res.json({ message: 'Time Keeper API is running!' });
    });
  }
}

app.listen(PORT, () => {
  console.log(`Time Keeper server running on port ${PORT}`);
});

module.exports = app;
