// Dependencies and Modules
const express = require("express");
const orderController = require("../controllers/orderController.js");
const {verify, verifyAdmin} = require("../auth");

//[Routing Component] 
const router = express.Router();

// Create Order
router.post("/checkout", verify, orderController.createOrder);

// Retrieve logged in user's orders
router.get("/my-orders", verify, orderController.getMyOrders);

// Retrieve all user's orders
router.get("/all-orders", verify, verifyAdmin, orderController.getAllMyOrders);

module.exports = router;