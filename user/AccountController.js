// AccountController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

var User = require('./User');

//Deposit 1 dollar
router.put('/depositloonie/:id', function(req, res) {
	User.findByIdAndUpdate(req.params.id, {$inc: {account:1}}, {new: true},
	function(err, user) {
		if(err) return res.status(500).send("There was a problem depositing the loonie.");
			res.status(200).send(user);
	});
});

//Deposit 2 dollars
router.put('/deposittoonie/:id', function(req, res) {
	User.findByIdAndUpdate(req.params.id, {$inc: {account:2}}, {new: true},
	function(err, user) {
		if(err) return res.status(500).send("There was a problem depositing the toonie.");
			res.status(200).send(user);
	});
});

module.exports = router;