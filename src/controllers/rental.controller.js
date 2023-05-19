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
    const rent = await Rental.find().sort("-dateOut").populate(["user", "car"]);

      
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
    const rental = await Rental.find({ "user._id": req.user._id }).sort("-dateOut").populate(["user", "car"]);
      
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
    const rental = await Rental.findById(req.params.id).populate(["user", "car"])

      
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
  const { user, car, dateOut, dateReturned, rentalFee } = req.body;

  const existingRental = await Rental.findOne({
    "user._id": user,
    "car._id": car,
    dateReturned: { $exists: false }
  });

  if (existingRental) {
    return next(new AppError("Car is already in rental.", 400));
  }

  const [foundUser, foundCar] = await Promise.all([
    User.findById(user),
    Car.findById(car)
  ]);

  if (!foundUser) {
    return next(new AppError("Invalid user.", 400));
  }

  if (!foundCar) {
    return next(new AppError("Invalid car.", 400));
  }

  if (foundCar.numberInStock === 0) {
    return next(new AppError("Car not in stock.", 400));
  }

  const rental = new Rental({
    user: {
      _id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email
    },
    car: {
      _id: foundCar._id,
      name: foundCar.name,
      dailyRentalRate: foundCar.dailyRentalRate
    },
    dateOut,
    dateReturned,
    rentalFee
  });

  foundCar.numberInStock -= 1;
  await Promise.all([rental.save(), foundCar.save()]);

  res.status(201).json({
    success: true,
    message: "Rental posted successfully",
    rental
  });
})


exports.editRental = catchAsync(async (req, res, next) => {
  const { user, car, dateOut, dateReturned, rentalFee } = req.body;
  const { rentalId } = req.params;

  const existingRental = await Rental.findById(rentalId);

  if (!existingRental) {
    return next(new AppError("Rental not found.", 404));
  }

  existingRental.user = user;
  existingRental.car = car;
  existingRental.dateOut = dateOut;
  existingRental.dateReturned = dateReturned;
  existingRental.rentalFee = rentalFee;

  const [foundUser, foundCar] = await Promise.all([
    User.findById(user),
    Car.findById(car)
  ]);

  if (!foundUser) {
    return next(new AppError("Invalid user.", 400));
  }

  if (!foundCar) {
    return next(new AppError("Invalid car.", 400));
  }

  if (foundCar.numberInStock === 0) {
    return next(new AppError("Car not in stock.", 400));
  }

  existingRental.user = {
    _id: foundUser._id,
    name: foundUser.name,
    email: foundUser.email
  };

  existingRental.car = {
    _id: foundCar._id,
    name: foundCar.name,
    dailyRentalRate: foundCar.dailyRentalRate
  };

  foundCar.numberInStock -= 1;

  await Promise.all([existingRental.save(), foundCar.save()]);

  res.status(200).json({
    success: true,
    message: "Rental updated successfully",
    rental: existingRental
  });
});