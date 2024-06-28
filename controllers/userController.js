const User = require('../database/models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const connect = require('../database/connect');
const mongoose = require('mongoose');

const authController = {};

authController.register = async (req, res, next) => {
    try {
        await connect();
        console.log(req.body);
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        const err = new Error(error.message);
        err.status = "fail";
        err.statusCode = 500;
        next(err);
    }finally {
        mongoose.disconnect();
    }
};

authController.login = async (req, res, next) => {
    try{
        await connect();
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.log(err)
                return next(err);
            }
            if (!user) {
                return res.redirect('/auth/failure');
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.log("ERROR", err)
                    return next(err);
                }
                return res.redirect('/auth/success');
            });
        })(req, res, next);
    } catch (error) {
        const err = new Error(error.message);
        err.status = "fail";
        err.statusCode = 500;
        next(err);
    }
    // }finally {
    //     mongoose.disconnect();
    // }
}

authController.logout = async (req, res, next) => {
    req.logout((err) => {
        console.log('logging out')
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.redirect('/');
        });
    });
}
module.exports = authController;
