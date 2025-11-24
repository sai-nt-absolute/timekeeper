// server/middleware/authMiddleware.js
const authenticateAdmin = (req, res, next) => {
  const { password } = req.body;
  
  if (password === 'adminW123') {
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateAdmin };
