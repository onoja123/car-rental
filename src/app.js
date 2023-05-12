const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const globalHandler = require('./controllers/error.controller');

const app = express();

app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    origin: '*',
    credentials: true,
  })
);

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true }));



app.use(globalHandler);

app.get('/', (req, res) => {
  res.send('Car rental Server live ⚡️');
});

app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    messsage: `${req.originalUrl} not found`,
  });
});

module.exports = app;
