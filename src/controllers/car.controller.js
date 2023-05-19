const User = require("../models/user.model")
const Rental = require('../models/rental.model')
const Car = require('../models/car.model')
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

exports.ping = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Hello from Car',
    data: req.body || {}
  });
});


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

  const {brand, type, numberOfSeats, transmission, airConditioner, numberInStock, dailyRentalRate,image, _owner} = req.body;

  const user = await User.findById(_owner);

      const car = new Car({
        brand,
        type,
        numberOfSeats, 
        transmission,
        airConditioner,
        numberInStock,
        dailyRentalRate,
        image,
        _owner,

      })

      if (!car){
        return next(new AppError('Cannot post details, please try again.', 400));
      }


      await car.save()

      user.cars.push(car._id)
      await user.save()

      res.status(200).json({
        success: true,
        message: "Car posted successfully",
        car
    })
})

exports.editPost = catchAsync(async(req, res, next)=>{
  const {id} = await Car.findById(req.params.id);
  const {brand, type, numberOfSeats, transmission, airConditioner, numberInStock, dailyRentalRate,image} = req.body;

  const data = {
    brand,
    type,
    numberOfSeats, 
    transmission,
    airConditioner,
    numberInStock,
    dailyRentalRate,
    image
  }

  const result = await Car.findByIdAndUpdate(id, data, {new: true});
  res.status(200).json({
    success: true,
    message: "Edit done successfully",
    result
})



})

exports.deleteCar = catchAsync(async(req, res, next)=>{
    const car = await Car.findByIdAndRemove(req.params.id);

    if (!car){
        return next(new AppError('Car with given ID does not exist.', 404));
    }

    res.status(200).json({
        success: true,
        message: "Car deleted successfully",
      });
})
