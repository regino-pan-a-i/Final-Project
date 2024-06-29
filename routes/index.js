const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to Travel Buddy API' });
});
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.use('/trips', require('./tripRouter'));
router.use('/users', require('./userRouter'));

module.exports = router;