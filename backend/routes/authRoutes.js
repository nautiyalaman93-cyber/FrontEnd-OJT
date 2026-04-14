/**
 * @file authRoutes.js
 * @description Routes for Google OAuth and user profile.
 *
 * ENDPOINTS:
 * GET /api/auth/google          → Starts the Google login flow
 * GET /api/auth/google/callback → Google calls this after the user approves
 * GET /api/auth/me              → Returns logged-in user's profile
 * GET /api/auth/logout          → Logout (frontend clears token)
 */

const express = require('express');
const passport = require('passport');
const { googleCallback, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Step 1: Redirect user to Google's login page
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: Google calls this after the user approves. Passport handles verification.
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth Error:', err);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?login_error=server_error`);
    }
    if (!user) {
      console.error('Google OAuth: No user returned', info);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?login_error=auth_failed`);
    }
    req.user = user;
    googleCallback(req, res);
  })(req, res, next);
});

// Get current logged-in user's info (requires JWT)
router.get('/me', protect, getMe);

// Logout (stateless JWT → just tells frontend to forget its token)
router.get('/logout', logout);

module.exports = router;
