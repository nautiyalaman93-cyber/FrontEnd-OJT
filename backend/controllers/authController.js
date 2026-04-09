/**
 * @file authController.js
 * @description Handles everything related to user authentication.
 *
 * FUNCTIONS:
 * - googleCallback: Called after Google OAuth succeeds.
 *   Creates a JWT and returns it to the frontend.
 * - getMe: Returns the currently logged-in user's profile.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
// -----------------------------------------------------------------------
// Helper: Create a JWT token for a given user ID
// -----------------------------------------------------------------------
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token is valid for 7 days
  });
};
// -----------------------------------------------------------------------
// @route   GET /api/auth/google/callback
// @desc    Called by Google after login. Creates JWT and redirects.
// @access  Public
// -----------------------------------------------------------------------
const googleCallback = (req, res) => {
  // At this point, Passport has already processed the Google login
  // and attached the user to req.user
  const token = generateToken(req.user._id);

  // Redirect frontend with the token so it can store it in localStorage.
  // The frontend URL reads the token from the URL query param.
  res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
};

// -----------------------------------------------------------------------
// @route   GET /api/auth/me
// @desc    Returns the profile of the currently logged-in user.
// @access  Protected (requires JWT)
// -----------------------------------------------------------------------
const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware (protect)
    const user = await User.findById(req.user._id).select('-__v');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile.' });
  }
};

// -----------------------------------------------------------------------
// @route   GET /api/auth/logout
// @desc    Logout (JWT is stateless; we just tell the frontend to clear storage)
// @access  Public
// -----------------------------------------------------------------------
const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out. Please clear your token on the frontend.' });
};

module.exports = { googleCallback, getMe, logout };
