/**
 * @file api.js
 * @description Centralized API service layer
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const api = {
  // --- 1. Station Search ---
  searchStations: async (query) => {
    try {
      const res = await fetch(`${BASE_URL}/api/trains/stations/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.data || [];
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
