# 🎯 Complete Meeting Scheduler Setup Guide

This guide will help you set up the complete video call scheduling feature with Google Calendar integration and email notifications.

---

## 📋 Table of Contents

1. [Google Calendar API Setup](#google-calendar-api-setup)
2. [Email Service Setup (Resend)](#email-service-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Environment Variables](#environment-variables)
5. [Testing the Feature](#testing-the-feature)

---

## 1. Google Calendar API Setup

### Step 1.1: Create Google Cloud Project

1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Create Project**:
   - Click "Select a project" dropdown
   - Click "NEW PROJECT"
   - Project name: `Next-Ignition-Meetings`
   - Click "CREATE"
   - Wait for project creation (check notifications)

### Step 1.2: Enable Google Calendar API

1. **Navigate**: APIs & Services → Library
2. **Search**: "Google Calendar API"
3. **Click** on "Google Calendar API"
4. **Click**: "ENABLE"
5. **Wait** for API to be enabled

### Step 1.3: Configure OAuth Consent Screen

1. **Navigate**: APIs & Services → OAuth consent screen
2. **Select**: External (unless you have Google Workspace)
3. **Fill in**:
   - App name: `Next Ignition`
   - User support email: Your email
   - Developer contact: Your email
4. **Click**: "SAVE AND CONTINUE"
5. **Scopes**: Skip for now (click "SAVE AND CONTINUE")
6. **Test users**: Add your email
7. **Click**: "SAVE AND CONTINUE"

### Step 1.4: Create OAuth 2.0 Client ID

1. **Navigate**: APIs & Services → Credentials
2. **Click**: "CREATE CREDENTIALS" → "OAuth client ID"
3. **Application type**: Web application
4. **Name**: `Next Ignition Web Client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:8081
   https://your-domain.com
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:8081/auth/callback
   https://your-project-ref.supabase.co/functions/v1/google-calendar-oauth
   ```
7. **Click**: "CREATE"
8. **IMPORTANT**: Copy and save:
   - ✅ Client ID
   - ✅ Client Secret

### Step 1.5: Create Service Account (Alternative Method)

1. **Navigate**: APIs & Services → Credentials
2. **Click**: "CREATE CREDENTIALS" → "Service Account"
3. **Fill in**:
   - Service account name: `meeting-scheduler`
   - Service account ID: `meeting-scheduler`
4. **Click**: "CREATE AND CONTINUE"
5. **Role**: Select "Editor"
6. **Click**: "CONTINUE" → "DONE"
7. **Click** on the created service account
8. **Navigate** to "KEYS" tab
9. **Click**: "ADD KEY" → "Create new key"
10. **Select**: JSON
11. **Click**: "CREATE"
12. **IMPORTANT**: Save the downloaded JSON file securely!

---

## 2. Email Service Setup (Resend)

### Step 2.1: Create Resend Account

1. **Go to**: [Resend](https://resend.com/)
2. **Click**: "Sign Up"
3. **Verify** your email address

### Step 2.2: Get API Key

1. **Navigate**: Dashboard → API Keys
2. **Click**: "Create API Key"
3. **Name**: `Next Ignition Production`
4. **Permissions**: Full Access
5. **Click**: "Add"
6. **IMPORTANT**: Copy and save the API key (starts with `re_`)

### Step 2.3: Add Domain (Recommended)

1. **Navigate**: Domains
2. **Click**: "Add Domain"
3. **Enter**: your domain (e.g., `yourdomain.com`)
4. **Copy** the DNS records shown
5. **Add** these records to your domain's DNS settings:
   ```
   Type: TXT
   Name: _resend
   Value: [provided verification value]
   ```
6. **Wait** for verification (can take 24-48 hours)

**For Testing**: You can use Resend's test email `onboarding@resend.dev` before domain verification.

---

## 3. Supabase Configuration

### Step 3.1: Run Database Migration

1. **Open**: Supabase Dashboard → SQL Editor
2. **Copy** the content from `supabase/migrations/20251202000001_create_meetings_table.sql`
3. **Paste** into SQL Editor
4. **Click**: "Run"
5. **Verify**: Check "Table Editor" → meetings table exists

### Step 3.2: Create Supabase Edge Function

1. **Install** Supabase CLI (if not already):

   ```bash
   npm install -g supabase
   ```

2. **Login**:

   ```bash
   supabase login
   ```

3. **Link** your project:

   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Create** edge function:

   ```bash
   supabase functions new schedule-meeting
   ```

5. **Deploy** the function (we'll create it next):
   ```bash
   supabase functions deploy schedule-meeting
   ```

### Step 3.3: Set Secrets in Supabase

1. **Navigate**: Supabase Dashboard → Edge Functions → Secrets
2. **Add these secrets**:
   ```bash
   RESEND_API_KEY=re_your_api_key_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
   ```

**Note**: For GOOGLE_PRIVATE_KEY, copy from the JSON service account file:

- Open the JSON file
- Copy the entire `private_key` value (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
- Replace `\n` with actual newlines

---

## 4. Environment Variables

### Step 4.1: Create .env.local

Create a file `.env.local` in your project root:

```bash
# Google Calendar API
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_SECRET=your-client-secret

# Resend Email API
EXPO_PUBLIC_RESEND_API_KEY=re_your_api_key

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4.2: Update .gitignore

Make sure `.env.local` is in `.gitignore`:

```
.env.local
.env.*.local
```

---

## 5. Testing the Feature

### Step 5.1: Test Meeting Creation

1. **Login** to your app
2. **Navigate** to a startup detail page
3. **Click**: "Schedule Meeting"
4. **Fill in**:
   - Meeting title
   - Date and time
   - Duration
   - Participant email
5. **Click**: "Schedule Meeting"

### Step 5.2: Verify Integration

**Check these:**

- ✅ Meeting saved in Supabase `meetings` table
- ✅ Google Calendar event created
- ✅ Email sent to participant
- ✅ Meeting link generated (Google Meet)

### Step 5.3: Test Email Delivery

**If using Resend test mode:**

- Check Resend Dashboard → Logs
- View email preview

**If domain verified:**

- Check recipient's inbox
- Verify meeting details in email

---

## 🔧 Troubleshooting

### Google Calendar Issues

**"Access Not Configured"**

- Ensure Google Calendar API is enabled
- Check project is selected correctly

**"Invalid Credentials"**

- Verify Client ID and Secret are correct
- Check redirect URIs match exactly

**"Insufficient Permission"**

- Add required scopes in OAuth consent screen
- Re-authorize the application

### Email Issues

**"Invalid API Key"**

- Verify RESEND_API_KEY is correct
- Check for extra spaces or characters

**"Domain Not Verified"**

- Use `onboarding@resend.dev` for testing
- Complete DNS verification for custom domain

### Database Issues

**"RLS Policy Violation"**

- Verify user is authenticated
- Check `organizer_id` matches `auth.uid()`

**"Column does not exist"**

- Run migration again
- Check Supabase table schema

---

## 📚 Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [Resend Documentation](https://resend.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

## ✅ Setup Checklist

- [ ] Google Cloud project created
- [ ] Google Calendar API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Service account created and JSON downloaded
- [ ] Resend account created
- [ ] Resend API key obtained
- [ ] Database migration run successfully
- [ ] Supabase secrets configured
- [ ] Environment variables set
- [ ] Edge function deployed
- [ ] Test meeting created successfully
- [ ] Email received by participant
- [ ] Calendar event created with Meet link

---

## 🎉 You're Done!

Once all checklist items are complete, your meeting scheduler feature is fully operational!

For support, check the troubleshooting section or refer to the official documentation links above.
