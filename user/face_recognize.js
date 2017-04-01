//face_recognize.js
var express = require('express');
var router = express.Router();
//Uses Imgur API to assist with facial recognition by uploading photos to a public domain
var imgur = require('imgur-node-api');
imgur.setClientID('de92fd1759de863');
//Uses Kairos API for facial recognition, using verify and enroll
var Kairos = require('kairos-api');
var client = new Kairos('866388e6', '225cbb2255c9dd02aae2933d408bcff9');
//Requires User.js to locate a specified user
var User = require('./User');
//Uses request library to send nested HTTPS requests
var request = require('request');
//Global variable to hold imgurlink for facial recognition
var imgurlink;

/**
 * Enrolls the face of a user, through taking a picture from the webcam and uploading it to imgur first, then to the database, where 
 * the Kairos API will then use to compare subsequent pictures to provide verification
 */
router.post('/enrollface', function(req, res) {
var user = req.user;
if(user) {
	var subject_id = req.user.subject_id;
	var gallery_name = req.user.gallery_name;
	
  User.findOneAndUpdate(req.user.email, {$set: {image: imgurlink}}, {new: true}, function(err, user) {
  		if(err) return res.status(500).send("There was a problem updating your image");
  	});

	request({
		method: 'POST', 
		url: 'https://api.kairos.com/enroll',
 		headers: {
    		'Content-Type': 'application/json',
    		'app_id': '866388e6',
    		'app_key': '225cbb2255c9dd02aae2933d408bcff9'
    	},
    	json: true,
    	body: {image: imgurlink, subject_id: subject_id,  gallery_name: gallery_name} },
    	function(err, response, body) {
  			console.log("Errors: ", err);
  			console.log('Response:', body);
        console.log('ImageUrl:', body.images[0].transaction.status);
        if (body.images[0].transaction.status === "success")
          res.redirect('/');
        else
          res.redirect('/users/face');
    	});
}
else {
	return res.status(500).send("You are not logged in!");
}
});

/**
 * Verifies the face of a user, using a webcam to take a picture, then utilizing the Kairos API to compare the image with the one in its database
 * It returns a 'confidence value', ranging from 0 to 1, where anything above ~0.6 means the user is the right person. An email must also be provided to login,
 * otherwise the API would be called many times in order to compare the picture of a face with the face of each user in the entire database.
 */
router.post('/verifyface', function(req, res) {
	var user;
	var imageurl;
	var loginstatus;
	var successRating;
	var email = req.body.email;        
  				User.findOne( {'email': email }, function(err, result) {
  					console.log(JSON.stringify(result));       
  					if(err) console.log(err);
  						user = result;
  							request({
							     method: 'POST', 
							     url: 'https://api.kairos.com/verify',
 							     headers: {
    							     'Content-Type': 'application/json',
    							     'app_id': '866388e6',
    							     'app_key': '225cbb2255c9dd02aae2933d408bcff9'
    						    },
    						    json:true,
    						    body: {image: imgurlink, subject_id: result.subject_id,  gallery_name: result.gallery_name} },
							      function(err, response, body, next) {
								        console.log('Headers:', JSON.stringify(response.headers));
  							        console.log(err);
  								      console.log(req.user);
  								      console.log('Status:', response.statusCode);
  								      if (body.Errors !== undefined) {
  									         console.log(body.Errors[0].Message);
  									         console.log(result.subject_id);
  									         console.log(result.gallery_name);
  									         return new Error("Verify face again");
  								      }
  								      console.log('Response:', body);
  								      console.log(JSON.stringify(body));
  								      console.log(body.images[0].transaction.status);
  								      console.log(body.images[0].transaction.confidence); //RANGE: 0 to 1
  							       	loginstatus = body.images[0].transaction.status;
  								      successRating = body.images[0].transaction.confidence;
  									 	  if(successRating >= 0.75) {
  											   req.login(user, function(err) {
  												    if (err) {console.log(err);}
  													     console.log(req.user);
  													     console.log(req.session);
  													     console.log(req.isAuthenticated());
  													     res.redirect('/account'); 
  											   });
  										  }
  										  else {
  											   console.log("face does not match");
  											   res.redirect('/users/login');
  										  }	
							       });
  				  });
});

/**
 * Helper function to send a link from client-side to server-side
 */
router.post('/sendimg', function(req, res) {
	console.log("sendimg",req.body.link);
	imgurlink = req.body.link;
});



module.exports = router;