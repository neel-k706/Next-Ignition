# API Reference

## Overview

API endpoints and data structures for NextIgnition platform integration.

## Authentication

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { user, token }
```

### Register
```
POST /api/auth/register
Body: { email, password, role }
Response: { user, token }
```

### Logout
```
POST /api/auth/logout
Headers: { Authorization: Bearer <token> }
Response: { success: true }
```

## User Management

### Get Profile
```
GET /api/users/profile
Headers: { Authorization: Bearer <token> }
Response: { user }
```

### Update Profile
```
PUT /api/users/profile
Headers: { Authorization: Bearer <token> }
Body: { full_name, bio, location, ... }
Response: { user }
```

## Startups

### List Startups
```
GET /api/startups
Query: { stage, industry, location, ... }
Response: { startups: [] }
```

### Get Startup
```
GET /api/startups/:id
Response: { startup }
```

### Create Startup Profile
```
POST /api/startups
Headers: { Authorization: Bearer <token> }
Body: { name, description, stage, ... }
Response: { startup }
```

## Funding

### Upload Pitch Deck
```
POST /api/funding/pitch-deck
Headers: { Authorization: Bearer <token> }
Body: FormData { file, visibility }
Response: { pitch_deck }
```

### Upload Pitch Video
```
POST /api/funding/pitch-video
Headers: { Authorization: Bearer <token> }
Body: FormData { video, visibility }
Response: { pitch_video }
```

### Get Funding Status
```
GET /api/funding/status
Headers: { Authorization: Bearer <token> }
Response: { requests: [] }
```

## Mentorship

### List Experts
```
GET /api/experts
Query: { specialization, industry, ... }
Response: { experts: [] }
```

### Request Mentorship
```
POST /api/mentorship/request
Headers: { Authorization: Bearer <token> }
Body: { expert_id, topic, date, time, ... }
Response: { request }
```

### Get Sessions
```
GET /api/mentorship/sessions
Headers: { Authorization: Bearer <token> }
Response: { sessions: [] }
```

## Webinars

### List Webinars
```
GET /api/webinars
Query: { date, topic, host, ... }
Response: { webinars: [] }
```

### Register for Webinar
```
POST /api/webinars/:id/register
Headers: { Authorization: Bearer <token> }
Response: { registration }
```

### Create Webinar
```
POST /api/webinars
Headers: { Authorization: Bearer <token> }
Body: { title, description, date, time, ... }
Response: { webinar }
```

## Chat

### Get Conversations
```
GET /api/chat/conversations
Headers: { Authorization: Bearer <token> }
Response: { conversations: [] }
```

### Get Messages
```
GET /api/chat/conversations/:id/messages
Headers: { Authorization: Bearer <token> }
Response: { messages: [] }
```

### Send Message
```
POST /api/chat/messages
Headers: { Authorization: Bearer <token> }
Body: { conversation_id, content }
Response: { message }
```

## Notifications

### Get Notifications
```
GET /api/notifications
Headers: { Authorization: Bearer <token> }
Response: { notifications: [] }
```

### Mark as Read
```
PUT /api/notifications/:id/read
Headers: { Authorization: Bearer <token> }
Response: { notification }
```

## Data Structures

### User
```typescript
{
  id: string;
  email: string;
  full_name: string;
  role: 'founder' | 'investor' | 'expert' | 'admin';
  bio?: string;
  location?: string;
  subscription_tier: 'free' | 'pro' | 'elite';
  created_at: string;
  updated_at: string;
}
```

### Startup
```typescript
{
  id: string;
  name: string;
  description: string;
  stage: string;
  industry: string;
  website?: string;
  pitch_deck?: string;
  pitch_video?: string;
  visibility: 'public' | 'private';
  founder_id: string;
  created_at: string;
}
```

### Notification
```typescript
{
  id: string;
  type: 'funding' | 'session' | 'review' | 'connection' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  action_url?: string;
}
```

## Error Responses

### Standard Error
```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

### Error Codes
- `AUTH_ERROR`: Authentication failed
- `VALIDATION_ERROR`: Invalid input
- `NOT_FOUND`: Resource not found
- `PERMISSION_DENIED`: Insufficient permissions
- `NETWORK_ERROR`: Network issue

