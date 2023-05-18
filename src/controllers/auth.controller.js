const User = require("../models/user.model")
const sendEmail = require("../utils/sendEmail")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const { promisify } = require('util');
const jwt = require("jsonwebtoken")
const crypto = require('crypto');

const otpGenerator = require('otp-generator')


//sign user token using jwt
const signToken = id =>{
    return jwt.sign({id: id}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) =>{
    const token = signToken(user._id)

    const cookieOtions = {
        expiresIn: new Date(Date.now() * process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
    if(process.env.NODE_ENV === 'production') cookieOtions.secure = true
    res.status(statusCode)
    .cookie("jwt", token, cookieOtions)
    .json({
        success: true,
        token,
        data: {
            user
        }
    })
}

/**
 * @description Ping Server Controller
 * @route `/api/auth/`
 * @access Public
 * @type POST
 */
exports.ping = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Hello from Auth'
  });
});


/**
 * @description Signup User Controller
 * @route `/api/auth/signup`
 * @access Public
 * @type POST
 */
exports.signup = catchAsync ( async(req, res, next)=>{
    const {name, email, password} = req.body;
   
       //check for required fields
       switch ((name, email, password)) {
        case !name && !email && !password:
          return res.status(400).send("Please fill in the required fields");
        case !name:
          return res.status(400).send("Please enter your fullname");
        case !email:
          return res.status(400).send("Please enter your email");
        case !password:
          return res.status(400).send("Please enter your password");
      }

      
      const existingEmail = await User.findOne({ email: req.body.email });
  
      //check if email exists
      if (existingEmail){
        res.status(400).json({
          success: false,
          message: "The email address is already taken"
        })
      }
  
      const newUser = await User.create({
        name: name,
        email: email,
        password: password,
        
      })
  
      await newUser.save()

    const otp = newUser.otp = otpGenerator.generate(4, {upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false})
    await newUser.save({ validateBeforeSave: false})

      const message = `
      Hi ${req.body.name}, welcome to Car rental Services 🚀
      Before doing anything, we recommend verifying your account to use most of the features available,
      here is your otp verification code ${otp}`
    
    try {
        await sendEmail({
          email: newUser.email,
          subject:  "Welcome to  Car rental Services 🚀",
          message
        });
        
    }catch(err){
      newUser.otp = undefined
      await newUser.save({ validateBeforeSave: false})

      return res.status(500).send({
        success: false,
        message: "Couldn't send the verification email"});
    }
  
    createSendToken(newUser, 201,  res)
  })


  /**
 * @description Verify Users Email Controller
 * @route `/api/auth/verify`
 * @access Public
 * @type POST
 */
exports.verify = catchAsync(async(req, res, next)=>{
    const { otpCode } = req.body

    if(!otpCode){
        return next(new AppError('Please provide an otp code', 401))
    }
    const user = await User.findOne({otp:otpCode})
    if(!user){
        return next(new AppError('This otp code has expired or is invalid', 401))
    }

    if (user.isActive === true) {
      user.otp = null;
      return next(new AppError("Your account has already been verified..", 400));
    }

      //then change the user's status to active
    user.isActive= true
    
    user.otp = null

    await user.save({ validateBeforeSave: false})


  createSendToken(user, 200, res)
})


/**
 * @description Login in User Controller
 * @route `/api/auth/login`
 * @access Public
 * @type POST
 */
exports.login = catchAsync(async(req, res, next)=>{
    //check if user and password exist
    
    const { email, password} = req.body;
  
    // 1) Check if email and password exist
     switch((email, password)){
       case !email || !password:
         return  next(new AppError("Please provide email and password!", 400))
     }
     
     // 2) Check if user exists && password is correct
     const user = await User.findOne({ email }).select('+password');

     if(!user){
      res.status(404).json({
        success: false,
        message: "User does not exist"
      })
     }

     if(user.isActive === false){
      return next(new AppError("Please provide verify your email and try again.", 400))
    }
     if (!user || !(await user.correctPassword(password, user.password))) {
       return next(new AppError('Incorrect email or password', 401));
     }

    user.isLoggedIn = true;

    createSendToken(user, 200,  res)
})


/**
 * @description Resend verification otp to users email Controller
 * @route `/api/auth/resendverification`
 * @access Public
 * @type POST
 */
exports.resendVerification = catchAsync(async(req, res, next)=>{
  const user = await User.findOne({email: req.body.email})

  if(!user){
    return next(new AppError(
      "Account does not exit, please sign up to have access....", 404
    ))
  }
  if (user.isActive === true) {
    return next (new AppError("Account has already been verified", 400));
  }

  const otp = newUser.otp = otpGenerator.generate(4, {upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false})
  await newUser.save({ validateBeforeSave: false})

  const message = `
  Hi there ${user.name}!
  Here's a new code to verify your account.${otp}`

    try{
        await sendEmail(
            {
              to: user.email,
              subject: 'Verification Link 🚀!',
              message
            }
        )
        res.status(200).json({
            success: true,
            message: 'Verification link sent successfully!'
        })
    }catch(err){

      newUser.otp = null

        await user.save()

        return res.status(500).json({
            success: false,
            message: "Couldn't send the verification email"});
        
    }
})

/**
 * @description Forogot Password Controller
 * @route `/api/auth/forgotPassword`
 * @access Public
 * @type POST
 */
exports.forgotPassword = catchAsync(async(req, res, next)=>{
      //Get user based on email
  
      const user = await User.findOne({email: req.body.email})
  
      if(!user){
          return next(new AppError("There is no user with this email address", 404))
      }
    
      const otp = user.otp = otpGenerator.generate(4, {upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false})
      await user.save({ validateBeforeSave: false})
  
    
    console.log(otp)
  
  
    const message = `
    Hi ${user.fullName}
    We heard you are having problems with your password.
    here is your otp vefication code ${otp}
    Otp expires in 10 minutes.`;
    
      try {
          await sendEmail({
            email: user.email,
            subject: 'Forgot password',
            message
          });
      
          res.status(200).json({
            success: true,
            message: 'Email sent sucessfully 🚀!'
          });
        } catch (err) {
          user.otp = null;
          await user.save({ validateBeforeSave: false });
      
          return next(
            new AppError('There was an error sending the email. Try again later!', 500)
          );
        }
})

/**
 * @description Reset Password Controller
 * @route `/api/auth/resetpassword`
 * @access Public
 * @type POST
 */
exports.resetPassword = catchAsync(async(req, res, next)=>{
    //Get user based on the token
    const { otpCode } = req.body

    if(!otpCode){
        return next(new AppError('Please provide an otp code', 401))
    }
    const user = await User.findOne({otp:otpCode})
    if(!user){
        return next(new AppError('This otp code has expired or is invalid', 401))
    }

   console.log(user.otp)
   user.password = req.body.password
   user.passwordConfirm = req.body.passwordConfirm
   user.otp = null
    await user.save()

    createSendToken(user, 200, res)
})


//protect user that arent authenticated
exports.protect = catchAsync(async(req, res, next)=>{
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
    token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return next(
          new AppError('You are not logged in! Please log in to get access.', 401
           )
        );
      }

      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)

       const currentUser = await User.findById(decoded.id);
       if(!currentUser){
        return next(
            new AppError('The user belonging to this token does no longer exist.', 401))};;
       
       if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(
            new AppError("User recently changed password, please login again!", 401))};

       req.user = currentUser;
       next()
})

// exports.updatePassword = catchAsync(async (req, res, next) => {
//   // 1) Get user from collection
//   const user = await User.findById(req.user.id).select('+password');

//   // 2) Check if POSTed current password is correct
//   if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
//     return next(new AppError('Your current password is wrong.', 401));
//   }

//   // 3) If so, update password
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   await user.save();
//   // User.findByIdAndUpdate will NOT work as intended!

//   // 4) Log user in, send JWT
//   createSendToken(user, 200, res);
// });

/**
 * @description Logout Controller
 * @route `/api/auth/logout`
 * @access Public
 * @type POST
 */
exports.Logout = catchAsync(async(req, res, next)=>{
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true,});
})
