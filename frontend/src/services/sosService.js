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

export const sosService = {
  submitEmergency: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Emergency SOS Submitted:", data);
        resolve({ success: true, refId: `EMG-${Date.now()}` });
      }, 800);
    });
  }
};
