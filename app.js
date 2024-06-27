/***********************************
 * This app.js file is the primary file of the
 * application.
**********************************/

/***********************************
 * Require Statements
 * ********************************/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/router');
const app = express();

/***********************************
 * Middleware
 * ********************************/

// connect();
app.use(cors());

app.use(bodyParser.json())

app.use('/', router);

/***********************************
 * Server Listener
 * ********************************/
const port = process.env.Port || 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})