/**
 * @file TrainContext.jsx
 * @description Context API provider for shared application data (e.g., recent searches).
 * 
 * WHY THIS FILE EXISTS:
 * When users search for a Train or PNR on one page, we want that history visible on the Dashboard (Home) 
 * without forcing them to re-enter the data or without prop-drilling state from App.jsx down to the pages.
 * 
 * WHAT PROBLEM IT SOLVES:
 * - Avoids prop drilling across multiple pages (e.g., App -> AppRoutes -> MainLayout -> Page -> TargetComponent).
 * - Centralizes the logic for "Recent Searches" history.
 * 
 * LOGIC DECISIONS:
 * // Using Context here to avoid prop drilling across multiple pages. We isolate just the "Train/PNR history"
 * // state so it doesn't cause unnecessary re-renders in unrelated components.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * The app will lose the ability to sync recently searched queries between the Dashboard and the specific tools.
 */

import { createContext, useContext, useState } from 'react';

const TrainContext = createContext(undefined);

export function TrainProvider({ children }) {
  const [recentTrains, setRecentTrains] = useState([]);
  const [recentPNRs, setRecentPNRs] = useState([]);

  const addRecentTrain = (trainNo) => {
    setRecentTrains(prev => {
      const filtered = prev.filter(t => t !== trainNo);
      return [trainNo, ...filtered].slice(0, 5); // Keep last 5
    });
  };

  const addRecentPNR = (pnr) => {
    setRecentPNRs(prev => {
      const filtered = prev.filter(p => p !== pnr);
      return [pnr, ...filtered].slice(0, 5);
    });
  };

  const value = {
    recentTrains,
    recentPNRs,
    addRecentTrain,
    addRecentPNR
  };

  return (
    <TrainContext.Provider value={value}>
      {children}
    </TrainContext.Provider>
  );
}

// Custom Hook mapped here so consumers don't have to import useContext and TrainContext separately
export function useTrainContext() {
  const context = useContext(TrainContext);
  if (context === undefined) {
    throw new Error('useTrainContext must be used within a TrainProvider');
  }
  return context;
}
