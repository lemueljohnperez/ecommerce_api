// Dependencies and Modules
const express = require("express");

// Routing Component
const router = express.Router();
const userController = require("../controllers/userController.js");

//Import the auth module and deconstruct it to get our verify method
const { verify, verifyAdmin } = require("../auth.js");

// Routes
router.post("/", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

router.patch('/:userId/set-as-admin', verify, verifyAdmin, userController.updateUser);

router.patch('/update-password', verify, userController.updatePassword);


//[Export Route System]
//allows us to export the router object that will be accessed by index.js
module.exports = router;