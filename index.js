// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
// Allows our backend app to be available to our frontend app
const cors = require("cors");

// Allows us to access routes defined within routes/user
const userRoutes = require("./routes/userRoute.js");
const productRoutes = require("./routes/productRoute.js");
const cartRoutes = require("./routes/cartRoute.js");
const orderRoutes = require("./routes/orderRoute.js");

// Environment Setup
const port = 4000;

// Server Setup
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Allows all resources to access our backend app
app.use(cors());

// Database Connection
mongoose.connect("mongodb+srv://admin:admin1234@wdc028-course-booking.t49xvui.mongodb.net/e-commerce-API?retryWrites=true&w=majority&appName=WDC028-Course-Booking");

let db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open",()=>console.log("Now connected to MongoDB Atlas!"));

// Backend Routes
// [/users]
app.use("/users",userRoutes);

// [/product]
app.use("/products", productRoutes);

// [/cart]
app.use("/cart", cartRoutes);

// [/orders]
app.use("/orders", orderRoutes);


// Server Gateway Response
if(require.main === module)
{
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on Port ${process.env.PORT || port}`)
	})
}

module.exports = {app, mongoose};