const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
    {
          brand: {
            type: String,
            required: true
          },
          type: {
            type: String,
            required: true
          },
          numberOfSeats: {
            type: Number,
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
          },
          dailyRentalRate: {
            type: Number,
            required: true,
            min: 0,
            max: 255
          },
          image: [

          ],
          _owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
    },
    {
        timestamps: true
    }
)



const Car = mongoose.model("Car", carSchema);

module.exports = Car;