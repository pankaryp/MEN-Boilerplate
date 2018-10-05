// Require dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var request = require('request');
const mongoose = require('mongoose');
var flash = require('connect-flash');
const session = require('express-session');
const nodemailer = require('nodemailer');
const passport = require('passport');
const expressValidator  = require('express-validator');
const helmet = require('helmet');
const compression = require('compression')

// Init App
const app = express();

// Dotenv Config
require('dotenv').config()

// Require routes from routes/api folder
const homeRouter = require('./routes/api/home');

//Compress all routes
app.use(compression()); 

// Helmet Middleware
app.use(helmet({ 
    // DNS lookup
    dnsPrefetchControl: { 
        allow: true 
    },
    // Page load on a frame:off
    frameguard: {
        action: 'deny'
    }
}));

// Configure errors for development and production
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Bring in db models
Model = require('./models/model');

// Connect to mongoose
mongoose.connect('mongodb://');
var db = mongoose.connection;

// Check connection
db.once('open', function() {
    console.log('Connected to Mongo db');
});

// Check for DB errors
db.on('error', function() {
    console.log(err);
});

// Serve static files from client (css files, images etc)
app.use(express.static(path.join(__dirname, 'client')));

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// BodyParser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Connect Flash Middleware
app.configure(function() {
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({ cookie: { maxAge: 60000 }}));
    app.use(flash());
});

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root  = namespace.shift()
        , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

//Listen to port 3000 for connection
app.listen(3000 , function() {
    console.log('Server running on port 3000..');
});
