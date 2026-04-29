/**
 * @file api.js
 * @description Centralized API service layer
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const api = {
  // Client-side cache for stations (in-memory)
  stationCache: {},

  searchStations: async (query) => {
    const q = (query || '').toLowerCase().trim();
    
    // Check client-side cache first (only for non-empty queries)
    if (q && api.stationCache[q]) {
      return api.stationCache[q];
    }

    // For empty queries, check a special 'default' cache key
    if (!q && api.stationCache['__default__']) {
      return api.stationCache['__default__'];
    }

    try {
      const url = q
        ? `${BASE_URL}/api/trains/stations/search?query=${encodeURIComponent(q)}`
        : `${BASE_URL}/api/trains/stations/search`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      const results = data.data || [];
      
      // Store in cache
      api.stationCache[q || '__default__'] = results;
      return results;
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  // --- 2. Train Search (Between Stations) ---
  searchTrains: async (from, to, date) => {
    try {
      const res = await fetch(`${BASE_URL}/api/trains/search?from=${from}&to=${to}&date=${date}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  // --- 3. Live Train Status ---
  getTrainStatus: async (trainNumber, date) => {
    try {
      const res = await fetch(`${BASE_URL}/api/trains/status?number=${trainNumber}&date=${date}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // --- 4. PNR Status ---
  getPNRStatus: async (pnrNumber) => {
    try {
      const res = await fetch(`${BASE_URL}/api/pnr/${pnrNumber}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // --- 5. Connecting Journeys ---
  getConnectingJourneys: async (from, to) => {
    try {
      const res = await fetch(`${BASE_URL}/api/trains/connecting?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },
};
