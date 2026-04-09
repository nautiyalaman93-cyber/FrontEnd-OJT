/**
 * @file seatController.js
 * @description Handles Seat Exchange (P2P Swap) requests.
 *
 * FEATURES:
 * - Any logged-in user can POST a swap request.
 * - Anyone can GET all open swap requests.
 * - Users can delete (close) their own requests.
 *
 * ROUTES HANDLED:
 * - POST /api/seats/request  → Create a new swap request
 * - GET  /api/seats/all      → Get all open requests
 * - DELETE /api/seats/:id    → Close/delete your own request
 */

const SeatRequest = require('../models/SeatRequest');

// -----------------------------------------------------------------------
// @route   POST /api/seats/request
// @desc    Create a new seat swap request
// @access  Public (Guest Mode for now)
// -----------------------------------------------------------------------
const createRequest = async (req, res) => {
  const { trainNumber, journeyDate, coach, currentSeat, wantedSeat } = req.body;

  // Make sure all required fields are present
  if (!trainNumber || !journeyDate || !coach || !currentSeat || !wantedSeat) {
    return res.status(400).json({ message: 'Please fill in all fields (trainNumber, journeyDate, coach, currentSeat, wantedSeat).' });
  }

  try {
    // Guest Mode: Find or create a dummy user
    const User = require('../models/User');
    let dummyUser = await User.findOne({ email: 'guest@bharatpath.com' });
    if (!dummyUser) {
      dummyUser = await User.create({
        googleId: 'dummy_guest_id',
        name: 'Guest User',
        email: 'guest@bharatpath.com',
      });
    }

    const newRequest = await SeatRequest.create({
      user: dummyUser._id, // Use dummy user ID
      trainNumber,
      journeyDate,
      coach,
      currentSeat,
      wantedSeat,
      status: 'open',
    });

    // Send back the created request with user's name populated
    const populated = await newRequest.populate('user', 'name avatar');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Create Seat Request Error:', error.message);
    res.status(500).json({ message: 'Failed to create seat request.' });
  }
};

// -----------------------------------------------------------------------
// @route   GET /api/seats/all
// @desc    Get all open seat swap requests
// @access  Public (anyone can see the board)
// -----------------------------------------------------------------------
const getAllRequests = async (req, res) => {
  try {
    // Only show "open" requests, sorted by newest first
    const requests = await SeatRequest.find({ status: 'open' })
      .populate('user', 'name avatar') // Show who posted it
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error('Get Seat Requests Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch seat requests.' });
  }
};

// -----------------------------------------------------------------------
// @route   DELETE /api/seats/:id
// @desc    Close/delete your own seat swap request
// @access  Protected
// -----------------------------------------------------------------------
const deleteRequest = async (req, res) => {
  try {
    const request = await SeatRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Seat request not found.' });
    }

    // Make sure the user deleting this is the one who created it (Bypassed for Guest mode)
    // if (request.user.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'You can only delete your own requests.' });
    // }

    // Mark as closed instead of permanently deleting (better for records)
    request.status = 'closed';
    await request.save();

    res.json({ success: true, message: 'Seat request closed successfully.' });
  } catch (error) {
    console.error('Delete Seat Request Error:', error.message);
    res.status(500).json({ message: 'Failed to delete seat request.' });
  }
};

module.exports = { createRequest, getAllRequests, deleteRequest };
