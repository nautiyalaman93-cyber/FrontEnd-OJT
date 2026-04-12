/**
 * @file pnrService.js
 */
import { api } from './api';

export const pnrService = {
  getPNRStatus: async (pnr) => {
    return api.getPNRStatus(pnr);
  }
};
