const express = require('express');
const router = express.Router()
const userController = require('../controllers/userController')
const util = require('../utilities/userValidation')
const utilHandler = require('../utilities/index')
// const auth = require('../utilities/auth');


/*****************************
 * Routes
 * **************************/


// Route to retrieve all users
router.get('/', utilHandler.handleErrors(userController.getUsers))

// // Landing page after login
// router.get('/home', utilHandler.handleErrors(userController.getHome))

// Route to retrieve a user by ID
router.get('/:id',utilHandler.handleErrors(userController.getUserById))

// Route to create a user
router.post('/', util.userRules(), util.validate, utilHandler.handleErrors(userController.createUser))

// Route to update a user
router.put('/:id', util.userRules(), util.validate,utilHandler.handleErrors(userController.updateUser))

// Route to delete a user
router.delete('/:id', utilHandler.handleErrors(userController.deleteUser))

// Route to get all liked trips by a user
router.get('/:id/likedTrips', utilHandler.handleErrors(userController.getLikedTrips))

// Route to add a liked trip to user
router.post('/:id/likedTrips', utilHandler.handleErrors(userController.addLikedTrip))

// Route to remove a liked trip from user
router.delete('/:id/likedTrips/:tripId', utilHandler.handleErrors(userController.deleteLikedTrip))

// Route to get all past trips by a user
router.get('/:id/pastTrips', utilHandler.handleErrors(userController.getPastTrips))

// Route to add a past trip to user
router.post('/:id/pastTrips', utilHandler.handleErrors(userController.addPastTrip))

// Route to remove a past trip from user
router.delete('/:id/pastTrips/:tripId', utilHandler.handleErrors(userController.removePastTrip))

// Route to get all future trips by a user
router.get('/:id/futureTrips', utilHandler.handleErrors(userController.getFutureTrips))

// Route to add a future trip to user
router.post('/:id/futureTrips', utilHandler.handleErrors(userController.addFutureTrip))

// Route to remove a future trip from user
router.delete('/:id/futureTrips/:tripId', utilHandler.handleErrors(userController.removeFutureTrip))


module.exports = router;
