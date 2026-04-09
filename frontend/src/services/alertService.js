/**
 * @file alertService.js
 * @description Handles proximity and other alerts.
 * 
 * WHY THIS FILE EXISTS:
 * Manages user subscriptions to alerts.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * Proximity Alert page logic will fail.
 */

// ⚠️ Replace with real API call using .env when backend is ready
import { proximityAlerts } from '../mock/mockData';

export const alertService = {
  getAlerts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(proximityAlerts), 400);
    });
  },
  createAlert: async (trainNumber, distanceKm) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAlert = {
          id: `alert_${Date.now()}`,
          trainNumber,
          station: 'Destination Station',
          distanceKm,
          isActive: true
        };
        proximityAlerts.push(newAlert);
        resolve(newAlert);
      }, 500);
    });
  }
};
