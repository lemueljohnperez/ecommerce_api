# Application Name: ECommerce API

## Team Members
1. Lemuel John A. Perez
2. Jestoni Cruz



## User Credentials
* Admin User
	- email: admin@gmail.com
	- password: admin123

* Dummy Customer
	- email: customer@gmail.com
	- password: customer123



### Controllers (Lemuel)
* User Controller
	- [x] User registration
	- [x] User authentication
	- [x] Set user as admin (Admin only)
	- [x] Retrieve User Details
	- [x] Update Password

* Cart Controller
	- [x] Get User's Cart (User)
	- Add to Cart (User)
		* [x] Subtotal for each item
		* [x] Total price for all items
	- [x] Change product quantities (User)
	- [] Remove products from cart (User)
	- [] Clear Cart (User)

### Controllers (Toni)
* Product Controller
	- [x] Create Product (Admin only)
	- [x] Retrieve all products
	- [x] Retrieve all active products
	- [x] Retrieve single product
	- [x] Update Product information (Admin only)
	- [x] Archive Product (Admin only)
	- [x] Activate Product (Admin only)

* Order Controller
	- []
	- []
	- []


### Routes (Lemuel)
* User Route
	- [x] / (registerUser)
	- [x] /login (loginUser)
	- [x] /details (getProfile)
	- [x] /:userId/set-as-admin (updateUser)
	- [x] /update-password (updatePassword)

* Cart Route
	- [x] /get-cart (getUserCart)
	- [x] /add-to-cart (addToCart)
	- [x] /update-cart-quantity (updateCartQuantity)
	- [] /:productId/remove-from-cart
	- [] /clear-cart

### Routes (Toni)
* Product Route
	- [x] / (addProduct)
	- [x] /all (getAllProducts)
	- [x] / (getAllActiveProducts)
	- [x] /:productId (getProduct)
	- [x] /:productId (updateProduct)
	- [x] /:productId/archive (archiveProduct)
	- [x] /:productId/activate (activateProduct)
	- [] /searchByName
	- [] /searchByPrice

* Order Route
	- []
	- []
	- []