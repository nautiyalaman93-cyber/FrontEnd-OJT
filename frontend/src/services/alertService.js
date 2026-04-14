/**
 * @file alertService.js
 * @description Interfaces with the backend Proximity Alerts API.
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const alertService = {
  getAlerts: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/alerts`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.data || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  createAlert: async (trainNumber, targetStation, distanceKm) => {
    try {
      const res = await fetch(`${BASE_URL}/api/alerts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ trainNumber, targetStation, distanceKm }),
      });
      if (!res.ok) {
        throw new Error('Failed to create alert');
      }
      const data = await res.json();
      return data.data; // Return the Mongoose document
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  cancelAlert: async (alertId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/alerts/${alertId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error('Failed to cancel alert');
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
