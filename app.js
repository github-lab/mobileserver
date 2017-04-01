//app.js

//Include libraries and frameworks to be used
var express = require('express');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');

//Include mongodb database
var db = require('./db');

//Start the express app
var app = express();
//Include all controllers
var UserController = require('./user/UserController');
var face_recognize = require('./user/face_recognize');
var AccountController = require('./user/AccountController');


//Use bodyParser to obtain req.user.body information
app.use(bodyParser.urlencoded({ extended: true }));
//Establish a login session using passportjs
app.use(expressSession({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));
// Set passport middleware (persistent login session)
 app.use(passport.initialize());
 app.use(passport.session());
//Use flash messages to debug
 app.use(flash());
 //link controllers with respective location in website url
 app.use('/users', UserController);
 app.use('/account', AccountController);
 app.use('/users', face_recognize);

/**
 * Link html pages with specified website location
 */
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/users/signup', function(req, res) {
	res.sendFile(__dirname + '/public/signup_login.html');
});

app.get('/users/login', function(req, res) {
	res.sendFile(__dirname + '/public/signup_login.html');
});

app.get('/users/face', ensureSecure, function(req, res) {
	res.sendFile(__dirname + '/public/facelogin.html');
});

app.get('/account', ensureAuthenticated, function(req, res) {
	res.sendFile(__dirname +'/public/account.html');
});

app.get('/contact', function(req, res) {
	res.sendFile(__dirname + '/public/contacts.html');
});

//Helper function to prevent unAuthenticated user from accessing account page
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/users/login');
}

function ensureSecure(req, res, next) {
	if (req.secure) { return next(); }
	res.redirect('https://' + req.hostname + req.url);
}


//Include Bootstrap Framework
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
//Allows use of public folder for different url locations
app.use('/users', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/public'));
app.use('/account', express.static(__dirname + '/public'));




module.exports = app;