const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const passport = require('passport');
// const bcrypt = require('bcryptjs');

var Controller = {}


Controller.getUsers = async (req, res, next) => {
    try {
        const result = await mongodb.getDb()
            .db('travel-buddy')
            .collection('users')
            .find();;
        const users = await result.toArray();
        console.log(users)
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
    // res.send('Here is where you will delete a user')
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
module.exports = Controller;
