const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    //Write your code here
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
