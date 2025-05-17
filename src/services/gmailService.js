const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create a test account on Ethereal for testing without real credentials
exports.sendEmail = async ({ to, subject, body }) => {
  try {
    // Create a test account at ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    logger.info(`Created test email account: ${testAccount.user}`);

    // Create a transporter with the test account
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Notification Service" <test@example.com>',
      to,
      subject,
      html: body
    });

    logger.info(`Test email sent: ${info.messageId}`);
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    
    return info;
  } catch (error) {
    logger.error(`Error sending test email: ${error.message}`);
    throw error;
  }
};