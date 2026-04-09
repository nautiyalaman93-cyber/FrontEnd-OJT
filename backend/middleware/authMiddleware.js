/**
 * @file authMiddleware.js
 * @description Protects routes that require the user to be logged in.
 *
 * HOW IT WORKS:
 * 1. When a user logs in, we give them a JWT token.
 * 2. For PROTECTED routes (like creating a seat swap), they must send
 *    this token in the request header like:
 *    Authorization: Bearer <token>
 * 3. This middleware reads that token, verifies it's valid, and
 *    attaches the user's info to the request.
 * 4. If the token is missing or invalid → we return a 401 error.
 *
 * USAGE:
 * Add `protect` as a middleware in any route you want to protect:
 *   router.post('/request', protect, seatController.createRequest);
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token is in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (remove "Bearer " from the front)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user's data (without password) to the request
      req.user = await User.findById(decoded.id).select('-__v');

      next(); // Move on to the actual route handler
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protect };
