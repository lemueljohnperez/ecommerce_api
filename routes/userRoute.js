// Dependencies and Modules
const express = require("express");

// Routing Component
const router = express.Router();
const userController = require("../controllers/userController.js");
const passport = require("passport");

//Import the auth module and deconstruct it to get our verify method
const { verify, verifyAdmin, isLoggedIn } = require("../auth.js");

// Routes
router.post("/", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

router.patch('/:userId/set-as-admin', verify, verifyAdmin, userController.updateUser);

router.patch('/update-password', verify, userController.updatePassword);


// Google Login

//[Route for initiating the Google OAuth consent screen]
router.get('/google',
	//use the authenticate method of passport to verify the email credentials in the Google's API
    passport.authenticate('google', {
    	//scopes that are allowed when retrieving user data
        scope: ['email', 'profile'],
        //consent screen will be prompted
        prompt : "select_account"
    }
));

//[Route for callback URL for the Google OAuth Authentication]
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/users/failed',
    }),
    function (req, res) {
        res.redirect('/users/success')
    }
);

// Failed Authentication
router.get("/failed", (req, res) => {
    console.log('User is not authenticated');
    res.send("Failed")
})

// Successful Authentication
router.get("/success",isLoggedIn, (req, res) => {
    console.log('You are logged in');
    console.log(req.user);
    res.send(`Welcome ${req.user.displayName}`)
})

// User Logout
router.get("/logout", (req, res) => {
	//session destroy 
    req.session.destroy((err) => {
        if (err) {
            console.log('Error while destroying session:', err);
        } else {
            req.logout(() => {
                console.log('You are logged out');
                res.redirect('/');
            });
        }
    });
});


//[Export Route System]
//allows us to export the router object that will be accessed by index.js
module.exports = router;