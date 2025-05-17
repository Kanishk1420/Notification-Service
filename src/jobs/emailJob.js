const { Queue } = require('bullmq');
const { redisConnection } = require('../config/redis');

// Create email queue
const emailQueue = new Queue('email-notifications', { connection: redisConnection });

// Add job to send a single email
const scheduleEmail = async ({ to, subject, body, userId, notificationId }) => {
  await emailQueue.add('send-email', {
    to,
    subject,
    body,
    userId,
    notificationId
  });
};

// Add job to send bulk emails
const scheduleBulkEmails = async (emails) => {
  const jobs = emails.map(email => ({
    name: 'send-email',
    data: email
  }));
  
  await emailQueue.addBulk(jobs);
};

// Add job to send email with delay
const scheduleDelayedEmail = async ({ to, subject, body, userId, notificationId, delay }) => {
  await emailQueue.add('send-email', {
    to,
    subject,
    body,
    userId,
    notificationId
  }, {
    delay: delay // Delay in milliseconds
  });
};

module.exports = {
  scheduleEmail,
  scheduleBulkEmails,
  scheduleDelayedEmail,
  emailQueue
};
