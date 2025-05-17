const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService'); 
const smsService = require('../services/smsService');
const pushService = require('../services/pushService');
const Notification = require('../models/notificationModel');
const logger = require('../utils/logger');

// Send email notification
exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, body, userId } = req.body;
    
    // Validate required fields
    if (!to || !subject || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Create and queue notification
    const result = await notificationService.createEmailNotification(to, subject, body, userId);
    
    res.status(202).json({
      success: true,
      message: 'Email notification queued successfully',
      data: { notificationId: result._id }
    });
  } catch (error) {
    logger.error(`Error queueing email notification: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to queue email notification' 
    });
  }
};

// Send SMS notification
exports.sendSms = async (req, res) => {
  try {
    const { to, message, userId } = req.body;
    
    // Validate required fields
    if (!to || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Create and queue notification
    const result = await notificationService.createSmsNotification(to, message, userId);
    
    res.status(202).json({
      success: true,
      message: 'SMS notification queued successfully',
      data: { notificationId: result._id }
    });
  } catch (error) {
    logger.error(`Error queueing SMS notification: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to queue SMS notification' 
    });
  }
};

// Send push notification
exports.sendPush = async (req, res) => {
  try {
    const { deviceId, title, body, userId } = req.body;
    
    // Validate required fields
    if (!deviceId || !title || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Create and queue notification
    const result = await notificationService.createPushNotification(deviceId, title, body, userId);
    
    res.status(202).json({
      success: true,
      message: 'Push notification queued successfully',
      data: { notificationId: result._id }
    });
  } catch (error) {
    logger.error(`Error queueing push notification: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to queue push notification' 
    });
  }
};

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const notifications = await notificationService.getUserNotifications(userId, page, limit);
    
    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    logger.error(`Error fetching user notifications: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch notifications' 
    });
  }
};
