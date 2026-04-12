/**
 * @file trainService.js
 */
import { api } from './api';

export const trainService = {
  getLiveStatus: async (trainNumber) => {
    return api.getTrainStatus(trainNumber, new Date().toISOString().split('T')[0].replace(/-/g, ''));
  }
};
