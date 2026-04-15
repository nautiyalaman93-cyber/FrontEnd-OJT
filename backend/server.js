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
const session = require('express-session');

// Load environment variables FIRST before anything else
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');

// Start backend
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`\n🚀 BharatPath Backend running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/api\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

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

// Trust Render's proxy to handle HTTPS correctly
app.set('trust proxy', 1);

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

// Session support (required for Passport OAuth flow)
app.use(session({
  secret: process.env.JWT_SECRET || 'bharatpath_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000, // 10 minutes for OAuth flow
  }
}));

// Initialize Passport (needed even for JWT strategy)
app.use(passport.initialize());
app.use(passport.session());

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
    database: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host || 'Disconnected',
    }
  });
});

// -----------------------------------------------------------------------
// Handle unknown routes (404)
// -----------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found on this server.` });
});


