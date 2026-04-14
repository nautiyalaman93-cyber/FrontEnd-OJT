/**
 * @file trainRoutes.js
 * @description Routes for Live Train Status and Train Search.
 *
 * ENDPOINTS:
 * GET /api/trains/status?number=12952&date=20241225 → Live Status
 * GET /api/trains/search?from=NDLS&to=MMCT&date=20241225 → Search Trains
 */

const express = require('express');
const { getTrainStatus, searchTrains, searchStations, getConnectingJourneys } = require('../controllers/trainController');

const router = express.Router();

// Live train status — no login needed
router.get('/status', getTrainStatus);

// Search trains between stations — no login needed
router.get('/search', searchTrains);

// Search stations
router.get('/stations/search', searchStations);

// Connecting journeys
router.get('/connecting', getConnectingJourneys);

module.exports = router;
