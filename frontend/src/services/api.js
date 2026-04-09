/**
 * @file api.js
 * @description Centralized API service layer with separate keys & hosts per feature.
 *
 * HOW IT WORKS:
 * - Each feature (Station Search, Train Search, Live Status, PNR) has its own
 *   API key and host, read from environment variables in the .env file.
 * - If a key is missing, ONLY that feature falls back to mock data.
 *   Other features are unaffected.
 *
 * HOW TO SWAP TO YOUR OWN BACKEND LATER:
 * - Set VITE_BACKEND_URL in .env to your backend's URL.
 * - Update the endpoints below to point to your backend routes.
 * - Remove the VITE_*_API_KEY vars (your backend will hold them securely).
 */

import { pnrDetails, trains, allStations } from '../mock/mockData';

// -----------------------------------------------------------------------
// Feature-specific configuration (populated from .env)
// -----------------------------------------------------------------------
const CONFIG = {
  stationSearch: {
    host: import.meta.env.VITE_STATION_SEARCH_API_HOST || '',
    key: import.meta.env.VITE_STATION_SEARCH_API_KEY || '',
  },
  trainSearch: {
    host: import.meta.env.VITE_TRAIN_SEARCH_API_HOST || '',
    key: import.meta.env.VITE_TRAIN_SEARCH_API_KEY || '',
  },
  liveStatus: {
    host: import.meta.env.VITE_LIVE_STATUS_API_HOST || '',
    key: import.meta.env.VITE_LIVE_STATUS_API_KEY || '',
  },
  pnr: {
    host: import.meta.env.VITE_PNR_API_HOST || '',
    key: import.meta.env.VITE_PNR_API_KEY || '',
  },
};

// -----------------------------------------------------------------------
// Generic fetch wrapper — uses the feature-specific host and key
// -----------------------------------------------------------------------
const fetchFor = async (feature, endpoint) => {
  const { host, key } = CONFIG[feature];

  if (!key || !host) {
    console.warn(`[api.js] ${feature}: API key/host missing. Using mock fallback.`);
    return null;
  }

  try {
    const response = await fetch(`https://${host}${endpoint}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': host,
      },
    });

    if (!response.ok) {
      throw new Error(`${feature} API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`[api.js] ${feature} fetch failed:`, err);
    throw err;
  }
};

// -----------------------------------------------------------------------
// Public API Methods
// -----------------------------------------------------------------------
export const api = {

  // --- 1. Station Search ---
  searchStations: async (query) => {
    const data = await fetchFor('stationSearch', `/searchStation?query=${encodeURIComponent(query)}`);
    if (!data) return mockSearchStations(query);
    return data.data || [];
  },

  // --- 2. Train Search (Between Stations) ---
  searchTrains: async (from, to, date) => {
    const data = await fetchFor('trainSearch', `/trainsBetweenStations?from=${from}&to=${to}&date=${date}`);
    if (!data) return mockSearchTrains();
    return data.data || [];
  },

  // --- 3. Live Train Status ---
  getTrainStatus: async (trainNumber, date) => {
    const data = await fetchFor('liveStatus', `/liveTrainStatus?trainNo=${trainNumber}&date=${date}`);
    if (!data) return mockTrainStatus(trainNumber);
    return data.data || null;
  },

  // --- 4. PNR Status ---
  getPNRStatus: async (pnrNumber) => {
    const data = await fetchFor('pnr', `/pnrStatus?pnr=${pnrNumber}`);
    if (!data) return mockPNRStatus(pnrNumber);
    return data.data || null;
  },
};

// -----------------------------------------------------------------------
// Mock Fallback Functions (used when API key is not set)
// -----------------------------------------------------------------------

const mockSearchStations = (query) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(allStations.filter((st) => st.toLowerCase().includes(query.toLowerCase())));
    }, 300)
  );

const mockSearchTrains = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        {
          id: '12952', name: 'MMCT TEJAS RAJ', departure: '16:55', arrival: '08:35',
          duration: '15h 40m', runningDays: 'M T W T F S S', classes: ['1A', '2A', '3A'], type: 'Rajdhani',
        },
        {
          id: '12904', name: 'GOLDEN TEMPLE M', departure: '07:20', arrival: '05:05',
          duration: '21h 45m', runningDays: 'M T W T F S S', classes: ['1A', '2A', '3A', 'SL'], type: 'Superfast',
        },
        {
          id: '12926', name: 'PASCHIM EXPRESS', departure: '16:35', arrival: '14:55',
          duration: '22h 20m', runningDays: '- T W - F S S', classes: ['2A', '3A', 'SL'], type: 'Superfast',
        },
      ]);
    }, 800)
  );

const mockTrainStatus = (trainNumber) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(trains.find((t) => t.trainNumber === trainNumber) || null);
    }, 500)
  );

const mockPNRStatus = (pnrNumber) =>
  new Promise((resolve) =>
    setTimeout(() => {
      // Returns mock data structure for UI to render
      resolve(pnrDetails[pnrNumber] || true);
    }, 600)
  );
