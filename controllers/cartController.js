const User = require("../models/User.js");
const Product = require("../models/Product.js");
const Cart = require("../models/Cart.js");
const auth = require("../auth.js")

// Get User Cart
module.exports.getUserCart = (req, res) => {
	return Cart.find({userId : req.user.id})
	.then(userCart => {
		if (!userCart) {
			return res.status(404).send({ error: "No user found" });
		}

		else if (userCart.length == 0) {
			return res.status(404).send({ error: "No items found" });
		}

		else {
			return res.status(200).send({ userCart });
		}
	})
	.catch(err => {
		console.error("Error in fetching items")
		return res.status(500).send({ error: "Failed to fetch items" })
	});
};


// Add to Cart
module.exports.addToCart = (req, res) =>{
	const userId = req.user.id;
	const productId = req.body.productId;
	const quantity = req.body.quantity;

	// Check if the product exists
	Product.findById(productId)
	.then(product => {
		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		// Find the cart associated with the user ID
		Cart.findOne({ userId })
		.then(cart => {
			if (!cart) {
			// If no cart found, create a new cart and add the product
				const newCart = new Cart({
					userId,
					cartItems: [{ productId, quantity, subtotal: product.price * quantity }],
					totalPrice: product.price * quantity
				});

				newCart.save()
				.then(savedCart => {
					res.status(201).json(savedCart);
				})

				.catch(error => {
					res.status(500).json({ error: error.message });
				});
			}

			else {
			// If cart exists, check if the product is already in the cart
				const existingCartItem = cart.cartItems.find(item => item.productId.toString() === productId);

				if (existingCartItem) {
				// If product exists in cart, update the quantity and subtotal
					existingCartItem.quantity += quantity;
					existingCartItem.subtotal = existingCartItem.quantity * product.price;
				}

				else {
				// If product does not exist in cart, add it
					cart.cartItems.push({ productId, quantity, subtotal: product.price * quantity });
				}

				// Recalculate total price
				cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

				cart.save()
				.then(updatedCart => {
					res.json(updatedCart);
				})

				.catch(error => {
					res.status(500).json({ error: error.message });
				});
			}
		})

		.catch(error => {
			res.status(500).json({ error: error.message });
		});
	})

	.catch(error => {
		res.status(500).json({ error: error.message });
	});
}

module.exports.updateCartQuantity = (req, res) => {
    const userId = req.user.id;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    Product.findById(productId)
    .then(product => {
    	if (!product) {
    		return res.status(404).json({ error: 'Product not found' });
    	}

    	Cart.findOne({ userId })
    	.then(cart => {
    	    if (!cart){
    	        return res.status(404).json({ message: "No cart found for the user" });
    	    }

    	    else {
    	    	const existingCartItem = cart.cartItems.find(item => item.productId.toString() === productId);

    	        if (existingCartItem) {
    	        	// If product exists in cart, update the quantity and subtotal
    	            existingCartItem.quantity += quantity;
    	            existingCartItem.subtotal = existingCartItem.quantity * product.price;
    	        }

    	        else {
    	        	// If product does not exist in cart, add it
    	            cart.cartItems.push({ productId, quantity, subtotal: product.price * quantity });
    	        }

    	        // Recalculate total price
    	        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    	        cart.save()
    	        .then(updatedCart => {
    	        	res.status(200).send({ message: "Cart updated successfully", updatedCart });
    	        })
    	        .catch(saveErr => {
    	        	res.status(500).json({ error: saveErr.message });
    	        });
    	    }
    	})
    	.catch(cartFindErr => {
			res.status(500).json({ error: cartFindErr.message });
		})
    })
    .catch(productFindErr => {
    	res.status(500).json({ error: productFindErr.message });
    });
}

module.exports.removeItem = (req, res) => {
	const userId = req.user.id;
    const productId = req.params.productId;

    Cart.findOne({ userId })
       .then(cart => {
           if (!cart) {
               return res.status(404).json({ error: 'Cart not found' });
           }

           const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

           if (itemIndex === -1) {
               return res.status(404).json({ error: 'Item not found in cart' });
           }

           cart.cartItems.splice(itemIndex, 1);
           cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

           return cart.save();
       })
       .then(updatedCart => {
           return res.status(200).json({ message: 'Item removed from cart successfully', cart: updatedCart });
       })
       .catch(err => {
           console.error(err);
           return res.status(500).json({ error: 'Internal server error' });
       });
}

module.exports.clearCart = (req, res) => {
    const userId = req.user.id;

    Cart.findOne({ userId })
        .then(cart => {
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            if (cart.cartItems.length === 0) {
                return res.status(404).json({ error: 'Cart is already empty' });
            }

            cart.cartItems = [];
            cart.totalPrice = 0;

            return cart.save()
                .then(updatedCart => {
                    return res.status(200).json({ message: 'Cart cleared successfully', cart: updatedCart });
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        });
};
