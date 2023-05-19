const express = require("express")
const router = express();


const authController = require("../controllers/auth.controller")
const carController = require("../controllers/car.controller")

// Ping route
router.get("/", carController.ping)

// Protect all routes after this middleware
router.use(authController.protect);

// Get all cars
router.get("/cars", carController.getCars)

// Get one car route
router.get("/car/:id", carController.getCar)

// Post car route
router.post("/postcar", carController.postCar)

// Post car route
router.patch("/editpostcar/:id", carController.editPost)

// Delete car route
router.delete("/deletecar/:id", carController.deleteCar)




module.exports = router;