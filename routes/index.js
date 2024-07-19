const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
// const { buildHome } = require('../controllers/baseController');

router.get('/', (req, res) => {
    res.send('Welcome to the Travel Planner;')
});
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.use('/trips', require('./tripRouter'));
router.use('/users', require('./userRouter'));

module.exports = router;