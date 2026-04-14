/**
 * @file alertController.js
 * @description Manages Proximity Alerts for users.
 */

const Alert = require('../models/Alert');

// @route   POST /api/alerts
// @desc    Create a new proximity alert
// @access  Private
const createAlert = async (req, res) => {
  try {
    const { trainNumber, targetStation, distanceKm } = req.body;

    if (!trainNumber || !targetStation || !distanceKm) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Since it's private, req.user is set by the authMiddleware
    const newAlert = await Alert.create({
      user: req.user._id,
      trainNumber,
      targetStation,
      distanceKm,
    });

    return res.status(201).json({ success: true, data: newAlert });
  } catch (error) {
    console.error('Create Alert Error:', error.message);
    return res.status(500).json({ message: 'Failed to set alarm.' });
  }
};

// @route   GET /api/alerts
// @desc    Get all active alerts for the current user
// @access  Private
const getMyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.user._id, isActive: true }).sort({ createdAt: -1 });
    return res.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Get Alerts Error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch alerts.' });
  }
};

// @route   DELETE /api/alerts/:id
// @desc    Cancel an alert
// @access  Private
const cancelAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found.' });
    }

    // Ensure only the owner can delete
    if (alert.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    await Alert.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Alarm cancelled successfully.' });
  } catch (error) {
    console.error('Cancel Alert Error:', error.message);
    return res.status(500).json({ message: 'Failed to cancel alarm.' });
  }
};

module.exports = { createAlert, getMyAlerts, cancelAlert };
