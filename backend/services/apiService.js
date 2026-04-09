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

// Create a custom Axios instance with RapidAPI headers
const railwayAPI = axios.create({
  baseURL: 'https://irctc1.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'irctc1.p.rapidapi.com',
  },
});

module.exports = railwayAPI;
