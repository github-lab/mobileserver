// UserController.js
var express = require('express');
var router = express.Router();
//Passport for User login and authentication sessions
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
//Uses functions from User.js, and uses the specified key values to create a JSON object user profile
var User = require('./User');


/**
 * Utilizes Passportjs documentation to implement a 'localstrategy', which stores results in a database. Some
 * customizations include login validation in the form of not accepting and unknown email/password
 */
passport.use(new localStrategy( {
    usernameField: 'email',
    passwordField: 'password'
},
  function(email, password, done) {
   User.getUserByEmail(email, function(err, email){
    if(err) throw err;
    if(!email){
        console.log("unknown email");
        return done(null, false, {message: 'Unknown Email'});
    }

    User.comparePassword(password, email.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
            return done(null, email);
        } else {
            //console.log("invalid password");
            return done(null, false, {message: 'Invalid password'});
        }
    });
   });
  }));

/**
 * Passportjs included functions, where serialize/deserialize user allows login sessions to persist in the form of cookies for each browser
 */
passport.serializeUser(function(user, done) {
    console.log("serializing");
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    console.log("deserializing");
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

/**
 * Creates a new user when a name, email, and password are sent as a POST request. Using the createUser function in
 * User.js, the password of the newly created user is thereby hash and salted, to increase security.
 */
router.post('/signup', function (req, res) {
     var newUser = new User({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            account: 0,
            image: '',
            subject_id: req.body.name.replace(/ /g,""),
            gallery_name: req.body.name.replace(/ /g,"")
        });
     User.find({email: newUser.email}, function(err, docs) {
        if (docs.length) {
            console.log("email exists already");
            res.redirect('./signup');
        }
        else {            
        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log("New User", user);
        }); 
       res.redirect('./login'); 
        }
     });
});

/**
 * Helper variable function to check if a user is logged in or not.
 */
var isAuthenticated = function(req,res,next){
   if(req.user)
      return next();
   else
      return res.status(401).json({
        error: 'User not authenticated'
      });
};

/**
 * A get request to check the login status of a user. Used to dynamically update the website on a user's login status.
 */
router.get('/checkauth', isAuthenticated, function(req, res){
  //res.send({ success: true, message: 'You are authenticated' });
     res.status(200).json({
      name: req.user.name
    });
});

/**
 * Login function, where the user sends a POST request with a email and password, and the passportjs implementation
 * uses the 'localstrategy' specified above to compare the passwords and redirects to the specified place depending on whether
 * or not the login was successful.
 */
router.post('/login', passport.authenticate('local', {successRedirect:'/account', failureRedirect:'/users/login', failureFlash: true}),
  function(name, req, res) {
    console.log("success");
    res.redirect('/');
  });

/**
 * Logs the user out of the login session if the user is logged in. If not, nothing happens as the user is already logged out.
 */
router.get('/logout', function(req, res, next) {
  if (req.user) {
    req.logout();
    console.log("you are logged out");
  }
  else {
    console.log("you are already logged out");
    next();
  }
  res.redirect('./login');
});

/**
 * Returns all the user's in the database. Used in the mobile app to display data, as well as for testing purposes
 */
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

/**
 * Updates a single user in the database, identified by ID
 */
router.put('/:id', function(req, res) {
	User.findByIdAndUpdate(req.params.id, req.body, {new: true}, 
		function(err, user) {
			if (err) return res.status(500).send("There was a problem updating the user.");
				res.status(200).send(user);
		});
});

/**
 * Deletes a single user in the database, identified by ID
 */
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User "+ user.name +" was deleted.");
    });
});

/**
 * Used for testing purposes, delete ALL users in the database.
 */
router.delete('/', function(req, res) {
	User.remove({}, function(err, users) {
		 if (err) return res.status(500).send("There was a problem deleting all users.");
       	 res.status(200).send("All users have been deleted.");
	});
});

/**
 * Bypass user login authentication to force a login. Used for the mobile app.
 */
router.get('/bypass', function(req, res) {
  var user;                
  User.findOne( {'email': 'demo@gmail.com' }, function(err, result) {
      user = result;
      req.login(user, function(err) {
        if (err) {console.log("Error force login: ", err);}
        res.redirect('../account');
      });
  });
});

module.exports = router;



