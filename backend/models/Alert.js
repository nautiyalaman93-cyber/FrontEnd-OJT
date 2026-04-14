const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trainNumber: {
    type: String,
    required: true,
  },
  targetStation: {
    type: String,
    required: true,
  },
  distanceKm: {
    type: Number,
    required: true,
    default: 15,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
