/**
 * @file apiService.js
 * @description Central Axios instance for calling RapidAPI.
 *
 * WHY THIS EXISTS:
 * Instead of writing headers in every file, we configure Axios once here.
 * Every controller can import `railwayAPI` and just call the endpoint
 * without worrying about adding the API key every single time.
 */

const axios = require('axios');

/**
 * Creates an Axios instance pre-configured with RapidAPI headers.
 * @param {string} host - The API host (e.g., 'irctc1.p.rapidapi.com')
 * @param {string} key - The API key
 * @returns {import('axios').AxiosInstance}
 */
const createRailwayAPI = (host, key) => {
  return axios.create({
    baseURL: `https://${host}`,
    headers: {
      'X-RapidAPI-Host': host,
      'X-RapidAPI-Key': key,
    },
  });
};

/**
 * Attempts an API call using a list of API keys in sequence.
 * Falls back to the next key if the current one hits a rate limit (or fails).
 * @param {string} endpoint - The API path to fetch (e.g., '/api/v3/getPNRStatus?pnrNumber=123')
 * @returns {Promise<any>} - The response data from the successful API call
 */
const fetchWithKeyRotation = async (endpoint) => {
  const host = process.env.RAILWAY_API_HOST;
  const keysStr = process.env.RAILWAY_API_KEYS;

  if (!host || !keysStr) {
    throw new Error('RAILWAY_API_HOST or RAILWAY_API_KEYS missing in environment.');
  }

  // Split keys by comma and trim any extra spaces
  const keys = keysStr.split(',').map((k) => k.trim()).filter(Boolean);

  let lastError;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    try {
      const railwayAPI = createRailwayAPI(host, key);
      const response = await railwayAPI.get(endpoint);
      
      // If we get here, the call was successful
      return response.data;
    } catch (error) {
      console.error(`⚠️ API Call failed with key ${i + 1}/${keys.length} (${key.substring(0, 5)}...):`, error.message);
      lastError = error;
      // Continue to the next key in the loop
    }
  }

  // If the loop finishes, all keys failed
  console.error('❌ All API keys failed.');
  throw lastError; // Throw the last error to be caught by the controller
};

module.exports = { createRailwayAPI, fetchWithKeyRotation };
