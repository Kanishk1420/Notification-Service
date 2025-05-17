const { Worker } = require('bullmq');
const { redisConnection } = require('../config/redis');
// Change this line to use the SendGrid service
const emailService = require('../services/emailService'); // Use SendGrid instead of Ethereal
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');
require('dotenv').config();

// Create worker to process email jobs
const emailWorker = new Worker('email-notifications', async job => {
  logger.info(`Processing email job ${job.id}`);
  
  try {
    const { to, subject, body, notificationId } = job.data;
    
    // Send the email
    const result = await emailService.sendEmail({ to, subject, body });
    logger.info(`Email sent successfully to ${to}`);
    
    // Update notification status using your service function
    if (notificationId) {
      await notificationService.updateNotificationStatus(notificationId);
    }
    
    return result;
  } catch (error) {
    logger.error(`Failed to process email job: ${error.message}`);
    logger.error(`Error stack: ${error.stack}`);
    // If it's a MongoDB error
    if (error.name === 'MongoError') {
      logger.error(`MongoDB error code: ${error.code}`);
    }
    throw error;
  }
}, { connection: redisConnection });

// Handle worker events
emailWorker.on('completed', job => {
  logger.info(`Email job ${job.id} has been completed`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Email job ${job.id} has failed with ${err.message}`);
});

module.exports = emailWorker;
