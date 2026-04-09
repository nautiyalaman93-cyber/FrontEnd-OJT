/**
 * @file usePNR.js
 * @description Custom hook for handling PNR queries and state.
 * 
 * WHY THIS FILE EXISTS:
 * Manages the asynchronous flow of requesting Passenger Name Record (PNR) details.
 * 
 * WHAT PROBLEM IT SOLVES:
 * - Abstracts loading and error states for PNR lookups.
 * - Allows UI components to simple call `checkPNR(number)` and react to `data` or `error` changes.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * The PNR Status form logic will have to handle its own try-catch and state variables.
 */

import { useState } from 'react';
import { pnrService } from '../services/pnrService';
import { useTrainContext } from '../context/TrainContext';

export function usePNR() {
  const [pnrData, setPnrData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addRecentPNR } = useTrainContext();

  const checkPNR = async (pnrNumber) => {
    if (!pnrNumber || pnrNumber.length !== 10) {
      setError("Please enter a valid 10-digit PNR.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await pnrService.getPNRStatus(pnrNumber);
      
      // ⚠️ BACKEND REQUIRED: Uses placeholder data until API returns valid JSON
      setPnrData(response);
      addRecentPNR(pnrNumber);

    } catch (err) {
      setError(err.message || 'Unable to fetch PNR details.');
    } finally {
      setIsLoading(false);
    }
  };

  return { checkPNR, pnrData, isLoading, error };
}
