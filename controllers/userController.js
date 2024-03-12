// Dependencies and Modules
const bcrypt = require("bcrypt")
// The "User" variable is defined using a capitalized letter to indicate that what we are using is the "User" model for code readability
const User = require("../models/userModel.js");
/*const Enrollment = require("../models/Enrollment.js");*/
const auth = require("../auth.js")

// Controllers
/*module.exports.checkEmailExists = (req, res) => {
	if (req.body.email.includes("@")) {
		return User.find({ email : req.body.email })
		.then(result => {

			if (result.length > 0) {
				return res.status(409).send({ error: "Duplicate Email Found" });
			}

			else {
				return res.status(404).send({ message: "Email not found" });
			};
		})
		.catch(err => {
			console.error("Error in find", err)
			return res.status(500).send({ error: "Error in find"});
		});
	}

	else {
	    return res.status(400).send({ error: "Invalid Email"})
	};
}*/


// User registration
module.exports.registerUser = (req, res) => {

	return User.find({ email : req.body.email })
	.then(result => {
		if (!req.body.email.includes("@")) {
			return res.status(400).send({ error: "Email invalid" });
		}

		else if (req.body.mobileNo.length !== 11) {
			return res.status(400).send({ error: "Mobile number invalid" });
		}
		
		else if (req.body.password.length < 8) {
			return res.status(400).send({ error: "Password must be atleast 8 characters" });
		}

		else if (result.length > 0) {
			return res.status(409).send({ error: "Duplicate Email Found"});
		}
		
		else {
			let newUser = new User({
				firstName : req.body.firstName,
				lastName : req.body.lastName,
				email : req.body.email,
				mobileNo : req.body.mobileNo,
				/*password : bcrypt.hashSync(req.body.password, 10)*/
				password : req.body.password
			})
			
			return newUser.save()
			.then((registeredUser) => res.status(201).send({
				message: "Registered Successfully",
				registeredUser: registeredUser
			}))
			.catch(err => {
				console.error("Error in saving: ", err)
				return res.status(500).send({ error: "Error in save"})
			})
		}
	})
};


// User authentication
module.exports.loginUser = (req, res) => {
	if(req.body.email.includes("@")) {
		User.findOne({ email : req.body.email })
		.then(result => {
			if(result == null) {
				return res.status(404).send({ error: "No Email Found" });
			}

			else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if (isPasswordCorrect) {
					return res.status(200).send({ access : auth.createAccessToken(result)})
				}

				else {
					return res.status(401).send({ message: "Email and password do not match" });
				}
			}
		})
		.catch(err => {
			console.error("Error in find: ", err)
			return res.status(500).send({ error: "Error in find"})
		})
	}
	
	else {
		return res.status(400).send({error: "Invalid Email"})
	}
};


// Retrieve user details
module.exports.getProfile = (req, res) => {
    const userId = req.user.id;

    User.findById(userId)
    .then(user => {
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Exclude sensitive information like password
        user.password = undefined;

        return res.status(200).send({ user });
    })
    .catch(err => {
    	console.error("Error in fetching user profile", err)
    	return res.status(500).send({ error: 'Failed to fetch user profile' })
    });
};


// Update User as Admin
module.exports.updateUser = (req, res) => {
	const userId = req.params.userId;

    let updateAdminField = {
        isAdmin: true
    }
    
    return User.findByIdAndUpdate(userId, updateAdminField)
    .then(updatedUser => {
        if (!updatedUser) {
        	return res.status(404).send({ error: 'User not found' });
        }
        return res.status(200).send({ 
        	message: 'User updated successfully', 
        	user: updatedUser
        });
    })
    .catch(err => {
    	console.error("Failed in updating the user: ", err)
    	return res.status(500).send({ error: 'Failed to update the user' })
    });
};


// Update Password
module.exports.updatePassword = (req, res) => {
    const userId = req.user.id;
    
    let updatedPassword = {
        password : req.body.password
    }

    return User.findByIdAndUpdate(userId, updatedPassword)
    .then(updatedPassword => {
        if (!updatedPassword) {
            return res.status(404).send({ error: 'User not found' });
        }
        return res.status(200).send({
            message: "Password Updated Successfully",
            updatedPassword: updatePassword
        });
    })
    .catch(err => {
        console.error("Failed in updating the user: ", err)
        return res.status(500).send({ error: 'Failed to update the user' })
    });
};


module.exports.enroll = (req, res) => {

	console.log(req.user.id) //the user's id from the decoded token after verify()
	console.log(req.body.enrolledCourses) //the course from our request body

	if(req.user.isAdmin) {
		return res.status(403).send({ error: "Admin is forbidden" });
	}

	let newEnrollment = new Enrollment({
		userId : req.user.id,
		enrolledCourses: req.body.enrolledCourses,
		totalPrice: req.body.totalPrice
	})
	
	return newEnrollment.save()
	.then(enrolled => {
		return res.status(201).send({ 
			message: "Successfully Enrolled",
			enrolled: enrolled
		});
	})
	.catch(err => {
		console.error("Error in enrolling: ", err)
		return res.status(500).send({ error: "Error in enrolling" })
	})
}


module.exports.getEnrollments = (req, res) => {
	return Enrollment.find({userId : req.user.id})
	.then(enrollments => {
		if (!enrollments) {
			return res.status(404).send({ error: 'No enrollments not found' });
		}

		return res.status(200).send({ enrollments });
	})
	.catch(err => {
		console.error("Error in fetching enrollments")
		return res.status(500).send({ error: 'Failed to fetch enrollments' })
	});
};