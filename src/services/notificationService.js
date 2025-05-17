const { Queue } = require('bullmq');
const Notification = require('../models/notificationModel');
const logger = require('../utils/logger');
const { redisConnection } = require('../config/redis');

// Create queues
const emailQueue = new Queue('email-notifications', { connection: redisConnection });
const smsQueue = new Queue('sms-notifications', { connection: redisConnection });
const pushQueue = new Queue('push-notifications', { connection: redisConnection });

// Create and queue email notification
exports.createEmailNotification = async (to, subject, body, userId) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      type: 'email',
      recipient: to,
      content: { subject, body },
      userId,
      status: 'queued'
    });

    // Add to email queue
    await emailQueue.add('send-email', { 
      to, 
      subject, 
      body, 
      notificationId: notification._id 
    });

    return notification;
  } catch (error) {
    logger.error(`Error creating email notification: ${error.message}`);
    throw error;
  }
};

// Create and queue SMS notification
exports.createSmsNotification = async (to, message, userId) => {
  try {
    // Create notification record
    const notification = await Notification.create({
      type: 'sms',
      recipient: to,
      content: { message },
      userId,
      status: 'queued'
    });

    // Add to SMS queue
    await smsQueue.add('send-sms', { 
      to, 
      message, 
      notificationId: notification._id 
    });

    return notification;
  } catch (error) {
    logger.error(`Error creating SMS notification: ${error.message}`);
    throw error;
  }
};

// Get user notifications with pagination
exports.getUserNotifications = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Notification.countDocuments({ userId });
  
  return {
    notifications,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    totalNotifications: total
  };
};

// Update notification status to delivered
exports.updateNotificationStatus = async (notificationId, status = 'delivered') => {
  try {
    logger.info(`Updating notification ${notificationId} to ${status} status`);
    
    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      {
        status,
        deliveredAt: status === 'delivered' ? new Date() : undefined
      },
      { new: true }
    );
    
    if (updated) {
      logger.info(`Successfully updated notification status to ${status}`);
      return updated;
    } else {
      logger.error(`Failed to update notification: ID ${notificationId} not found`);
      return null;
    }
  } catch (error) {
    logger.error(`Error updating notification status: ${error.message}`);
    throw error;
  }
};
