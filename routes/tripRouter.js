const express = require('express');
const router = express.Router();

const tripController = require('../controllers/tripsController');

// Add a new trip
router.post('/', tripController.addTrip);

// Get all trips
router.get('/', tripController.getAllTrips);

// Get a trip by ID
router.get('/:id', tripController.getTripById);

// Update a trip
router.put('/:id', tripController.updateTrip);

// Delete a trip
router.delete('/:id', tripController.deleteTrip);

module.exports = router;