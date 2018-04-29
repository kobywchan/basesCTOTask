// server.js

// set up ======================================================================
require('dotenv').config({silent: false});
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');

// configuration ===============================================================
// mongoose.connect("localhost")
mongoose.connect(configDB.url);
autoIncrement.initialize(mongoose.connection);

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Listening on port ' + port);
