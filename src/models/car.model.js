const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 50
          },
          brand: {
            type: Brand.schema,
            required: true
          },
          type: {
            type: Type.schema,
            required: true
          },
          numberOfSeats: {
            type: Number,
            min: 1,
            max: 255,
            default: 5
          },
          numberOfDoors: {
            type: Number,
            min: 1,
            max: 255,
            default: 4
          },
          transmission: {
            type: String,
            enum: ["Manual", "Automatic"],
            default: "Manual"
          },
          airConditioner: {
            type: Boolean,
            default: false
          },
          numberInStock: {
            type: Number,
            required: true,
            min: 0,
            max: 255
          },
          dailyRentalRate: {
            type: Number,
            required: true,
            min: 0,
            max: 255
          }
    },
    {
        timestamps: true
    }
)



const Car = mongoose.model("Car", carSchema);

module.exports = Car;