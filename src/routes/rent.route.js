const express = require("express")
const router = express();


const authController = require("../controllers/auth.controller")
const rentalController = require("../controllers/rental.controelr")

// Ping route
router.get("/", rentalController.ping)

// Get all rentals
router.get("/rentals", rentalController.getRentals)

// Get rental by user
router.get("/rentalbyuser", rentalController.getRent)

// Get rental by user
router.get("/rental/:id", rentalController.getRental)

// post rental for sell
router.get("/postrent/:id", rentalController.postRent)


module.exports = router;