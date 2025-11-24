// server/models/Watch.js
const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['diver', 'chronograph', 'dress', 'sport', 'smart', 'luxury'],
    default: 'luxury'
  },
  features: [{
    type: String
  }],
  metaTags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Watch', watchSchema);
