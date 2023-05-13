const express = require("express")
const router = express();


const authController = require("../controllers/auth.controller")
const userController = require("../controllers/user.controller")

// Ping route
router.get("/", userController.ping)

// Get all cars
router.get("/profile/:id", userController.getProfile)

// Delete a user route
router.get("/profile/:id", userController.deleteUser)



module.exports = router;