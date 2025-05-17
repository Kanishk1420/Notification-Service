const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const logger = require('./utils/logger');
const notificationRoutes = require('./api/routes/notificationRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export the app, not start the server here
module.exports = app;
