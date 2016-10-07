var jwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');
var config = require('./config');


//Strategy for passport for extracting the data from auth header and get the user and check for auth
module.exports = function (passport) {
    var options = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: config.secret
    }
    passport.use(new jwtStrategy(options, function (payload, done) {
        User.findOne({ _id: payload._id }, function (err, user) {
            if (err) { return done(err, false) }
            if (user) {
                done(null, { "_id": user._id, "email": user.email, "username": user.username });
            } else {
                done(null, false);
            }
        });
    }));
};