/**
 * @file pnrService.js
 * @description Handles API communication for fetching PNR Status.
 * 
 * WHY THIS FILE EXISTS:
 * Dedicated service for Passenger Name Record (PNR) queries.
 * 
 * WHAT PROBLEM IT SOLVES:
 * - Decouples PNR logic from the UI.
 * - Centralizes error handling.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * The PNR Status page will be unable to verify ticket confirmations.
 */

// ⚠️ Replace with real API call using .env when backend is ready
import { pnrDetails } from '../mock/mockData';

export const pnrService = {
  getPNRStatus: async (pnr) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = pnrDetails[pnr];
        if (data) {
          resolve(data);
        } else {
          reject('PNR not found or invalid.');
        }
      }, 600);
    });
  }
};
