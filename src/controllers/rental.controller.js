const User = require("../models/user.model")
const Rental = require('../models/rental.model')
const Car = require('../models/car.model')
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

exports.ping = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Hello from Rental Services',
    data: req.body || {}
  });
});


//Get rentals
exports.getRentals = catchAsync(async(req, res, next)=>{
    const rent = await Rental.find().sort("-dateOut");

      
    if (!rent) {
        return next(new AppError('Not found', 404));
      }

    res.status(200).json({
        success: true,
        data: rent
      });
})

//Get car
exports.getRent = catchAsync(async(req, res, next)=>{
    const rental = await Rental.find({ "user._id": req.user._id }).sort("-dateOut");
      
    if (!rental) {
        return next(new AppError('Rent Not found', 404));
      }

    res.status(200).json({
        success: true,
        data: rental
      });
})

//Get rentals
exports.getRental = catchAsync(async(req, res, next)=>{
    const rental = await Rental.findById(req.params.id);

      
    if (!rental) {
        return next(new AppError('Rental with given ID does not exist.', 404));
      }

    res.status(200).json({
        success: true,
        data: rental
      });
})

//post for rent
exports.postRent = catchAsync(async(req, res, next)=>{
    const user = await User.findById(req.user._id);

    if(!user){
        return next(new AppError("Invalid user.", 400))
    }

    const car = await Car.findById(req.body.carId);

    if(!car){
        return next(new AppError("Invalid car.", 400))
    }

    let rental = await Rental.lookup(req.user._id, req.body.carId);
    if (rental && !rental.dateReturned){
        return next(new AppError("Car is already in rental..", 400))
    }

    if(car.numberInStock === 0){
        return next(new AppError("Car not in stock.", 400))
    }

    rental = new Rental({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        car: {
          _id: car._id,
          name: car.name,
          dailyRentalRate: car.dailyRentalRate
        }
      });

      await new Fawn.Task()
      .save("rentals", rental)
      .update(
        "cars",
        { _id: car._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();

        res.status(201).json({
            success: true,
            message: "Retanl posted successfully",
            rental
        })
})
