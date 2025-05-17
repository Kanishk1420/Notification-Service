const { Queue } = require('bullmq');
const { redisConnection } = require('../config/redis');

// Create email queue
const emailQueue = new Queue('email-notifications', { connection: redisConnection });

// Function to add email job to queue
const addEmailJob = async (emailData) => {
  return await emailQueue.add('send-email', emailData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  });
};

module.exports = {
  emailQueue,
  addEmailJob
};