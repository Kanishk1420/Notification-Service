const express = require('express');
const notificationController = require('../../controllers/notificationController');

const router = express.Router();

// Send notification routes
router.post('/email', notificationController.sendEmail);
router.post('/sms', notificationController.sendSms);
router.post('/push', notificationController.sendPush);

// Notification history/management routes
router.get('/user/:userId', notificationController.getUserNotifications);

module.exports = router;
