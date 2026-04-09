/**
 * @file trainService.js
 * @description Handles API communication for live train tracking.
 * 
 * WHY THIS FILE EXISTS:
 * Abstracts away the complexity of making HTTP requests for train data.
 * 
 * WHAT PROBLEM IT SOLVES:
 * - Keeps UI components clean.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * The frontend will have no way to request train data.
 */

// ⚠️ Replace with real API call using .env when backend is ready
import { trains } from '../mock/mockData';

export const trainService = {
  getLiveStatus: async (trainNumber) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const train = trains.find(t => t.trainNumber === trainNumber);
        if (train) {
          resolve(train);
        } else {
          reject('Train not found or inactive.');
        }
      }, 500);
    });
  }
};
