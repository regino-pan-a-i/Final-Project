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
const app = express();


/***********************************
 * Middleware
 * ********************************/
app
  .use(express.json())
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
    console.log(`Connected to DB and listening on ${port}`);
  }
});