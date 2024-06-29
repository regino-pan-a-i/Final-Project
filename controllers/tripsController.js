const { response } = require('express');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

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

module.exports = { getAllTrips };