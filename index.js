// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");

// Allows our backend app to be available to our frontend app
const cors = require("cors");

// Allows us to access routes defined within routes/user
const userRoute = require("./routes/userRoute.js");
const productRoute = require("./routes/productRoute.js");
const cartRoute = require("./routes/cartRoute.js");
const orderRoute = require("./routes/orderRoute.js");

// Environment Setup
const port = 4003;

// Server Setup
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Allows all resources to access our backend app
app.use(cors());

// Database Connection
mongoose.connect("mongodb+srv://admin:admin1234@wdc028-course-booking.jodckfe.mongodb.net/ecommerce-API?retryWrites=true&w=majority&appName=WDC028-Course-Booking");

let db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open",()=>console.log("Now connected to MongoDB Atlas!"));

// Backend Routes
// [/users]
app.use("/b3/users",userRoute);

// [/product]
app.use("/b3/products", productRoute);

// [/cart]
app.use("/b3/cart", cartRoute);

// [/orders]
app.use("/b3/orders", orderRoute);


// Server Gateway Response
if(require.main === module)
{
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on Port ${process.env.PORT || port}`)
	})
}

module.exports = {app, mongoose};