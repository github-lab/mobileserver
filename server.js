//server.js
var app = require('./app');
var https = require('https');
var http = require('http');
var fs = require('fs');

var port = 443;
var httpport = 80;
//Create a https server with https connection
https.createServer({
	key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
    }, app).listen(port, function() {
    	console.log('Express server listening on port ' + port);
    });

http.createServer(app).listen(httpport, function() {
	console.log('Express server listening on port ' + httpport);
});
