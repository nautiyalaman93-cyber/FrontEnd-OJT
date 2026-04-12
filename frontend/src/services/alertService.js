/**
 * @file alertService.js
 */

export const alertService = {
  getAlerts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 400);
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
        resolve(newAlert);
      }, 500);
    });
  }
};
