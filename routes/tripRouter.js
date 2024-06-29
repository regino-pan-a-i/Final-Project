const express = require('express');
const router = express.Router();

const tripController = require('../controllers/tripsController');

// Get all trips
router.get('/', tripController.getAllTrips);

module.exports = router;