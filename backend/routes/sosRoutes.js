/**
 * @file sosRoutes.js
 * @description Routes for SOS Emergency Alerts.
 *
 * ENDPOINTS:
 * POST /api/sos/trigger     → Trigger a new SOS (Protected)
 * GET  /api/sos/my-alerts   → See your own past SOS submissions (Protected)
 */

const express = require('express');
const { triggerSOS, getMyAlerts } = require('../controllers/sosController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Both endpoints require the user to be logged in
// (We need to know WHO is sending the SOS)
router.post('/trigger', protect, triggerSOS);
router.get('/my-alerts', protect, getMyAlerts);

module.exports = router;
