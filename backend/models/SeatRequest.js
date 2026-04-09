/**
 * @file SeatRequest.js
 * @description MongoDB Schema for a Seat Exchange request.
 *
 * When a user wants to swap their seat, they fill a form.
 * We save that form data here.
 * Other users can then see all "Open" requests and agree to swap.
 */

const mongoose = require('mongoose');

const seatRequestSchema = new mongoose.Schema(
  {
    // The user who posted this swap request
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Train number (e.g., "12952")
    trainNumber: {
      type: String,
      required: true,
    },

    // Date of journey (e.g., "2024-12-25")
    journeyDate: {
      type: String,
      required: true,
    },

    // Coach name (e.g., "S4", "B2")
    coach: {
      type: String,
      required: true,
    },

    // The seat the user currently HAS (e.g., "Upper", "Side Lower")
    currentSeat: {
      type: String,
      required: true,
    },

    // The seat the user WANTS (e.g., "Lower Berth")
    wantedSeat: {
      type: String,
      required: true,
    },

    // Is this request still available?
    // "open" → waiting for someone to swap
    // "accepted" → someone agreed to swap
    // "closed" → request cancelled
    status: {
      type: String,
      enum: ['open', 'accepted', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SeatRequest', seatRequestSchema);
