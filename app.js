/***********************************
 * This app.js file is the primary file of the
 * application.
**********************************/

/***********************************
 * Require Statements
 * ********************************/
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./database/connect');
const router = require('./routes/router');
const { mongo } = require('mongoose');
const app = express();
/***********************************
 * Middleware
 * ********************************/

// connect();
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));

/***********************************
 * Server Listener
 * ********************************/
const port = process.env.PORT || 8080;

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`Server is running on port ${port}`);
    }
});