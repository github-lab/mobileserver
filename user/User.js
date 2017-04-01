// User.js
var mongoose = require('mongoose'); 
//Uses bcryptjs to hash and salt passwords to increased security
var bcrypt = require('bcryptjs');
//UserSchema of a user, which specifies which fields a creates user would have
var UserSchema = mongoose.Schema({  
  email: {
  		type: String,
  		lowercase: true
  	},
  password: String,
  name: String,
  account: { type: Number, min: 0, max: 90000000000 },
  //Face recognition
  image: String,
  subject_id: String,
  gallery_name: String
});
//Exports user fields to every controller that requires User.js
var User = module.exports = mongoose.model('User', UserSchema);

/**
 * Create a new user, and also salt and hash the password provided
 */
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
};

/**
 * Helper function to login a user, used by passportjs to find a user when given his/her email
 */
module.exports.getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, function(err, email) {
		callback(err, email);
	});
};

/**
 * Helper function to login a user, used by passportjs to find a user when given his/her ID
 */
module.exports.getUserById = function(id, callback){
	User.findById(id, function(err, id) {
		callback(err, id);
	});
};

/**
 * Helper function to compare hashed passwords, used by passportjs to authenticate every login
 */
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
};

