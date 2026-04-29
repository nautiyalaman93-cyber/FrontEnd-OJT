/**
 * @file trainController.js
 * @description Handles Live Train Status and Train Search.
 *
 * HOW IT WORKS:
 * - Checks an in-memory cache first (5 minute TTL) to save API quota.
 * - If cache miss → tries real API with key rotation.
 * - If API fails → returns mock JSON.
 *
 * ROUTES HANDLED:
 * - GET /api/trains/status?number=12952&date=20241225  → Live Status
 * - GET /api/trains/search?from=NDLS&to=MMCT&date=20241225 → Search Trains
 */

const { fetchWithKeyRotation } = require('../services/apiService');
const trainMock = require('../mock/trainMock.json');

// -----------------------------------------------------------------------
// In-Memory Cache (5 minute TTL)
// Key format: 'status_{trainNo}_{date}' or 'search_{from}_{to}_{date}'
// -----------------------------------------------------------------------
const trainCache = new Map();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours (Save API quota)
const STATION_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours for stations

/**
 * Retrieves a value from the cache if it exists and has not expired.
 * @param {string} key
 */
const getCached = (key) => {
  const entry = trainCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    trainCache.delete(key); // Remove stale entry
    return null;
  }
  return entry.data;
};

/**
 * Stores a value in the cache with a custom or default expiry.
 * @param {string} key
 * @param {*} data
 * @param {number} ttl
 */
const setCache = (key, data, ttl = CACHE_TTL_MS) => {
  trainCache.set(key, { data, expiresAt: Date.now() + ttl });
};

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

  // Check cache first
  const cacheKey = `status_${number}_${date || 'today'}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`✅ Cache HIT for ${cacheKey}`);
    return res.json({ success: true, data: cached, fromCache: true });
  }

  try {
    console.log(`🔄 Cache MISS for ${cacheKey} — calling API`);
    const data = await fetchWithKeyRotation(`/api/v1/liveTrainStatus?trainNo=${number}&startDay=1`);
    setCache(cacheKey, data.data);
    return res.json({ success: true, data: data.data });
  } catch (error) {
    console.error('Train Status API Error:', error.message);
    // Return specific mock if available, else first mock
    const specificMock = trainMock[number] || Object.values(trainMock)[0];
    return res.json({ success: true, data: specificMock, isMock: true, note: 'All API keys failed, showing mock data.' });
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

  // Check cache first
  const cacheKey = `search_${from}_${to}_${date}`;
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`✅ Cache HIT for ${cacheKey}`);
    return res.json({ success: true, data: cached, fromCache: true });
  }

  try {
    console.log(`🔄 Cache MISS for ${cacheKey} — calling API`);
    const data = await fetchWithKeyRotation(`/api/v3/trainBetweenStations?fromStationCode=${from}&toStationCode=${to}&dateOfJourney=${date}`);
    if (data && data.data && data.data.length > 0) {
      setCache(cacheKey, data.data);
      return res.json({ success: true, data: data.data });
    }
    
    // If API returns success but 0 results, trigger the same mock fallback
    throw new Error('No trains found in live API');
  } catch (error) {
    if (error.message.includes('429')) {
      console.log('📡 Live API Limit Reached — Switching to local BharatPath database.');
    } else {
      console.log('⚠️ Live API Unavailable — Using smart mock fallback.');
    }

    // Build contextual mock trains using the actual from/to from the search
    // Look up full station names from the mock database
    const stationMock = require('../mock/stationMock.json');
    const findStationName = (code) => {
      const match = stationMock.find(s => s.toUpperCase().endsWith(`| ${code.toUpperCase()}`));
      if (match) return match.split(' | ')[0].split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
      return code; // fallback to code if not found
    };
    const fromName = findStationName(from);
    const toName = findStationName(to);

    const mockTrains = [
      { train_number: '12952', train_name: `${fromName} - ${toName} Rajdhani Express`, from_std: '16:55', to_std: '08:35', duration: '15h 40m', running_days: 'Daily' },
      { train_number: '12260', train_name: `${fromName} - ${toName} Duronto Express`, from_std: '19:40', to_std: '12:45', duration: '17h 05m', running_days: 'Mon,Tue,Fri,Sat' },
      { train_number: '12002', train_name: `${fromName} - ${toName} Shatabdi Express`, from_std: '06:00', to_std: '14:40', duration: '8h 40m', running_days: 'Daily' },
      { train_number: '12424', train_name: `${fromName} - ${toName} Garib Rath Express`, from_std: '16:20', to_std: '07:00', duration: '14h 40m', running_days: 'Mon,Wed,Fri' },
      { train_number: '12622', train_name: `${fromName} - ${toName} Superfast Express`, from_std: '21:05', to_std: '06:15', duration: '9h 10m', running_days: 'Daily' },
    ];
    setCache(cacheKey, mockTrains);
    return res.json({ success: true, data: mockTrains, isMock: true, note: 'Showing local BharatPath data (Live API limits reached).' });
  }
};

// -----------------------------------------------------------------------
// @route   GET /api/trains/stations/search
// @desc    Search stations by partial name or code
// @access  Public
// -----------------------------------------------------------------------
const searchStations = async (req, res) => {
  const { query } = req.query;
  const stationMock = require('../mock/stationMock.json');

  // If no query provided, return top 15 popular stations as default suggestions
  if (!query || query.trim() === '') {
    const topStations = stationMock.slice(0, 15);
    return res.json({ success: true, data: topStations, isMock: true });
  }

  const cacheKey = `station_${query}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached, fromCache: true });
  }

  try {
    const data = await fetchWithKeyRotation(`/api/v1/searchStation?query=${query}`);
    const results = (data.data || []).slice(0, 20);
    if (results.length > 0) {
      setCache(cacheKey, results, STATION_CACHE_TTL_MS);
      return res.json({ success: true, data: results });
    }
    // 0 results from API, fall through to mock
    throw new Error('No stations found in live API');
  } catch (error) {
    if (error.message.includes('429')) {
      console.log('📡 Station API Limit Reached — Using local station database.');
    }
    const matched = stationMock.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 20);
    setCache(cacheKey, matched, STATION_CACHE_TTL_MS);
    return res.json({ success: true, data: matched, isMock: true });
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

  // Extract codes: "NEW DELHI | NDLS" -> "NDLS"
  const fromCode = from.split(' | ')[1] || from;
  const toCode = to.split(' | ')[1] || to;
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

  try {
    // API First: Try searching for direct trains first
    console.log(`🔄 API First: Searching direct trains for connecting view (${fromCode} -> ${toCode})`);
    const directData = await fetchWithKeyRotation(`/api/v3/trainBetweenStations?fromStationCode=${fromCode}&toStationCode=${toCode}&dateOfJourney=${today}`);
    
    if (directData && directData.data && directData.data.length > 0) {
      // If we found direct trains, we can present them as the primary option
      const formattedDirect = directData.data.slice(0, 2).map((t, idx) => ({
        label: `Direct Option ${idx + 1}: ${t.trainName}`,
        reliability: 'Highest',
        totalDuration: t.duration || 'Variable',
        legs: [
          { train: `${t.trainNumber} ${t.trainName}`, from: fromCode, to: toCode, time: `${t.departure} – ${t.arrival}` },
        ],
        isDirect: true
      }));
      return res.json({ success: true, data: formattedDirect });
    }
  } catch (error) {
    console.warn('Connecting Journeys API Error (Direct Search):', error.message);
  }

  // Fallback / Smart Mock: If no direct trains or API fails, provide connecting routes
  const mockRoutes = [
    {
      label: 'Option 1: via Junction',
      reliability: 'High Reliability',
      totalDuration: '21h 50m',
      legs: [
        { train: '12952 Rajdhani', from: fromCode, to: 'Vadodara', time: '16:25 – 03:52' },
      ],
      layover: { station: 'Vadodara Jn', duration: '2h 15m' },
      legs2: [
        { train: '16345 Netravati', from: 'Vadodara', to: toCode, time: '06:07 – 14:15' },
      ],
    },
    {
      label: 'Option 2: via Hub',
      reliability: 'Standard',
      totalDuration: '28h 20m',
      legs: [
        { train: '12434 Rajdhani', from: fromCode, to: 'Nagpur', time: '15:35 – 05:10' },
      ],
      layover: { station: 'Nagpur Jn', duration: '4h 45m' },
      legs2: [
        { train: '12622 Tamil Nadu Exp', from: 'Nagpur', to: toCode, time: '13:20 – 16:40' },
      ],
    },
  ];

  return res.json({ success: true, data: mockRoutes, isMock: true, note: 'Showing connecting routes — no direct trains found.' });
};

module.exports = { getTrainStatus, searchTrains, searchStations, getConnectingJourneys };
