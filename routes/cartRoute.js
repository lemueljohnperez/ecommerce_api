// Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cartController.js");
const {verify, verifyAdmin} = require("../auth");

//[Routing Component] 
const router = express.Router();

// Retrieve User's Cart
router.get("/get-cart", verify, cartController.getUserCart);

//Add to cart 
router.post("/add-to-cart", verify, cartController.addToCart);

// Change Product Quatities in Cart
router.patch("/update-cart-quantity", verify, cartController.UpdateCartQuantity);

// Remove Item from Cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeItem);

//Clear-Cart
router.put("/clear-cart",verify,cartController.clearCartItems);

// Add search for products by their names
router.post("/products/searchByName", cartController.searchByName);

// Add search for products by price range
router.post("/products/searchByName", cartController.searchByPrice);

module.exports = router;