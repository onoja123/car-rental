const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
    {
        user: {
            type: new mongoose.Schema({
              name: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 50
              },
              email: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
              }
            }),
            required: true
          },
          car: {
            type: new mongoose.Schema({
              name: {
                type: String,
                required: true,
                trim: true,
                minlength: 1,
                maxlength: 50
              },
              dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
              }
            }),
            required: true
          },
          dateOut: {
            type: Date,
            required: true,
            default: Date.now
          },
          dateReturned: {
            type: Date
          },
          rentalFee: {
            type: Number,
            min: 0
          }
});
        
    



const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;