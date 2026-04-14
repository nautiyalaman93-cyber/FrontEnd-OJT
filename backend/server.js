/**
 * @file server.js
 * @description Main entry point for the BharatPath backend.
 *
 * WHAT HAPPENS WHEN YOU RUN "npm run dev":
 * 1. Load environment variables from .env file.
 * 2. Connect to MongoDB.
 * 3. Setup Express with all middleware (CORS, JSON parsing, Passport).
 * 4. Register all routes under /api/*.
 * 5. Start listening on PORT 5000.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');

// Load environment variables FIRST before anything else
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Load Passport Google OAuth strategy
require('./config/passport');

// Import all routes
const authRoutes = require('./routes/authRoutes');
const pnrRoutes = require('./routes/pnrRoutes');
const trainRoutes = require('./routes/trainRoutes');
const seatRoutes = require('./routes/seatRoutes');
const sosRoutes = require('./routes/sosRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Initialize Express app
const app = express();

// -----------------------------------------------------------------------
// Middleware Setup
// -----------------------------------------------------------------------

// Allow requests from the React frontend (running on port 5173)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Initialize Passport (needed even for JWT strategy)
app.use(passport.initialize());

// -----------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------

app.use('/api/auth', authRoutes);       // Google Login, JWT, Profile
app.use('/api/pnr', pnrRoutes);         // PNR Status
app.use('/api/trains', trainRoutes);    // Live Status + Train Search
app.use('/api/seats', seatRoutes);      // Seat Exchange Board
app.use('/api/sos', sosRoutes);         // SOS Emergency Alerts
app.use('/api/alerts', alertRoutes);    // Proximity Alerts

// -----------------------------------------------------------------------
// Health Check Route — Open http://localhost:5000/api in your browser
// to verify the server is running correctly.
// -----------------------------------------------------------------------
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🚂 BharatPath API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      pnr: '/api/pnr/:pnr',
      trains: '/api/trains/status | /api/trains/search',
      seats: '/api/seats/all | /api/seats/request',
      sos: '/api/sos/trigger',
    },
  });
});

// -----------------------------------------------------------------------
// Handle unknown routes (404)
// -----------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found on this server.` });
});

// -----------------------------------------------------------------------
// Start the Server
// -----------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 BharatPath Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api\n`);
});
