// User.js
var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String,
  account: { type: Number, min: 0, max: 90000000000 },
});
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
