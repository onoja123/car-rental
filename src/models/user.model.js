const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
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
            unique: true,
            trim: true,
            minlength: 5,
            maxlength: 255
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 60,
            maxlength: 60
        },
        isAdmin: {
            type: Boolean,
            default: false
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