const mongoose = require('mongoose');

const dotenv = require("dotenv")

dotenv.config({path: "./src/config.env"})

const DATABASE_URI = process.env.DATABASE


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://franca:Gabriella12@cluster0.531ojj9.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
        }).then(()=>{
            console.log('⚡️:: Connected to MongoDB!')
        }).catch(err =>{
            console.error(`Can't connect to MongoDB ${err} `)
        })
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;