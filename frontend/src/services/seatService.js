/**
 * @file seatService.js
 * @description Handles Seat Exchange logic.
 * 
 * WHY THIS FILE EXISTS:
 * Service wrapper for seat exchange functionality.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * Seat Exchange page will crash.
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const seatService = {
  getRequests: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/seats/all`);
      if (!response.ok) throw new Error('Failed to fetch seat requests');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching seat requests:', error);
      return [];
    }
  },
  submitRequest: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/api/seats/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit seat request');
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error('Error submitting seat request:', error);
      throw error;
    }
  }
};
