const User = require("../models/user.model")
const sendEmail = require("../utils/sendEmail")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")



/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Ping the Route `test`
 * @route `@any`
 * @access Public
 * @type POST
 */
exports.ping = catchAsync(async (req, res, next) => {
    res.status(200).json({
      success: true,
      status: 'success',
      message: 'Hello from User',
      data: req.body || {}
    });
});

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Get users profile Controller
 * @route `/api/user/getprofile/:id`
 * @access Private
 * @type GET
 */
exports.getProfile = catchAsync(async(req, res, next)=>{

    const data = await User.findById(req.params.id).populate(["cars", "rental"])
  
    if (!data) {
        return next(new AppError('User profile not found', 404));
      }
   
    res.status(200).json(
        {
            success: true,
            data
        }
    )
  })


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Delete a user Controller
 * @route `/api/user/deleteprofile/:id`
 * @access Private
 * @type DELETE
 */
exports.deleteUser =  catchAsync(async (req, res, next) =>{
    //Get the user id
    const user = await User.findByIdAndDelete(req.params.id)
  
    // Check if the user exists
    if (!user) {
        return next(new AppError('No user found with that Id', 404));
      }
  
    // Return data after the user has been deleted
    res.status(200).json({
        success: true,
        data : {
            user: null
        }
    })
  })