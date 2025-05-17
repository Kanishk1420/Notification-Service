# Notification Service
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust, scalable notification service for sending emails, SMS, and push notifications to users through a unified API.

## Overview
This notification service provides a reliable way to send different types of notifications to your users. It uses a queuing system to ensure notifications are delivered even during high traffic periods, and includes features like notification history tracking and failed notification retry.

## Features
- Multi-channel notification support:
  - Email notifications (via SendGrid)
  - SMS notifications (via Twilio)
  - Push notifications
- Robust architecture:
  - Queue-based processing for scalability
  - Automatic retries for failed notifications
  - Persistent storage of notification history
- Developer-friendly features:
  - RESTful API endpoints
  - Detailed notification logs
  - Paginated user notification history

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- Redis (for queue management)

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/notification-service.git

# Install dependencies
cd notification-service
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the service
npm start
```

### Update the .env file with your credentials
Open `.env` in your text editor and replace the placeholder values with your actual credentials:

- MongoDB connection string
- SendGrid API key
- Twilio credentials
- Redis configuration (if not using default)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notification-service
REDIS_URL=redis://localhost:6379
EMAIL_SERVICE=smtp.example.com
EMAIL_USER=user@example.com
EMAIL_PASSWORD=yourpassword
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

### Start the service
```bash
# Start both the API server and workers
npm run start:all

# Or start them separately for development
npm run dev          # API server
npm run start:workers # Workers
```

## Configuration
Required Environment Variables
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/notification-service

# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key_here
EMAIL_FROM=your_verified_email@example.com

# SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## API Usage

### Send Email Notification
```http
POST /api/notifications/email
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Your Subject",
  "body": "Email content with HTML support",
  "userId": "user123"
}
```

### Send SMS Notification
```http
POST /api/notifications/sms
Content-Type: application/json

{
  "to": "+1234567890",
  "message": "Your SMS message here",
  "userId": "user123"
}
```

### Get User Notifications
```http
GET /api/notifications/user/:userId?page=1&limit=10
```

Retrieves paginated notification history for a specific user.
- `userId`: ID of the user whose notifications to retrieve
- `page`: Page number (default: 1)
- `limit`: Number of notifications per page (default: 10)

## Architecture
The service follows a modular architecture with:
1. API Layer: Receives notification requests and queues them
2. Queue: Managed by BullMQ and Redis for reliable job processing
3. Workers: Process queued notifications in the background
4. Storage: MongoDB stores notification records and statuses

## Troubleshooting
- Redis connection issues: Verify Redis is running on the specified host and port
- Email not being sent: Check your SendGrid API key and sender verification status
- SMS not being sent: Verify your Twilio credentials and check if the recipient number is verified (required for trial accounts)

## Acknowledgments
- SendGrid for email delivery
- Twilio for SMS services
- BullMQ for the queue implementation

## License
This project is licensed under the MIT License - see the LICENSE file for details.