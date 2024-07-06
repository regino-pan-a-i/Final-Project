const { response } = require('express');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

const addAccommodation = async (req, res) => {
    try {
        const tripId = new ObjectId(req.params.id);
        const { name, address, checkInDate, checkOutDate } = req.body;

        // Check if any field is missing
        if (!name || !address || !checkInDate || !checkOutDate == null) {
            res.status(400).json({ error: 'Please enter values for every field.' });
            return;
        }

        const accomodation = {
            tripId,
            name,
            address,
            checkInDate,
            checkOutDate
        };

        const result = await mongodb.getDb().db('travel-buddy').collection('accomodations').insertOne(accomodation);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json({ error: 'An error occurred while adding the accomodation to the database.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the accomodation to the database.' });
    }
}

const getAllAccommodationsInTrip = async (req, res) => {
    try {
        const Id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('travel-buddy').collection('accomodations').find({ tripId: Id });
        const lists = await result.toArray();
        if (lists.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        } else {
            res.status(404).json({ error: 'Trip not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the accomodations in this trip.' });
    }
}

const getAccommodationById = async (req, res) => {
    try {
        const accommodationId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('travel-buddy').collection('accomodations').find({ _id: accommodationId });
        const lists = await result.toArray();
        if (lists.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        } else {
            res.status(404).json({ error: 'Accommodation not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the accommodation.' });
    }
}

const updateAccommodation = async (req, res) => {
    try {
        const accommodationId = new ObjectId(req.params.id);
        const accommodation = {
            name: req.body.name,
            address: req.body.address,
            checkInDate: req.body.checkInDate,
            checkOutDate: req.body.checkOutDate
        };
        const result = await mongodb.getDb().db('travel-buddy').collection('accomodations').replaceOne({ _id: accommodationId }, accommodation);
        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Accommodation not found or no changes made.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the accommodation.' });
    }
}

const deleteAccommodation = async (req, res) => {
    try {
        const accommodationId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('travel-buddy').collection('accomodations').deleteOne({ _id: accommodationId });
        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Accommodation not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the accommodation.' });
    }
}

module.exports = { addAccommodation, getAllAccommodationsInTrip, getAccommodationById, updateAccommodation, deleteAccommodation };
