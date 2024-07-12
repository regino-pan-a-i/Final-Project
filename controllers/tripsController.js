const { response } = require('express');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

const addTrip = async (req, res) => {
    try {
        const { destination, startDate, endDate } = req.body;

        // Check if any field is missing
        if (!destination || !startDate || !endDate == null) {
            res.status(400).json({ error: 'Please enter values for every field.' });
            return;
        }

        const trip = {
            destination,
            startDate,
            endDate,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await mongodb.getDb().db('travel-buddy').collection('trips').insertOne(trip);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json({ error: 'An error occurred while adding the trip to the database.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the trip to the database.' });
    }
}

const getAllTrips = async (req, res) => {
    try {
        const result = await mongodb.getDb().db('travel-buddy').collection('trips').find();
        const trips = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }    
};

const getTripById = async (req, res) => {
    try {
        const tripId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('travel-buddy').collection('trips').find({ _id: tripId });
        const lists = await result.toArray();
        if (lists.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        } else {
            res.status(404).json({ error: 'Trip not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the trip.' });
    }
}

const updateTrip = async (req, res) => {
    try {
        const tripId = new ObjectId(req.params.id);
        const trip = {
            destination: req.body.destination,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        };
        const result = await mongodb.getDb().db('travel-buddy').collection('trips').replaceOne({ _id: tripId }, trip);
        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Trip not found or no changes made.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the trip.' });
    }
}

const deleteTrip = async (req, res) => {
    try {
        const tripId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('travel-buddy').collection('trips').deleteOne({ _id: tripId });
        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Trip not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the trip.' });
    }
}

module.exports = { getAllTrips, addTrip, getTripById, updateTrip, deleteTrip };