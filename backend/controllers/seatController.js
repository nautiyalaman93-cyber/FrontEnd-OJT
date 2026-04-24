/**
 * @file seatController.js
 * @description Handles Seat Exchange (P2P Swap) requests.
 */

const SeatRequest = require('../models/SeatRequest');
const Message = require('../models/Message');

// -----------------------------------------------------------------------
// @route   POST /api/seats/request
// @desc    Create a new seat swap request
// @access  Protected
// -----------------------------------------------------------------------
const createRequest = async (req, res) => {
  const { trainNumber, journeyDate, coach, currentSeat, wantedSeat } = req.body;

  if (!trainNumber || !journeyDate || !coach || !currentSeat || !wantedSeat) {
    return res.status(400).json({ message: 'Please fill in all fields (trainNumber, journeyDate, coach, currentSeat, wantedSeat).' });
  }

  try {
    const newRequest = await SeatRequest.create({
      user: req.user._id, // Use actual logged in user
      trainNumber,
      journeyDate,
      coach,
      currentSeat,
      wantedSeat,
      status: 'open',
    });

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
// @access  Public
// -----------------------------------------------------------------------
const getAllRequests = async (req, res) => {
  try {
    const filter = { status: 'open' };
    if (req.query.trainNumber) {
      filter.trainNumber = req.query.trainNumber;
    }
    const requests = await SeatRequest.find(filter)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error('Get Seat Requests Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch seat requests.' });
  }
};

// -----------------------------------------------------------------------
// @route   GET /api/seats/my-requests
// @desc    Get requests created by the logged in user
// @access  Protected
// -----------------------------------------------------------------------
const getMyRequests = async (req, res) => {
  try {
    const requests = await SeatRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Get My Requests Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch your requests.' });
  }
};

// -----------------------------------------------------------------------
// @route   GET /api/seats/conversations
// @desc    Get requests where the user has sent or received messages (excluding their own)
// @access  Protected
// -----------------------------------------------------------------------
const getMyConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    });
    
    const requestIds = [...new Set(messages.map(m => m.seatRequest.toString()))];
    
    const requests = await SeatRequest.find({
      _id: { $in: requestIds },
      user: { $ne: req.user._id } 
    }).populate('user', 'name avatar').sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Get My Conversations Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch conversations.' });
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

    if (request.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own requests.' });
    }

    request.status = 'closed';
    await request.save();

    res.json({ success: true, message: 'Seat request closed successfully.' });
  } catch (error) {
    console.error('Delete Seat Request Error:', error.message);
    res.status(500).json({ message: 'Failed to delete seat request.' });
  }
};

// -----------------------------------------------------------------------
// @route   POST /api/seats/:id/message
// @desc    Send a message to the owner of a seat request
// @access  Protected
// -----------------------------------------------------------------------
const sendMessage = async (req, res) => {
  const { text, receiverId } = req.body;
  try {
    const request = await SeatRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Seat request not found.' });

    // Determine receiver:
    // 1. If sender is someone ELSE, receiver is automatically the request owner.
    // 2. If sender is the OWNER, they must provide a receiverId (the person they are replying to).
    let receiver = request.user;
    
    const isOwner = request.user.toString() === req.user._id.toString();
    
    if (isOwner) {
      if (!receiverId) {
        return res.status(400).json({ message: 'As the owner, you must provide a receiverId to reply.' });
      }
      receiver = receiverId;
    }

    // Safety check: Cannot message yourself
    if (receiver.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send a message to yourself.' });
    }

    const message = await Message.create({
      seatRequest: request._id,
      sender: req.user._id,
      receiver,
      text
    });

    const populated = await message.populate('sender', 'name avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Send Message Error:', error.message);
    res.status(500).json({ message: 'Failed to send message.' });
  }
};

// -----------------------------------------------------------------------
// @route   GET /api/seats/:id/messages
// @desc    Get all messages for a specific seat request (only for sender or receiver)
// @access  Protected
// -----------------------------------------------------------------------
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ seatRequest: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
      
    // Basic filter: only return messages if current user is involved
    const filtered = messages.filter(msg => 
      msg.sender._id.toString() === req.user._id.toString() || 
      msg.receiver.toString() === req.user._id.toString()
    );

    res.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Get Messages Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
};

module.exports = { createRequest, getAllRequests, getMyRequests, deleteRequest, sendMessage, getMessages, getMyConversations };
