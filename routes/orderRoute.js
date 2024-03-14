// Dependencies and Modules
const express = require("express");
const orderController = require("../controllers/orderController.js");
const {verify, verifyAdmin} = require("../auth");

//[Routing Component] 
const router = express.Router();

// Create Order
router.post("/checkout", verify, orderController.createOrder);


module.exports = router;