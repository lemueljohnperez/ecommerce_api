// This is a standard approach for integrating OAuth Authentication, particulary with this file passport.js into our NodeJS Project

// Package for configuring env variables
require('dotenv').config();

// Passport is an authentication middleware for NodeJS
const passport = require("passport");

// Strategies are algorithms that are used for specific purposes
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//This configures passport to use the Google OAuth 2.0 authentication strategy
passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:4000/users/google/callback",
    passReqToCallback: true
},

// Callback Function - RETURNS a profile (of the email used in the Google Login containing the user info - email, firstName, and lastName)
function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});