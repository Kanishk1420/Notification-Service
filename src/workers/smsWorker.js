const { Worker } = require('bullmq');
const { redisConnection } = require('../config/redis');
const smsService = require('../services/smsService');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

// Create worker to process SMS jobs
const smsWorker = new Worker('sms-notifications', async job => {
  logger.info(`Processing SMS job ${job.id}`);
  
  try {
    const { to, message, notificationId } = job.data;
    
    // Send the SMS
    const result = await smsService.sendSMS({ to, message });
    logger.info(`SMS sent successfully to ${to}`);
    
    // Update notification status
    if (notificationId) {
      await notificationService.updateNotificationStatus(notificationId);
    }
    
    return result;
  } catch (error) {
    logger.error(`Failed to process SMS job: ${error.message}`);
    throw error;
  }
}, { connection: redisConnection });

// Handle worker events
smsWorker.on('completed', job => {
  logger.info(`SMS job ${job.id} has been completed`);
});

smsWorker.on('failed', (job, err) => {
  logger.error(`SMS job ${job.id} has failed with ${err.message}`);
});

module.exports = smsWorker;