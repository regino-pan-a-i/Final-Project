const express = require('express');
const router = express.Router()
const userController = require('../controllers/userController')
const util = require('../utilities/userValidation')
const utilHandler = require('../utilities/index')
// const auth = require('../utilities/auth');


/*****************************
 * Routes
 * **************************/


router.get('/', utilHandler.handleErrors(userController.getUsers))
router.get('/:id',utilHandler.handleErrors(userController.getUserById))
router.post('/', util.userRules(), util.validate, utilHandler.handleErrors(userController.createUser))
router.put('/:id', util.userRules(), util.validate,utilHandler.handleErrors(userController.updateUser))
router.delete('/:id', utilHandler.handleErrors(userController.deleteUser))


module.exports = router;