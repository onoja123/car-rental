const express = require("express")
const router = express();


const authController = require("../controllers/auth.controller")
const rentalController = require("../controllers/rental.controller")

// Protect all routes after this middleware
router.use(authController.protect);

// Ping route
router.get("/", rentalController.ping)


// Get all rentals
router.get("/rentals", rentalController.getRentals)

// Get rental by user
router.get("/rentalbyuser", rentalController.getRent)

// Get rental by user
router.get("/rental/:id", rentalController.getRental)

// post rental for sell
router.post("/postrent", rentalController.postRent)


module.exports = router;