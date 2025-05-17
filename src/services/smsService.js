const twilio = require('twilio');
const logger = require('../utils/logger');

// Create Twilio client using credentials from .env
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send SMS function
exports.sendSMS = async ({ to, message }) => {
  try {
    // Format phone number if not in E.164 format
    const formattedNumber = this.formatPhoneNumber(to);
    
    // Send SMS through Twilio
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber
    });

    logger.info(`SMS sent: ${result.sid}`);
    return { sid: result.sid, success: true };
  } catch (error) {
    logger.error(`Error sending SMS: ${error.message}`);
    throw error;
  }
};

// Format phone number to E.164 format
exports.formatPhoneNumber = (phoneNumber) => {
  // This is a simplified formatter - in a real app you'd use a more robust method
  // Strip any non-numeric characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Add '+' prefix if not present
  if (!cleaned.startsWith('+')) {
    // If no country code, assume US (+1)
    if (cleaned.length === 10) {
      cleaned = `+1${cleaned}`;
    } else {
      cleaned = `+${cleaned}`;
    }
  }
  
  return cleaned;
};

// Validate phone number
exports.validatePhoneNumber = (phoneNumber) => {
  // This is a simplified validator
  const cleaned = phoneNumber.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};
