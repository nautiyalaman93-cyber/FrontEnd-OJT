/**
 * @file User.js
 * @description MongoDB Schema for a BharatPath user.
 *
 * We don't store passwords because Login is handled by Google.
 * Google gives us the user's name, email, and photo URL.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Unique ID provided by Google for this user
    googleId: {
      type: String,
      required: true,
      unique: true,
    },

    // Full name from Google profile
    name: {
      type: String,
      required: true,
    },

    // Email from Google profile
    email: {
      type: String,
      required: true,
    },

    // Profile picture URL from Google
    avatar: {
      type: String,
      default: '',
    },

    // Emergency contacts the user adds for SOS feature
    emergencyContacts: [
      {
        name: String,
        phone: String,
      },
    ],
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
