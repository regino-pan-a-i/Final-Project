const express = require('express');
const router = express.Router();
const util = require('../utilites/tripValidation')

// Import Error Handler
const utilHandler = require('../utilities/index')

// Import controllers

const tripController = require('../controllers/tripsController');
const acmController = require('../controllers/accommodationController');
const actController = require('../controllers/activityController');

// Add a new trip
router.post('/', util.saveTrip, tripController.addTrip);


// Get all trips
router.get('/', utilHandler.handleErrors(tripController.getAllTrips));

// Get a trip by ID
router.get('/:id', utilHandler.handleErrors(tripController.getTripById));

// Update a trip
router.put('/:id', util.saveTrip, tripController.updateTrip);


// Delete a trip
router.delete('/:id', utilHandler.handleErrors(tripController.deleteTrip));

/* Accomodation routes */

// Add a new accomodation
router.post('/:id/accommodations',util.saveAcm, acmController.addAccommodation);


// Get all accomodations in a trip
router.get('/:id/accommodations', utilHandler.handleErrors(acmController.getAllAccommodationsInTrip));

// Get an accomodation by ID
router.get('/accommodations/:id', utilHandler.handleErrors(acmController.getAccommodationById));

// Update an accomodation
router.put('/accommodations/:id', util.saveAcm, acmController.updateAccommodation);


// Delete an accomodation
router.delete('/accommodations/:id', utilHandler.handleErrors(acmController.deleteAccommodation));

/* Activity routes */

// Add a new activity
router.post('/:id/activities', util.saveAct, actController.addActivity);


// Get all activities in a trip
router.get('/:id/activities', utilHandler.handleErrors(actController.getAllActivitiesInTrip));

// Get an activity by ID
router.get('/activities/:id', utilHandler.handleErrors(actController.getActivityById));

// Update an activity
router.put('/activities/:id', util.saveAct, actController.updateActivity);


// Delete an activity
router.delete('/activities/:id', utilHandler.handleErrors(actController.deleteActivity));

module.exports = router;