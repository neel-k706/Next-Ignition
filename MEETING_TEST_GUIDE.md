# Testing the Meeting Scheduler

## Quick Test

### 1. Start Your App

```bash
npx expo start
```

### 2. Navigate to Schedule Meeting

- Open your app in Expo Go or browser
- Login with your account
- Navigate to the "Schedule Meeting" screen

### 3. Fill the Form

- **Meeting Title**: "Test Video Call"
- **Description**: "Testing the new meeting scheduler"
- **Participant Email**: Your own email (for testing)
- **Date**: Tomorrow
- **Time**: Any time
- **Duration**: 30 minutes

### 4. Submit

Click "Schedule Meeting" button

### 5. Check Results

#### ✅ Success Indicators:

1. **Alert Message**: "Meeting Scheduled! 🎉"
2. **Email Received**: Check your inbox (participant email)
3. **Calendar Entry**: Check if you can see it in Google Calendar (if you're the organizer)

#### 📧 Email Should Contain:

- Meeting title and description
- Date and time
- Duration
- **"Join Video Meeting" button**
- Jitsi Meet link (https://meet.jit.si/next-ignition-xxxxx)
- Information about Jitsi

#### 🔍 Database Check:

Go to Supabase → Table Editor → `meetings` table
You should see a new row with:

- Your meeting details
- `meeting_platform`: "jitsi"
- `meeting_url`: The Jitsi link
- `google_calendar_event_id`: The Google Calendar event ID

### 6. Test the Video Call

1. Click the link in the email
2. Browser opens to Jitsi Meet
3. Enter your name
4. Click "Join Meeting"
5. You should be in the video room!

## Debugging

### If the meeting doesn't schedule:

#### 1. Check Supabase Logs

1. Go to https://app.supabase.com
2. Select your project
3. Click "Edge Functions" in the sidebar
4. Click "schedule-meeting"
5. Click "Logs" tab
6. Look for error messages

#### 2. Check Console Logs

Look at your terminal/console for error messages from the app:

```
=== Edge Function Response ===
Data: ...
Error: ...
```

#### 3. Verify Secrets

```bash
npx supabase secrets list
```

Should show:

- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_PRIVATE_KEY
- RESEND_API_KEY (optional)

### Common Issues:

#### "Unauthorized" Error

**Cause**: Not logged in or session expired
**Solution**: Log out and log back in

#### "Google service account credentials not configured"

**Cause**: Secrets not set in Supabase
**Solution**: Run the setup script:

```powershell
.\setup-meeting-scheduler.ps1
```

#### "Failed to send email invitation"

**Cause**: Resend API key not set or invalid
**Solution**:

1. Sign up at https://resend.com
2. Get API key
3. Set it: `npx supabase secrets set RESEND_API_KEY="re_xxxxx"`

#### Email not received

**Possible causes**:

- Email in spam folder
- Invalid Resend API key
- Email address typo
- Resend domain not verified

**Solution**: Check Supabase logs for email sending errors

#### Calendar event not created

**Cause**: Google Calendar API error
**Solution**: Check Supabase logs for the exact error from Google

### Edge Function Test (Advanced)

Test the edge function directly using curl:

```bash
# Get your Supabase URL and anon key from .env or Supabase dashboard
# Get your JWT token from the app (console.log it after login)

curl -X POST 'YOUR_SUPABASE_URL/functions/v1/schedule-meeting' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "meetingData": {
      "title": "Test Meeting",
      "description": "Testing edge function",
      "participantEmail": "test@example.com",
      "scheduledAt": "2025-12-04T15:00:00Z",
      "duration": 30,
      "timezone": "UTC"
    }
  }'
```

Expected response:

```json
{
  "success": true,
  "meeting": { ... },
  "calendarEventId": "...",
  "meetLink": "https://meet.jit.si/next-ignition-xxxxx"
}
```

## Success Checklist

After a successful test, you should have:

- ✅ Meeting saved in database
- ✅ Email sent to participant
- ✅ Jitsi meeting link generated
- ✅ Calendar event created (visible in Google Calendar)
- ✅ Video room accessible via link

## Next Steps

Once testing is successful:

1. Test with a real participant (different email)
2. Actually join the video call together
3. Test different durations and times
4. Test with longer descriptions
5. Schedule multiple meetings to verify uniqueness

## Support

If you encounter issues:

1. Check `MEETING_SCHEDULER_SOLUTION.md` for detailed documentation
2. Review Supabase Edge Function logs
3. Check the app console for JavaScript errors
4. Verify all environment variables are set correctly
