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

module.exports = { createRailwayAPI };
