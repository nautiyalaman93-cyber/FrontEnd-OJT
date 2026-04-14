const express = require('express');
const { createAlert, getMyAlerts, cancelAlert } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createAlert);
router.get('/', protect, getMyAlerts);
router.delete('/:id', protect, cancelAlert);

module.exports = router;
