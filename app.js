//app.js
//routes

var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
app.use('/users', UserController);

var AccountController = require('./user/AccountController');
app.use('/account', AccountController);

//View index.html at host website(main page)
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/users/signup', function(req, res) {
	res.sendFile(__dirname + '/public/signup.html');
});

//view account.html at account info section
// app.get('/account', function(req, res) {
// 	res.sendFile(__dirname + '/public/account.html');
// });

//BOOTSTRAP
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
//Use public folder
app.use(express.static(__dirname + '/public'));


module.exports = app;