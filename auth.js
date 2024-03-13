// Dependencies and Modules 
const jwt = require("jsonwebtoken");

// User defined string data that will be used to create our JSON Web Tokens
const secret = "ECommerceAPI";

// Token Creation
module.exports.createAccessToken = (user) => {
	//When the user logs in, a token will be created with the user's information
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};
	//generates a token using the form data and the secret code with no additional options provided
	return jwt.sign(data, secret,{});
}

// Error Handling while Calling Promise-based Methods
module.exports.verify = (req, res, next) => {

	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if(typeof token === "undefined") {
		return res.send({auth: "Failed. No Token"})
	}

	else {
		console.log(token);

		token = token.slice(7, token.length);

		console.log(token);
		
		jwt.verify(token, secret, function(err, decodedToken) {
			if(err) {
				return res.send({
					auth: "Failed",
					message: err.message
				})
			}

			else {
				console.log("Result from verify method: ")
				console.log(decodedToken);
	
				req.user = decodedToken;
				// next() is an expressJS function which allows us to move to the next function in the route. It also passes details of the request and response to the next function/middleware.
				next();
			}
		})
	}
}

// Admin Verification
module.exports.verifyAdmin = (req, res, next) => {

	console.log("Result from verifyAdmin method:");
	console.log(req.user);

	if(req.user.isAdmin) {
		next()
	}

	else {
		return res.status(403).send({
			"auth":"Failed",
			message:"Action Forbidden"
		})
	}
}