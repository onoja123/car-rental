const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
    {
        user:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        car:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car'
        }],
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