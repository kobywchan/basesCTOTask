// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy;

// load up the user model
const User = require('../app/models/user.js');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true // allows us to pass back the entire request to the callback
    }, function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            User.findOne({ username: username }, function(err, user) {
                // if there are any errors, return the error
                if (err) {
                    return done(err);
                }
                // check to see if theres already a user with that username
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                }
                // if there is no user with that username
                // create the user
                let newUser = new User({ username: username });
                newUser.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser,
                            req.flash('signupUsername', username),
                            req.flash('signupPassword', password));
                });
            });
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('login', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, username, password, done) { // callback with username and password from our form
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username': username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                return done(err);
            }

            // if no user is found or the password is invalid, return the message
            if (!user || !user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Username or password is incorrect.')); // req.flash is the way to set flashdata using connect-flash
            }

            // all is well, return successful user
            return done(null, user);
        });

    }));

};
