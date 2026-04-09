/**
 * @file sosController.js
 * @description Handles SOS Emergency Alert submissions.
 *
 * HOW IT WORKS:
 * 1. User taps the big red SOS button.
 * 2. The browser grabs GPS coordinates.
 * 3. Frontend sends the data to POST /api/sos/trigger.
 * 4. We save the alert in MongoDB with a unique reference ID.
 * 5. We return the reference ID so the user can use it for follow-up.
 *
 * (No real SMS is sent in this version — just data logging)
 *
 * ROUTES HANDLED:
 * - POST /api/sos/trigger   → Submit a new SOS
 * - GET  /api/sos/my-alerts → Get logged-in user's SOS history
 */

const SOS = require('../models/SOS');

// -----------------------------------------------------------------------
// @route   POST /api/sos/trigger
// @desc    Trigger an SOS emergency alert
// @access  Protected (must be logged in)
// -----------------------------------------------------------------------
const triggerSOS = async (req, res) => {
  const { trainNumber, latitude, longitude, emergencyType, description } = req.body;

  // All location + train info is required
  if (!trainNumber || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      message: 'trainNumber, latitude, and longitude are required to trigger SOS.',
    });
  }

  try {
    const alert = await SOS.create({
      user: req.user._id,
      trainNumber,
      latitude,
      longitude,
      emergencyType: emergencyType || 'Other',
      description: description || '',
    });

    // Log this to server console as well (helpful during demos)
    console.log(`🚨 SOS TRIGGERED — User: ${req.user.name} | Train: ${trainNumber} | Ref: ${alert.referenceId}`);

    res.status(201).json({
      success: true,
      message: 'SOS alert received. Help is being coordinated.',
      referenceId: alert.referenceId,
    });
  } catch (error) {
    console.error('SOS Trigger Error:', error.message);
    res.status(500).json({ message: 'Failed to process SOS alert.' });
  }
};

// -----------------------------------------------------------------------
// @route   GET /api/sos/my-alerts
// @desc    Get all SOS alerts submitted by the logged-in user
// @access  Protected
// -----------------------------------------------------------------------
const getMyAlerts = async (req, res) => {
  try {
    const alerts = await SOS.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    console.error('Get SOS Alerts Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch SOS history.' });
  }
};

module.exports = { triggerSOS, getMyAlerts };
