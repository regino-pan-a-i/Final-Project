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
const static = require('./routes/static');
const app = express();
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const dotenv = require('dotenv');
dotenv.config();




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


// /* ***********************
//  * View Engine and Templates
//  *************************/
// app.set("view engine", "ejs")
// app.use(expressLayouts)
// app.set("layout", "./layouts/layout") // not at views root


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
})

/***********************************
 * User Authentication
 * ********************************/

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUERBASEURL,
 };

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

//log user in Mongodb
app.get('/profile', requiresAuth(), async (req, res) => {
  const email = await mongodb.getDb().db('travel-buddy')
    .collection('users')
    .findOne({email: req.oidc.user.email});
  if (!email){
    const userRecords = await mongodb.getDb()
      .db('travel-buddy')
      .collection('users');
    const result = await userRecords.insertOne( {
      name: req.oidc.user.name,
      email: req.oidc.user.email,
      password: req.oidc.user.password});
      res.send("User created");
  }else{
    res.send(JSON.stringify(req.oidc.user));
  }
});





