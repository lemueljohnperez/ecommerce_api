const Order = require("../models/Order.js");
const Cart = require('../models/Cart.js');
const auth = require("../auth.js")

// Create Order
module.exports.createOrder = (req, res) => {

    const userId = req.user.id;

  // Find the cart associated with the user ID
  Cart.findOne({ userId })
    .then(cart => {
      if (!cart || cart.cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Calculate total price of the order based on cart items
      const totalPrice = cart.totalPrice;

      // Create productsOrdered array from cart items
      const productsOrdered = cart.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal
      }));

      // Create a new order object
      const newOrder = new Order({
        userId,
        productsOrdered,
        totalPrice
      });

      // Save the new order to the database
      newOrder.save()
        .then(savedOrder => {
          // Delete the user's cart after the order is successfully created
          Cart.deleteOne({ userId })
            .then(() => {
              res.status(201).json(savedOrder);
            })
            .catch(deleteErr => {
              res.status(500).json({ error: deleteErr.message });
            });
        })
        .catch(saveErr => {
          res.status(500).json({ error: saveErr.message });
        });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

// Get Order
module.exports.getMyOrders = (req, res) => {
    const userId = req.user.id;

    Order.find({ userId })
    .then(orders => {
        // If no orders found, send a message to the client
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for the current user" });
        }

        // If orders found, send them to the client
        res.status(200).json({
        	orders: orders
        });
    })
    .catch(err => {
        console.error("Error finding user's orders:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    });
};


// All Orders
module.exports.getAllMyOrders = (req, res) => {
    Order.find()
    .then(orders => {
        res.status(200).json({
        	orders: orders
        });
    })
    .catch(err => {
        console.error("Error finding all orders:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    });
};