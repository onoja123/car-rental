const app = require('./src/app');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connectDB = require('./src/db/connect');

//catchrsing exception error
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

//connecting mongoose connection
connectDB();

const PORT = process.env.PORT || 3000;


const server = app.listen(PORT, (req, res) => {
  console.log(`⚡️:: Server running on port ${PORT}...`);
});


process.on('unhandledRejection', (err) => {
  log.info('UNHANDLED REJECTION! ! 💥 Shutting down...');
  log.info(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
