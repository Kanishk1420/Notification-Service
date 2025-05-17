const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      required: true
    },
    recipient: {
      type: String,
      required: function() {
        return this.type === 'email' || this.type === 'sms';
      }
    },
    content: {
      subject: String,
      body: String,
      message: String,
      title: String,
      data: mongoose.Schema.Types.Mixed
    },
    userId: {
      type: String,
      index: true
    },
    status: {
      type: String,
      enum: ['queued', 'sent', 'delivered', 'failed', 'read'],
      default: 'queued',
      index: true
    },
    sentAt: Date,
    deliveredAt: Date,
    readAt: Date,
    failureReason: String,
    retryCount: {
      type: Number,
      default: 0
    },
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

// Add indexes for common queries
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1, status: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
