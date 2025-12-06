# Meeting Scheduler Debug Guide

## Step 1: Check Supabase Edge Function Logs

1. Go to: https://supabase.com/dashboard/project/gatwoxtvedjgdxahgzkw/functions/schedule-meeting/logs

2. Click on the most recent error (red entry)

3. Look for console.log/console.error messages that show:
   - "=== Schedule Meeting Function Started ==="
   - "User authenticated: [email]"
   - "Meeting data received: [data]"
   - Any error messages

## Step 2: What to Look For in Logs

### If you see "Google service account credentials not configured":

- Your secrets are not set correctly in Supabase
- Go to Settings → Edge Functions → Manage Secrets
- Verify GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY are set

### If you see "Failed to get access token":

- The private key format is wrong
- Or the service account email is wrong
- Or Calendar API is not enabled

### If you see "Google Calendar API error: 403":

- Calendar API not enabled
- OR service account doesn't have calendar access
- Solution: Share your Google Calendar with the service account email

### If you see "Google Calendar API error: 404":

- Using wrong calendar ID
- Should use "primary" or your actual calendar ID

### If you DON'T see any logs at all:

- The function was not deployed
- Go redeploy it from the dashboard

## Step 3: Most Common Issues

1. **Function not deployed with latest code**

   - Redeploy from: https://supabase.com/dashboard/project/gatwoxtvedjgdxahgzkw/functions/schedule-meeting

2. **Secrets not set**

   - Go to: https://supabase.com/dashboard/project/gatwoxtvedjgdxahgzkw/settings/functions
   - Click "Manage secrets"
   - Add:
     - GOOGLE_SERVICE_ACCOUNT_EMAIL
     - GOOGLE_PRIVATE_KEY (with \n as literal characters, not newlines)
     - RESEND_API_KEY (optional for now)

3. **Calendar API not enabled**

   - Go to: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=next-ignition-meetings
   - Click "Enable"

4. **Calendar not shared with service account**
   - Go to: https://calendar.google.com/calendar/u/0/r/settings
   - Click on your calendar
   - Scroll to "Share with specific people"
   - Add: meeting-scheduler@next-ignition-meetings.iam.gserviceaccount.com
   - Set permission: "Make changes to events"

## Step 4: After Checking Logs

Tell me EXACTLY what error message you see in the Supabase logs.
