// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Empty route file - we'll handle authentication differently
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes ready' });
});

module.exports = router;
