/**
 * @file pnrController.js
 * @description Handles PNR Status lookups.
 *
 * HOW IT WORKS:
 * 1. User enters their PNR in the frontend.
 * 2. Frontend calls GET /api/pnr/:pnr
 * 3. This controller checks if a RAPIDAPI_KEY exists in .env.
 *    - If NO key → We return mock data from pnrMock.json (good for demos!)
 *    - If YES key → We call the real RapidAPI and return live data.
 */

const railwayAPI = require('../services/apiService');
const pnrMock = require('../mock/pnrMock.json');

// -----------------------------------------------------------------------
// @route   GET /api/pnr/:pnr
// @desc    Get PNR status (live or mock fallback)
// @access  Public (no login needed to check PNR)
// -----------------------------------------------------------------------
const getPNRStatus = async (req, res) => {
  const { pnr } = req.params;

  // Validate PNR: IRCTC PNR numbers are exactly 10 digits
  if (!pnr || pnr.length !== 10 || isNaN(pnr)) {
    return res.status(400).json({ message: 'Please provide a valid 10-digit PNR number.' });
  }

  // If no API key, use mock data
  if (!process.env.RAPIDAPI_KEY) {
    console.log('⚠️  No RAPIDAPI_KEY found. Using mock PNR data.');
    return res.json({ success: true, data: pnrMock, isMock: true });
  }

  // If API key exists, call RapidAPI
  try {
    const response = await railwayAPI.get(`/api/v3/getPNRStatus?pnrNumber=${pnr}`);
    return res.json({ success: true, data: response.data.data });
  } catch (error) {
    console.error('PNR API Error:', error.message);
    // Even if real API fails, fall back to mock so UI doesn't crash
    return res.json({ success: true, data: pnrMock, isMock: true, note: 'API failed, showing mock data.' });
  }
};

module.exports = { getPNRStatus };
