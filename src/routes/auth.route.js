const express = require("express")
const router = express();


const authController = require("../controllers/auth.controller")


// Ping route
// router.get("/", authController.ping)

// Signup route
router.post("/signup", authController.signup)

// Login route
router.post("/login",authController.login)

// Login route Worker
router.post("/worker/login",authController.workerLogin)

// Verify route
router.post("/verify", authController.verify)

// Forgotpassword route
router.post('/forgotPassword', authController.forgotPassword);

// resetpassword route
router.post("/resetpassword",  authController.resetPassword)

// resendverification route
router.post("/resendverification", authController.resendVerification)

// updatepassword route
// router.patch('/updateMyPassword', authController.updatePassword);

// logout route
router.post("/logout", authController.Logout)


module.exports = router;