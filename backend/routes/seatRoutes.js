/**
 * @file seatRoutes.js
 * @description Routes for Seat Exchange (P2P Swap Board).
 *
 * ENDPOINTS:
 * GET    /api/seats/all       → Get all open swap requests (Public)
 * POST   /api/seats/request   → Create a new swap request (Protected)
 * DELETE /api/seats/:id       → Close your own request (Protected)
 */

const express = require('express');
const { createRequest, getAllRequests, getMyRequests, deleteRequest, sendMessage, getMessages, getMyConversations } = require('../controllers/seatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/all', getAllRequests);

// Protected routes
router.get('/my-requests', protect, getMyRequests);
router.get('/conversations', protect, getMyConversations);
router.post('/request', protect, createRequest);
router.delete('/:id', protect, deleteRequest);

// Messaging routes
router.post('/:id/message', protect, sendMessage);
router.get('/:id/messages', protect, getMessages);

module.exports = router;
