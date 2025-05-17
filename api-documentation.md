# Notification Service API Documentation

## Overview

The Notification Service provides a unified API for sending various types of notifications to users. This service supports:

- Email notifications (via SendGrid)
- SMS notifications (via Twilio)
- Push notifications
- Notification history tracking

## Base URL

```
https://api.example.com/api
```

For local development:

```
http://localhost:3000/api
```

## Authentication

Authentication is required for all API endpoints. Use an API key in the request header:

```
Authorization: Bearer YOUR_API_KEY
```

## API Endpoints

### Email Notifications

#### Send Email

Send an email notification to a recipient.

```
POST /notifications/email
```

**Request Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Your Subject Line",
  "body": "<p>Email content with HTML support</p>",
  "userId": "user123"  // Optional: Associate with a user
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email notification queued successfully",
  "data": {
    "notificationId": "60f1a5c7e98d7b2d4c8e4321"
  }
}
```

### SMS Notifications

#### Send SMS

Send an SMS notification to a recipient.

```
POST /notifications/sms
```

**Request Body:**

```json
{
  "to": "+12345678901",
  "message": "Your SMS message content",
  "userId": "user123"  // Optional: Associate with a user
}
```

**Response:**

```json
{
  "success": true,
  "message": "SMS notification queued successfully",
  "data": {
    "notificationId": "60f1a5c7e98d7b2d4c8e4322"
  }
}
```

### Push Notifications

#### Send Push Notification

Send a push notification to a user's device.

```
POST /notifications/push
```

**Request Body:**

```json
{
  "deviceId": "device123",
  "title": "Notification Title",
  "body": "Notification message body",
  "userId": "user123",  // Optional: Associate with a user
  "data": {             // Optional: Additional data
    "action": "open_screen",
    "screenName": "profile"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Push notification queued successfully",
  "data": {
    "notificationId": "60f1a5c7e98d7b2d4c8e4323"
  }
}
```

### User Notifications

#### Get User Notifications

Retrieve notification history for a specific user.

```
GET /notifications/user/:userId
```

**Query Parameters:**

- `page` (default: 1): Page number for pagination
- `limit` (default: 10): Number of items per page

**Response:**

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "60f1a5c7e98d7b2d4c8e4323",
        "type": "email",
        "recipient": "user@example.com",
        "content": {
          "subject": "Welcome",
          "body": "<p>Welcome to our service!</p>"
        },
        "status": "delivered",
        "createdAt": "2023-07-16T12:00:00.000Z",
        "sentAt": "2023-07-16T12:00:05.000Z",
        "deliveredAt": "2023-07-16T12:00:10.000Z"
      },
      // More notifications...
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "totalNotifications": 25
  }
}
```

## Status Codes

The API uses the following HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | OK - The request has succeeded |
| 201 | Created - The request has succeeded and a new resource has been created |
| 202 | Accepted - The request has been accepted for processing |
| 400 | Bad Request - The request is invalid |
| 401 | Unauthorized - Authentication failed |
| 403 | Forbidden - The client does not have access rights to the content |
| 404 | Not Found - The server can't find the requested resource |
| 429 | Too Many Requests - The user has sent too many requests in a given time |
| 500 | Internal Server Error - The server encountered an unexpected condition |

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message explaining what went wrong",
  "error": "Detailed error information (only in development environment)"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Rate limits are applied on a per-API key basis:

- Email: 100 requests per minute
- SMS: 20 requests per minute
- Push: 100 requests per minute

When a rate limit is exceeded, the API responds with a 429 status code.

## Examples

### cURL

```bash
# Send an email
curl -X POST https://api.example.com/api/notifications/email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"to":"recipient@example.com","subject":"Test Subject","body":"<p>Hello World</p>","userId":"user123"}'

# Get user notifications
curl -X GET https://api.example.com/api/notifications/user/user123?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### JavaScript

```javascript
// Send an email notification
const sendEmail = async () => {
  try {
    const response = await fetch('https://api.example.com/api/notifications/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        to: 'recipient@example.com',
        subject: 'Test Subject',
        body: '<p>Hello World</p>',
        userId: 'user123'
      })
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Python

```python
import requests

# Send an SMS notification
def send_sms():
    url = "https://api.example.com/api/notifications/sms"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
    }
    payload = {
        "to": "+12345678901",
        "message": "Your verification code is 123456",
        "userId": "user123"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    print(response.json())
```

## Webhooks

The notification service can notify your application about notification status changes through webhooks.

### Webhook Events

- `notification.delivered`: Triggered when a notification is successfully delivered
- `notification.failed`: Triggered when a notification fails to deliver
- `notification.read`: Triggered when a notification is marked as read (for supported notification types)

### Webhook Payload

```json
{
  "event": "notification.delivered",
  "notificationId": "60f1a5c7e98d7b2d4c8e4323",
  "type": "email",
  "userId": "user123",
  "recipient": "user@example.com",
  "timestamp": "2023-07-16T12:00:10.000Z"
}
```

### Setting Up Webhooks

Register webhook URLs through the developer dashboard or contact support to set up webhook notifications for your application.
