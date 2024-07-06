const express = require('express');
const router = express.Router();

const tripController = require('../controllers/tripsController');
const acmController = require('../controllers/accommodationController');
const actController = require('../controllers/activityController');

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

/* Accomodation routes */

// Add a new accomodation
router.post('/:id/accommodations', acmController.addAccommodation);

// Get all accomodations in a trip
router.get('/:id/accommodations', acmController.getAllAccommodationsInTrip);

// Get an accomodation by ID
router.get('/accommodations/:id', acmController.getAccommodationById);

// Update an accomodation
router.put('/accommodations/:id', acmController.updateAccommodation);

// Delete an accomodation
router.delete('/accommodations/:id', acmController.deleteAccommodation);

/* Activity routes */

// Add a new activity
router.post('/:id/activities', actController.addActivity);

// Get all activities in a trip
router.get('/:id/activities', actController.getAllActivitiesInTrip);

// Get an activity by ID
router.get('/activities/:id', actController.getActivityById);

// Update an activity
router.put('/activities/:id', actController.updateActivity);

// Delete an activity
router.delete('/activities/:id', actController.deleteActivity);

module.exports = router;