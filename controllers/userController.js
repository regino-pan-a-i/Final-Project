const connect = require('../database/connect');
const User = require('../database/models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var Controller = {}


Controller.getUsers = async (req, res, next) => {
    try {
        await connect.connectToDatabase();
        const users = await User.find();
        res.status(200).send(users);
    }
    catch (error){
        const err = new Error(error.message);
        err.status = "fail";
        err.statusCode = 500;
        res.json(err);
    }
    finally {
        mongoose.disconnect();
    }
}
Controller.getUserById = async (req, res, next) => {
    console.log(req.params.id)
    try{
        await connect.connectToDatabase();

        const user = await User.findById(req.params.id).exec();
        res.json(user)
    }catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.statusCode = 500;
        res.json(err);
    }
    finally {
        mongoose.disconnect();
    }

}

Controller.createUser = async (req, res, next) => {
    console.log(req.body)
    try{
        await connect.connectToDatabase();
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10)
        })
        const savedUser = await user.save();    
        res.status(201).send(`This is the ID for the new user: ${savedUser._id}`);
    }
    catch (error){
        console.log(error);
        const err = new Error(error.message);
        err.status = "fail";
        err.message = error.message;
        err.statusCode = 500;
        res.json(err);
    }finally {
        mongoose.disconnect();
    }
}




module.exports = Controller;