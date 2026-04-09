/**
 * @file useLocation.js
 * @description Custom hook to track the user's geolocation for Proximity Alerts.
 * 
 * WHY THIS FILE EXISTS:
 * Exposes the browser's native Geolocation API in a React-friendly way.
 * 
 * WHAT PROBLEM IT SOLVES:
 * - Handles the permissions and recurring polling (watchPosition) automatically.
 * - Used by the `ProximityAlerts` page to figure out if the user is close to their station.
 * 
 * LOGIC DECISIONS:
 * // We use `navigator.geolocation.watchPosition` instead of a one-time `getCurrentPosition` 
 * // so the app constantly knows if the train is moving.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * 1. Proximity alarms won't be able to calculate distance.
 * 2. Any feature relying on "current location" will stop working.
 */

import { useState, useEffect } from 'react';

export function useLocation(enableTracking = false) {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!enableTracking) {
      setIsTracking(false);
      return;
    }

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsTracking(true);

    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Cleanup watcher on unmount or when tracking is disabled
    return () => {
      navigator.geolocation.clearWatch(watcherId);
      setIsTracking(false);
    };
  }, [enableTracking]);

  return { location, error, isTracking };
}
