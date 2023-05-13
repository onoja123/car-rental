const express = require("express")
const router = express();


const authController = require("../controllers/auth.controller")
const carController = require("../controllers/car.controller")

// Ping route
router.get("/", carController.ping)

// Get all cars
router.get("/cars", carController.getCars)

// Get one car route
router.get("/car", carController.getCar)

// Post car route
router.post("/postcar/:id", carController.postCar)

// Delete car route
router.post("/deletecar/:id", carController.deleteCar)




module.exports = router;