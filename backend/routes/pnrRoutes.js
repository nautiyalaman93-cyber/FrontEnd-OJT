/**
 * @file pnrRoutes.js
 * @description Routes for PNR Status lookup.
 *
 * ENDPOINTS:
 * GET /api/pnr/:pnr → Returns PNR status (live or mock)
 */

const express = require('express');
const { getPNRStatus } = require('../controllers/pnrController');

const router = express.Router();

// No login required — anyone can check PNR
router.get('/:pnr', getPNRStatus);

module.exports = router;
