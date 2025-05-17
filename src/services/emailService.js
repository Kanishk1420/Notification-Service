const sgMail = require('@sendgrid/mail');
const logger = require('../utils/logger');


const API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(API_KEY);

// Send email function
exports.sendEmail = async ({ to, subject, body }) => {
  try {
    const msg = {
      to,
      from: 'kanishkgupta2003@outlook.com', // Your verified sender
      subject,
      html: body,
    };
    
    logger.info(`Sending email via SendGrid API to: ${to}`);
    const result = await sgMail.send(msg);
    logger.info(`Email sent successfully via SendGrid`);
    
    return result;
  } catch (error) {
    // Enhanced error logging
    if (error.response) {
      logger.error(`SendGrid API error: ${JSON.stringify(error.response.body)}`);
    }
    logger.error(`Error sending email: ${error.message}`);
    throw error;
  }
};

// Validate email address
exports.validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Create a template email
exports.createTemplateEmail = (templateName, data) => {
  // This function would fetch email templates from the database or file system
  // and replace variables with provided data
  
  // For this example, we'll use a simple switch case
  switch(templateName) {
    case 'welcome':
      return {
        subject: `Welcome to our service, ${data.name}!`,
        body: `<h1>Hello ${data.name}!</h1><p>Welcome to our service. We're glad to have you on board.</p>`
      };
    case 'password-reset':
      return {
        subject: 'Password Reset Request',
        body: `<h1>Password Reset</h1><p>Click <a href="${data.resetLink}">here</a> to reset your password.</p>`
      };
    default:
      throw new Error(`Template '${templateName}' not found`);
  }
};
