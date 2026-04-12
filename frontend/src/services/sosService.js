/**
 * @file sosService.js
 * @description Handles emergency SOS reporting.
 * 
 * WHY THIS FILE EXISTS:
 * Encapsulates the critical logic for sending SOS signals to backend endpoints.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * SOS Page won't be able to submit emergency alerts.
 */

// ⚠️ Replace with real API call using .env when backend is ready

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const sosService = {
  submitEmergency: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/api/sos/trigger`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit SOS alert');
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error('Error submitting SOS:', error);
      throw error;
    }
  }
};
