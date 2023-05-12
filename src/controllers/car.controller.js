const User = require("../models/user.model")
const Rental = require('../models/rental.model')
const Car = require('../models/car.model')
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

//Get Cars
exports.getCars = catchAsync(async(req, res, next)=>{
    const cars = await Car.find().sort("name");

      
    if (!cars) {
        return next(new AppError('Not found', 404));
      }

    res.status(200).json({
        success: true,
        data: cars
      });
})


//Get car
exports.getCar = catchAsync(async(req, res, next)=>{
    const car = await Car.findById(req.params.id);
      
    if (!car) {
        return next(new AppError('Car with given ID does not exist.', 404));
      }

    res.status(200).json({
        success: true,
        data: car
      });
})

exports.postCar = catchAsync(async(req, res, next)=>{
    const car = await Car.findByIdAndUpdate(
        req.params.id,
        setValues(req, brand, type),
        {
          new: true
        }
      );
  
      if (!car){
        return next(new AppError('Car with given ID does not exist.', 404));
      }
    
})

exports.deleteCar = catchAsync(async(req, res, next)=>{
    const car = await Car.findByIdAndRemove(req.params.id);

    if (!car){
        return next(new AppError('Car with given ID does not exist.', 404));
    }

    res.status(200).json({
        success: true,
        message: "Car deleted successfully",
        data: car
      });
})


function setValues(req, brand, type) {
  return {
    name: req.body.name,
    brand: {
      _id: brand._id,
      name: brand.name
    },
    type: {
      _id: type._id,
      name: type.name
    },
    numberOfSeats: req.body.numberOfSeats,
    numberOfDoors: req.body.numberOfDoors,
    transmission: req.body.transmission,
    airConditioner: req.body.airConditioner,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  };
}