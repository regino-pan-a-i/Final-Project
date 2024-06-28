/********************
 * Require Statements
 ***************/

const express = require('express');
const router = express.Router()
const tripRouter = require('./tripRouter.js')
const userRouter = require('./userRouter.js')


/********************
 * Middleware
 ***************/





/****************************************
* Routes
* **************************************/


router.use('/user', userRouter)



module.exports = router;