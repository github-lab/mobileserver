// AccountController.js
var express = require('express');
var router = express.Router();
//BodyParser to scan body of fields.
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

var User = require('./User');

/**
 * Deposit a loonie to the logged in user's account. Uses callback function to store data obtained from url,
 * The PUT request finds the user, specified by the user's email, and increments the balance in the user's account.
 */
router.put('/depositloonie', function(req, res) {
	if(req.user) {
	User.findByIdAndUpdate(req.user._id, {$inc: {account:1}}, {new: true}, function(err, results) {
		if(err) return res.status(500).send("There was a problem depositing the loonie.");
	 		res.status(200).send(results);
	});}
	else {
		return res.status(500).send("You are not logged in!");
	}	
});

/**
 * Deposit a toonie to the logged in user's account. Uses callback function to store data obtained from url,
 * The PUT request finds the user, specified by the user's email, and increments the balance in the user's account.
 */
router.put('/deposittoonie', function(req, res) {
	if(req.user) {
	User.findByIdAndUpdate(req.user._id, {$inc: {account:2}}, {new: true}, function(err, results) {
		if(err) return res.status(500).send("There was a problem depositing the toonie.");
	 		res.status(200).send(results);
	});}
	else {
		return res.status(500).send("You are not logged in!");
	}	
});

/**
 * Deposit a quarter to the logged in user's account. Uses callback function to store data obtained from url,
 * The PUT request finds the user, specified by the user's email, and increments the balance in the user's account.
 */
router.put('/depositquarter', function(req, res) {
	if(req.user) {
	User.findByIdAndUpdate(req.user._id, {$inc: {account:0.25}}, {new: true}, function(err, results) {
		if(err) return res.status(500).send("There was a problem depositing the quarter.");
	 		res.status(200).send(results);
	});}
	else {
		return res.status(500).send("You are not logged in!");
	}	
});

/**
 * Deposit a nickel to the logged in user's account. Uses callback function to store data obtained from url,
 * The PUT request finds the user, specified by the user's email, and increments the balance in the user's account.
 */
router.put('/depositnickel', function(req, res) {
	if(req.user) {
	User.findByIdAndUpdate(req.user._id, {$inc: {account: 0.05}}, {new: true}, function(err, results) {
		if(err) return res.status(500).send("There was a problem depositing the quarter.");
	 		res.status(200).send(results);
	});}
	else {
		return res.status(500).send("You are not logged in!");
	}	
});

/**
 * Remove a loonie from the logged in user's account. Uses callback function to store data obtained from url,
 * The PUT request finds the user, specified by the user's email, and decrements the balance in the user's account.
 */
router.put('/removeloonie', function(req, res) {
	if(req.user) {
	User.findByIdAndUpdate(req.user._id, {$inc: {account:-1}}, {new: true}, function(err, results) {
		if(err) return res.status(500).send("There was a problem depositing the loonie.");
	 		res.status(200).send(results);
	});}
	else {
		return res.status(500).send("You are not logged in!");
	}	
});

/**
 * Remove a toonie from the logged in user's account. Uses callback function to store data obtained from url,
 * The PUT request finds the user, specified by the user's email, and decrements the balance in the user's account.
 */
router.put('/removetoonie', function(req, res) {
	if(req.user) {
	User.findByIdAndUpdate(req.user._id, {$inc: {account:-2}}, {new: true}, function(err, results) {
		if(err) return res.status(500).send("There was a problem depositing the toonie.");
	 		res.status(200).send(results);
	});}
	else {
		return res.status(500).send("You are not logged in!");
	}	
});

/**
 * Remove a quarter from the logged in user's account. Uses callback function to store data obtained from url,
 * The PUT request finds the user, specified by the user's email, and decrements the balance in the user's account.
 */
router.put('/removequarter', function(req, res) {
	if(req.user) {
	User.findByIdAndUpdate(req.user._id, {$inc: {account:-0.25}}, {new: true}, function(err, results) {
		if(err) return res.status(500).send("There was a problem depositing the quarter.");
	 		res.status(200).send(results);
	});}
	else {
		return res.status(500).send("You are not logged in!");
	}	
});

/**
 * Remove a nickel from the logged in user's account. Uses callback function to store data obtained from url,
 * The PUT request finds the user, specified by the user's email, and decrements the balance in the user's account.
 */
router.put('/removenickel', function(req, res) {
	if(req.user) {
	User.findByIdAndUpdate(req.user._id, {$inc: {account:-0.05}}, {new: true}, function(err, results) {
		if(err) return res.status(500).send("There was a problem depositing the quarter.");
	 		res.status(200).send(results);
	});}
	else {
		return res.status(500).send("You are not logged in!");
	}	
});
/**
 * Gets the account balance and name of the user from the logged in user's profile. The results are passed to the callback function,
 * which it then uses to send a response in the form of a JSON object.
 */
router.get('/balance', function(req, res) {
	if (req.user) {
		res.status(200).json({
      		account: money_round(req.user.account),
      		name: req.user.name
    	});
	}
	else {
		return res.status(500).send("You are not logged in!");
	}	
});

function money_round(num) {
    return Math.ceil(num * 100) / 100;
}


module.exports = router;