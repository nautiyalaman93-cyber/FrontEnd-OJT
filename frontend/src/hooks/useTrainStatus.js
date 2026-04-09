/**
 * @file useTrainStatus.js
 * @description Custom hook for fetching and managing live train data.
 * 
 * WHY THIS FILE EXISTS:
 * Encapsulates the React state (loading, error, data) associated with making a train Service API call.
 * 
 * WHAT PROBLEM IT SOLVES:
 * - Prevents components from becoming bloated with `useState` and `useEffect` blocks just for fetching data.
 * - Makes the live tracing logic reusable anywhere in the app (e.g., in a background widget or the main tracker page).
 * 
 * LOGIC DECISIONS:
 * // We accept `trainNumber` as an argument. The hook exposes `fetchStatus` to be triggered on-demand 
 * // (like when a user clicks 'Search') rather than fetching immediately on mount.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * The UI forms will have to manually implement loading spinners and error handling for train API requests.
 */

import { useState } from 'react';
import { trainService } from '../services/trainService';
import { useTrainContext } from '../context/TrainContext';

export function useTrainStatus() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addRecentTrain } = useTrainContext();

  const fetchStatus = async (trainNumber) => {
    if (!trainNumber) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await trainService.getLiveStatus(trainNumber);
      
      // ⚠️ BACKEND REQUIRED: When backend is ready, this will set the real API response
      // For now, it might be null or mock data from Step 11
      setData(response);
      addRecentTrain(trainNumber); // Save to shared context

    } catch (err) {
      setError(err.message || 'Failed to fetch train status');
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchStatus, data, isLoading, error };
}
