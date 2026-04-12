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

// Helper to get token (assuming standard localStorage implementation)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

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
  
  getMyRequests: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/seats/my-requests`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch user seat requests');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching my seat requests:', error);
      return [];
    }
  },

  submitRequest: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/api/seats/request`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit seat request');
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error('Error submitting seat request:', error);
      throw error;
    }
  },

  // --- Messages ---
  sendMessage: async (requestId, text) => {
    try {
      const response = await fetch(`${BASE_URL}/api/seats/${requestId}/message`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  getMessages: async (requestId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/seats/${requestId}/messages`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }
};
