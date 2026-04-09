/**
 * @file SOS.js
 * @description MongoDB Schema for an SOS Emergency Alert.
 *
 * When a user triggers the SOS button, we save their:
 * - Location (lat/lng)
 * - Train number
 * - Emergency type
 * - Time of alert
 *
 * This creates a log that can be reviewed for safety/auditing.
 */

const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema(
  {
    // The user who triggered the SOS
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Train they are currently on
    trainNumber: {
      type: String,
      required: true,
    },

    // GPS coordinates from the user's browser
    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    // What type of emergency this is
    emergencyType: {
      type: String,
      enum: ['Medical', 'Security', 'Fire', 'Other'],
      default: 'Other',
    },

    // Any extra info the user typed before sending SOS
    description: {
      type: String,
      default: '',
    },

    // A unique reference ID shown to the user after submission
    referenceId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true, // createdAt = exact time SOS was triggered
  }
);

// Auto-generate a referenceId like "EMG-1712345678123" before saving
sosSchema.pre('save', function (next) {
  if (!this.referenceId) {
    this.referenceId = `EMG-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('SOS', sosSchema);
