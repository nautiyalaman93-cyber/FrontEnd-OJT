/**
 * @file env.js
 * @description Centralized environment configuration loader.
 * 
 * WHY THIS FILE EXISTS:
 * We need a single source of truth for all environment variables defined in `.env`.
 * This prevents typos and ensures missing variables throw explicit errors or defaults.
 * 
 * WHAT HAPPENS IF KEYS ARE EXPOSED:
 * Exposing sensitive API keys (especially write-access keys or paid mapping APIs)
 * can lead to unauthorized usage quotas and security vulnerabilities. Always use `VITE_`
 * ONLY for keys that are safe to expose to the client browser.
 * 
 * WHAT WILL BREAK IF REMOVED:
 * API calls relying on `ENV.API_BASE_URL` or mapping widgets relying on map keys will fail.
 */

export const ENV = {
  // Uses Vite's import.meta.env pattern
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  MAP_API_KEY: import.meta.env.VITE_MAP_API_KEY || '',
  TRAIN_API_KEY: import.meta.env.VITE_TRAIN_API_KEY || "b2595adbd5emsh9cmsh9c4c072e2d08a79p1aa6ebjsnb5273f10bf6d"
};
