// models_api/Watch.js
const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  metaTags: { type: [String], default: [] },
  condition: { type: String, enum: ['new', 'used'], default: 'new' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Watch || mongoose.model('Watch', watchSchema);
