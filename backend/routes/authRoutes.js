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
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account',
  callbackURL: 'https://bhartpath-api.onrender.com/api/auth/google/callback'
}));

// Step 2: Google calls this after the user approves. Passport handles verification.
router.get('/google/callback', (req, res, next) => {
  try {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      if (err) {
        console.error('Google OAuth Error:', err);
        return res.redirect(`${frontendUrl}/?login_error=${encodeURIComponent(err.message || 'server_error')}`);
      }
      if (!user) {
        console.error('Google OAuth: No user returned', info);
        const reason = info?.message || info || 'no_user_returned';
        return res.redirect(`${frontendUrl}/?login_error=${encodeURIComponent(String(reason))}`);
      }
      // Success - generate token and redirect
      req.user = user;
      googleCallback(req, res);
    })(req, res, next);
  } catch (e) {
    console.error('Callback crash:', e);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/?login_error=${encodeURIComponent(e.message || 'crash')}`);
  }
});

// Get current logged-in user's info (requires JWT)
router.get('/me', protect, getMe);

// Logout (stateless JWT → just tells frontend to forget its token)
router.get('/logout', logout);

module.exports = router;
