// routes
const async = require('async');
const json2csv = require('json2csv');
const User = require('../app/models/user.js');

module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: '' });
    });

    app.post('/', function(req, res, next) {
        if (!req.body.username || !req.body.password || !req.body.gradyear || !req.body.major) {
            return res.render('login.ejs', { message: 'Please fill all fields.' });
        }
	//Write your code here
    });
}
