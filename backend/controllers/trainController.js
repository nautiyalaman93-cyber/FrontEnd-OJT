/**
 * @file trainController.js
 * @description Handles Live Train Status and Train Search.
 *
 * HOW IT WORKS:
 * - Same pattern as PNR: if API key is present → real API.
 * - If key is missing or API fails → return mock JSON.
 *
 * ROUTES HANDLED:
 * - GET /api/trains/status?number=12952&date=20241225  → Live Status
 * - GET /api/trains/search?from=NDLS&to=MMCT&date=20241225 → Search Trains
 */

const railwayAPI = require('../services/apiService');
const trainMock = require('../mock/trainMock.json');

// -----------------------------------------------------------------------
// @route   GET /api/trains/status
// @desc    Get live running status of a train
// @access  Public
// -----------------------------------------------------------------------
const getTrainStatus = async (req, res) => {
  const { number, date } = req.query;

  if (!number) {
    return res.status(400).json({ message: 'Train number is required.' });
  }

  // Mock fallback if no API key
  if (!process.env.RAPIDAPI_KEY) {
    console.log('⚠️  No RAPIDAPI_KEY. Using mock train status data.');
    return res.json({ success: true, data: trainMock, isMock: true });
  }

  try {
    const response = await railwayAPI.get(`/api/v1/liveTrainStatus?trainNo=${number}&startDay=1`);
    return res.json({ success: true, data: response.data.data });
  } catch (error) {
    console.error('Train Status API Error:', error.message);
    return res.json({ success: true, data: trainMock, isMock: true, note: 'API failed, showing mock data.' });
  }
};

// -----------------------------------------------------------------------
// @route   GET /api/trains/search
// @desc    Search trains between two stations on a given date
// @access  Public
// -----------------------------------------------------------------------
const searchTrains = async (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ message: 'Please provide from, to, and date query params.' });
  }

  // Mock fallback
  if (!process.env.RAPIDAPI_KEY) {
    console.log('⚠️  No RAPIDAPI_KEY. Using mock train search data.');
    // Return a simplified mock train list
    const mockTrains = [
      { trainNumber: '12952', trainName: 'Mumbai Rajdhani', departure: '16:55', arrival: '08:35', duration: '15h 40m' },
      { trainNumber: '12904', trainName: 'Golden Temple Mail', departure: '07:20', arrival: '05:05', duration: '21h 45m' },
      { trainNumber: '12926', trainName: 'Paschim Express', departure: '16:35', arrival: '14:55', duration: '22h 20m' },
    ];
    return res.json({ success: true, data: mockTrains, isMock: true });
  }

  try {
    const response = await railwayAPI.get(
      `/api/v3/trainBetweenStations?fromStationCode=${from}&toStationCode=${to}&dateOfJourney=${date}`
    );
    return res.json({ success: true, data: response.data.data });
  } catch (error) {
    console.error('Train Search API Error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch train data. Try again later.' });
  }
};

module.exports = { getTrainStatus, searchTrains };
