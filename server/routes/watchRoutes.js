// server/routes/watchRoutes.js
const express = require('express');
const router = express.Router();
const Watch = require('../models/Watch');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// GET all watches
router.get('/', async (req, res) => {
  try {
    const { brand, model, minPrice, maxPrice, category, metaTag } = req.query;
    
    let query = {};
    
    if (brand) query.brand = new RegExp(brand, 'i');
    if (model) query.model = new RegExp(model, 'i');
    if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    if (category) query.category = category;
    if (metaTag) query.metaTags = { $in: [metaTag] };
    
    const watches = await Watch.find(query);
    res.json(watches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add new watch (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const watch = new Watch(req.body);
    await watch.save();
    res.status(201).json(watch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET single watch by ID
router.get('/:id', async (req, res) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) return res.status(404).json({ error: 'Watch not found' });
    res.json(watch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
