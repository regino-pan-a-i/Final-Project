const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const passport = require('passport');
// const bcrypt = require('bcryptjs');

var Controller = {}


Controller.getHome = async (req, res, next) => {
    res.render('../views/user/landing', {
        title: "Home"
    })
}

Controller.getUsers = async (req, res, next) => {
    try {
        const result = await mongodb.getDb()
            .db('travel-buddy')
            .collection('users')
            .find();;
        const users = await result.toArray();
        // console.log(users)
        res.status(200).json(users);
    }
    catch (error){
        const err = new Error(error.message);
        err.status = "fail";
        err.statusCode = 500;
        res.json(err);
    }
}

Controller.getUserById = async (req, res, next) => {
    console.log(req.params.id)
    try{
        const result = await mongodb.getDb().db('travel-buddy')
            .collection('users')
            .findOne({_id: new ObjectId(req.params.id)});

        if (result === null){
            res.status(404).send('User not found');
        } else{
            res.status(200).json(result);
        }
    }catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.statusCode = 500;
        res.json(err);
    }

}

Controller.createUser = async (req, res, next) => {
    try{
        const usersCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('users')
        const result = await usersCollection.insertOne({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            createdAt: new Date(),
            updatedAt: new Date()
        })
        res.status(201).send(`This is the ID for the new user: ${result.insertedId}`);
    }
    catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }
}

Controller.deleteUser = async (req, res, next) => {
    try{
        const result = await mongodb.getDb().db('travel-buddy')
            .collection('users')
            .deleteOne({_id: new ObjectId(req.params.id)});
        if(result.deletedCount === 0){
            res.status(404).send('User not found');
        }
        else{
            console.log(result)
            return res.json({ message: 'User deleted' })
        }
    } 
    catch (error){
        console.log('Error deleting document:', error)
        const err = new Error(error.message);
        err.status = "fail"
        err.statusCode = 500
    }
}

Controller.addLikedTrip = async (req, res, next) => {

    try{
        // Get Trip ID from request body
        const {tripID} = req.body;

        // Create an instance of the collection
        const likedTripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('likedTrips')
        
        // Insert the trip into the collection
        const result = await likedTripsCollection.insertOne({
            userID: new ObjectId(req.params.id),
            tripID: tripID
        })
        res.status(201).send('Trip added to liked trips');
    }

    // Catch any errors
    catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }
}

Controller.getLikedTrips = async (req, res, next) => {
    try{
        // Create an instance of the likedTrips collection
        const likedTripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('likedTrips')

        // Create an instance of the trips collection
        const tripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('trips')

        // Find all liked trips by the user
        const result = await likedTripsCollection.find({userID: new ObjectId(req.params.id)});
        const likedTrips = await result.toArray();

        // Create an array to store the trips info
        const trips = [];

        // Loop through the liked trips and find the trip info
        for (const likedTrip of likedTrips) {
            const trip = await tripsCollection.findOne({ _id: new ObjectId(likedTrip.tripID)});
            trips.push(trip);
        }

        // Return the trips
        if (trips.length === 0){
            res.status(404).send('No liked trips found');
        }
        else{
            res.status(200).json(trips);
        }
    }

    // Catch any errors
    catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }
}

Controller.deleteLikedTrip = async (req, res, next) => {
    try{
        const likedTripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('likedTrips')

        // Find and delete the liked trip
        const result = await likedTripsCollection.deleteOne({ tripID: req.params.tripId, userID: new ObjectId(req.params.id)});
        
        // Check if the trip was deleted
        if(result.deletedCount === 0){
            res.status(404).send('Liked trip not found');
        }
        else{
            
            return res.json({ message: 'Trip deleted' })
        }
    }catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }
}

Controller.addPastTrip = async (req, res, next) => {

    try{
        // Get Trip ID from request body
        const {tripID} = req.body;

        // Create an instance of the collection
        const pastTripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('pastTrips')
        
        // Insert the trip into the collection
        const result = await pastTripsCollection.insertOne({
            userID: new ObjectId(req.params.id),
            tripID: tripID
        })
        res.status(201).send('Trip added to past trips');
    }

    // Catch any errors
    catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }
}

Controller.getPastTrips = async (req, res, next) => {
    try{
        // Create an instance of the pastTrips collection
        const pastTripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('pastTrips')

        // Create an instance of the trips collection
        const tripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('trips')

        // Find all past trips by the user
        const result = await pastTripsCollection.find({userID: new ObjectId(req.params.id)});
        const pastTrips = await result.toArray();

        // Create an array to store the trips info
        const trips = [];

        // Loop through the past trips and find the trip info
        for (const pastTrip of pastTrips) {
            const trip = await tripsCollection.findOne({ _id: new ObjectId(pastTrip.tripID)});
            trips.push(trip);
        }

        // Return the trips
        if (trips.length === 0){
            res.status(404).send('No past trips found');
        }
        else{
            res.status(200).json(trips);
        }
    }

    // Catch any errors
    catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }
}

Controller.deletePastTrip = async (req, res, next) => {
    try{
        const pastTripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('pastTrips')

        // Find and delete the past trip
        const result = await pastTripsCollection.deleteOne({ tripID: req.params.tripId, userID: new ObjectId(req.params.id)});
        
        // Check if the trip was deleted
        if(result.deletedCount === 0){
            res.status(404).send('Past trip not found');
        }
        else{
            
            return res.json({ message: 'Trip deleted' })
        }
    }catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }
}

Controller.addFutureTrip = async (req, res, next) => {

    try{
        // Get Trip ID from request body
        const {tripID} = req.body;

        // Create an instance of the collection
        const futureTripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('futureTrips')
        
        // Insert the trip into the collection
        const result = await futureTripsCollection.insertOne({
            userID: new ObjectId(req.params.id),
            tripID: tripID
        })
        res.status(201).send('Trip added to future trips');
    }

    // Catch any errors
    catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }
}

Controller.getFutureTrips = async (req, res, next) => {
    try{
        // Create an instance of the futureTrips collection
        const futureTripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('futureTrips')

        // Create an instance of the trips collection
        const tripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('trips')

        // Find all future trips by the user
        const result = await futureTripsCollection.find({userID: new ObjectId(req.params.id)});
        const futureTrips = await result.toArray();

        // Create an array to store the trips info
        const trips = [];

        // Loop through the future trips and find the trip info
        for (const futureTrip of futureTrips) {
            const trip = await tripsCollection.findOne({ _id: new ObjectId(futureTrip.tripID)});
            trips.push(trip);
        }

        // Return the trips
        if (trips.length === 0){
            res.status(404).send('No future trips found');
        }
        else{
            res.status(200).json(trips);
        }
    }

    // Catch any errors
    catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }
}

Controller.deleteFutureTrip = async (req, res, next) => {
    try{
        const futureTripsCollection = await mongodb.getDb()
            .db('travel-buddy')
            .collection('futureTrips')

        // Find and delete the future trip
        const result = await futureTripsCollection.deleteOne({ tripID: req.params.tripId, userID: new ObjectId(req.params.id)});
        
        // Check if the trip was deleted
        if(result.deletedCount === 0){
            res.status(404).send('Future trip not found');
        }
        else{
            
            return res.json({ message: 'Trip deleted' })
        }
    }catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }
}


module.exports = Controller;
