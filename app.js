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
const expressLayouts = require("express-ejs-layouts")
const static = require('./routes/static');
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


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/********************
 * Routes
 ********************/
app.use(static)

app.use('/', require('./routes'));

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