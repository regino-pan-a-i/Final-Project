const { response } = require('express');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

const addActivity = async (req, res) => {
    try {
        const tripId = new ObjectId(req.params.id);
        const { name, type, date, time } = req.body;

        // Check if any field is missing
        if (!name || !type || !date || !time == null) {
            res.status(400).json({ error: 'Please enter values for every field.' });
            return;
        }

        const activity = {
            tripId,
            name,
            type,
            date,
            time
        };

        const result = await mongodb.getDb().db('travel-buddy').collection('activities').insertOne(activity);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json({ error: 'An error occurred while adding the activity to the database.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the activity to the database.' });
    }
}

const getAllActivitiesInTrip = async (req, res) => {
    try {
        const Id = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('travel-buddy').collection('activities').find({ tripId: Id });
        const lists = await result.toArray();
        if (lists.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        } else {
            res.status(404).json({ error: 'Trip not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the activities in this trip.' });
    }
}

const getActivityById = async (req, res) => {
    try {
        const activityId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('travel-buddy').collection('activities').find({ _id: activityId });
        const lists = await result.toArray();
        if (lists.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        } else {
            res.status(404).json({ error: 'Activity not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the activity.' });
    }
}

const updateActivity = async (req, res) => {
    try {
        const activityId = new ObjectId(req.params.id);
        const activity = {
            name: req.body.name,
            type: req.body.type,
            date: req.body.date,
            time: req.body.time
        };
        const result = await mongodb.getDb().db('travel-buddy').collection('activities').replaceOne({ _id: activityId }, activity);
        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Activity not found or no changes made.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the activity.' });
    }
}

const deleteActivity = async (req, res) => {
    try {
        const activityId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db('travel-buddy').collection('activities').deleteOne({ _id: activityId });
        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Activity not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the activity.' });
    }
}

module.exports = { addActivity, getAllActivitiesInTrip, getActivityById, updateActivity, deleteActivity };