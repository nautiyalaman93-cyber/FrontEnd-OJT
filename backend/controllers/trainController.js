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

const { createRailwayAPI } = require('../services/apiService');
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

  const apiKey = process.env.LIVE_STATUS_API_KEY;
  const apiHost = process.env.LIVE_STATUS_API_HOST;

  // Mock fallback if no API key
  if (!apiKey || !apiHost) {
    console.log('⚠️  No LIVE_STATUS_API_KEY or LIVE_STATUS_API_HOST. Using mock train status data.');
    return res.json({ success: true, data: trainMock, isMock: true });
  }

  try {
    const railwayAPI = createRailwayAPI(apiHost, apiKey);
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

  const apiKey = process.env.TRAIN_SEARCH_API_KEY;
  const apiHost = process.env.TRAIN_SEARCH_API_HOST;

  // Mock fallback
  if (!apiKey || !apiHost) {
    console.log('⚠️  No TRAIN_SEARCH_API_KEY or TRAIN_SEARCH_API_HOST. Using mock train search data.');
    // Return a simplified mock train list
    const mockTrains = [
      { trainNumber: '12952', trainName: 'Mumbai Rajdhani', departure: '16:55', arrival: '08:35', duration: '15h 40m' },
      { trainNumber: '12904', trainName: 'Golden Temple Mail', departure: '07:20', arrival: '05:05', duration: '21h 45m' },
      { trainNumber: '12926', trainName: 'Paschim Express', departure: '16:35', arrival: '14:55', duration: '22h 20m' },
    ];
    return res.json({ success: true, data: mockTrains, isMock: true });
  }

  try {
    const railwayAPI = createRailwayAPI(apiHost, apiKey);
    const response = await railwayAPI.get(
      `/api/v3/trainBetweenStations?fromStationCode=${from}&toStationCode=${to}&dateOfJourney=${date}`
    );
    return res.json({ success: true, data: response.data.data });
  } catch (error) {
    console.error('Train Search API Error:', error.message);
    // Fallback to mock data when real API fails (same pattern as getTrainStatus)
    const mockTrains = [
      { trainNumber: '12952', trainName: 'Mumbai Rajdhani Express', departure: '16:55', arrival: '08:35', duration: '15h 40m', availableClasses: ['1A', '2A', '3A'], runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
      { trainNumber: '12904', trainName: 'Golden Temple Mail', departure: '07:20', arrival: '05:05', duration: '21h 45m', availableClasses: ['SL', '3A', '2A'], runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
      { trainNumber: '12926', trainName: 'Paschim Express', departure: '16:35', arrival: '14:55', duration: '22h 20m', availableClasses: ['SL', '3A', '2A', '1A'], runningDays: ['Mon','Wed','Fri','Sun'] },
      { trainNumber: '19019', trainName: 'Dehradun Express', departure: '21:30', arrival: '18:45', duration: '21h 15m', availableClasses: ['SL', '3A'], runningDays: ['Tue','Thu','Sat'] },
      { trainNumber: '12138', trainName: 'Punjab Mail', departure: '19:45', arrival: '17:00', duration: '21h 15m', availableClasses: ['SL', '3A', '2A'], runningDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    ];
    return res.json({ success: true, data: mockTrains, isMock: true, note: 'Showing sample data — live API temporarily unavailable.' });
  }
};

// -----------------------------------------------------------------------
// @route   GET /api/trains/stations/search
// @desc    Search stations by partial name or code
// @access  Public
// -----------------------------------------------------------------------
const searchStations = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Please provide a query.' });
  }

  const apiKey = process.env.STATION_SEARCH_API_KEY;
  const apiHost = process.env.STATION_SEARCH_API_HOST;

  // Mock fallback
  if (!apiKey || !apiHost) {
    console.log('⚠️  No STATION_SEARCH_API_KEY or STATION_SEARCH_API_HOST. Using mock station search data.');
    const stationMock = require('../mock/stationMock.json');
    const matched = stationMock.filter(s => s.toLowerCase().includes(query.toLowerCase()));
    return res.json({ success: true, data: matched, isMock: true });
  }

  try {
    const railwayAPI = createRailwayAPI(apiHost, apiKey);
    const response = await railwayAPI.get(`/api/v1/searchStation?query=${query}`);
    return res.json({ success: true, data: response.data.data });
  } catch (error) {
    console.error('Station Search API Error:', error.message);
    const stationMock = require('../mock/stationMock.json');
    const matched = stationMock.filter(s => s.toLowerCase().includes(query.toLowerCase()));
    return res.json({ success: true, data: matched, isMock: true, note: 'API failed, showing mock data.' });
  }
};

// -----------------------------------------------------------------------
// @route   GET /api/trains/connecting
// @desc    Search for connecting journeys (mock fallback implemented)
// @access  Public
// -----------------------------------------------------------------------
const getConnectingJourneys = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ message: 'Please provide from and to query params.' });
  }

  // Currently returns mock data for UI functionality
  // In a real scenario, this would chain API calls to locate routes with layovers.
  const mockRoutes = [
    {
      label: 'Option 1: via Vadodara',
      reliability: 'High Reliability',
      totalDuration: '21h 50m',
      legs: [
        { train: '12952 Rajdhani', from: from.split(' | ')[0] || 'Origin', to: 'Vadodara', time: '16:25 – 03:52' },
      ],
      layover: { station: 'Vadodara Jn', duration: '2h 15m' },
      legs2: [
        { train: '16345 Netravati', from: 'Vadodara', to: to.split(' | ')[0] || 'Dest', time: '06:07 – 14:15' },
      ],
    },
    {
      label: 'Option 2: via Mumbai',
      reliability: 'Standard',
      totalDuration: '28h 20m',
      legs: [
        { train: '12952 Rajdhani', from: from.split(' | ')[0] || 'Origin', to: 'Mumbai Central', time: '16:25 – 08:35' },
      ],
      layover: { station: 'Mumbai Central', duration: '4h 45m' },
      legs2: [
        { train: '16312 Kochuveli Exp', from: 'Mumbai Central', to: to.split(' | ')[0] || 'Dest', time: '13:20 – 16:40' },
      ],
    },
  ];

  return res.json({ success: true, data: mockRoutes, isMock: true });
};

module.exports = { getTrainStatus, searchTrains, searchStations, getConnectingJourneys };
