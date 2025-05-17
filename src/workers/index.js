const emailWorker = require('./emailWorker');
const smsWorker = require('./smsWorker'); // Add this
const logger = require('../utils/logger');
const { Redis } = require('ioredis');
const { connectDB } = require('../config/database');

// Connect to MongoDB first
connectDB().then(() => {
  logger.info('Worker connected to MongoDB');
  
  // Start the workers
  logger.info('Starting notification workers...');
  
  // Log worker status
  logger.info('Email worker started');
  logger.info('SMS worker started');
  
  logger.info('All workers started successfully');
}).catch(err => {
  logger.error(`Failed to connect worker to MongoDB: ${err.message}`);
  process.exit(1);
});

// Keep the process running
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down workers gracefully');
  await Promise.all([
    emailWorker.close(),
    smsWorker.close()
  ]);
  process.exit(0);
});