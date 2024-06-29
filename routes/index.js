const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const { model } = require('mongoose');
const userRouter = require('./userRouter.js');


router.get('/', (req, res) => {
    res.send('Welcome to the Travel API');
});
router.use('/users', userRouter);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.get('/api-docs', swaggerUi.setup(swaggerDocument));


module.exports = router;