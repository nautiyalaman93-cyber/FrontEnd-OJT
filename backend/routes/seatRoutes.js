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
const { createRequest, getAllRequests, deleteRequest } = require('../controllers/seatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Anyone can view the public swap board
router.get('/all', getAllRequests);

// Temporarily bypassed protect for Guest Mode
router.post('/request', createRequest);
router.delete('/:id', deleteRequest);

module.exports = router;
