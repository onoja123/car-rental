const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,

        },
        password: {
            type: String,
            required: true,
            trim: true,

        },
        isActive:{
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        cars:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car'
        }],
        rental:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rental'
        }],
        role:{
            type: String,
            enum: ['admin', 'Seller'],
            default: 'Seller'
        },
        otp:{
            type: Number,  
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });

//Compare users password
userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
}
  
    // False means NOT changed
    return false;
};


const User = mongoose.model("User", userSchema);

module.exports = User;