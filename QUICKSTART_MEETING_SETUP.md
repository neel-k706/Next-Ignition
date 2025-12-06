# ✅ QUICK START: Meeting Scheduler Setup

## 🎯 What I've Implemented

I've created a complete meeting scheduling system with:

- ✅ Database schema (meetings table)
- ✅ Supabase Edge Function for Google Calendar integration
- ✅ React Native UI with date/time pickers
- ✅ Email notifications via Resend
- ✅ Automatic Google Meet link generation

## 📝 What YOU Need to Do (Step-by-Step)

### Step 1: Run Database Migration (5 minutes)

1. **Open Supabase Dashboard**: https://supabase.com/dashboard
2. **Go to**: SQL Editor
3. **Copy** the file: `supabase/migrations/20251202000001_create_meetings_table.sql`
4. **Paste** into SQL Editor and click **"Run"**
5. **Verify**: Check Table Editor → You should see "meetings" table

---

### Step 2: Get Google Calendar API Credentials (15 minutes)

#### 2.1: Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click "Select a project" → "NEW PROJECT"
3. Name: `Next-Ignition-Meetings`
4. Click "CREATE"

#### 2.2: Enable Google Calendar API

1. Navigate: APIs & Services → Library
2. Search: "Google Calendar API"
3. Click "ENABLE"

#### 2.3: Create Service Account (Easiest Method)

1. Navigate: APIs & Services → Credentials
2. Click: "CREATE CREDENTIALS" → "Service Account"
3. Name: `meeting-scheduler`
4. Role: "Editor"
5. Click "DONE"
6. Click on the service account name
7. Go to "KEYS" tab
8. Click "ADD KEY" → "Create new key" → "JSON"
9. **Download and save the JSON file securely!**

#### 2.4: Extract Credentials from JSON

Open the downloaded JSON file and copy these values:

```json
{
  "client_email": "meeting-scheduler@project-id.iam.gserviceaccount.com",  ← Copy this
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"  ← Copy this
}
```

---

### Step 3: Get Resend API Key (5 minutes)

1. Go to: https://resend.com/
2. Sign up (free tier is enough for testing)
3. Navigate: Dashboard → API Keys
4. Click "Create API Key"
5. Name: `Next Ignition`
6. **Copy the API key** (starts with `re_`)

---

### Step 4: Configure Supabase Secrets (10 minutes)

#### Method A: Using Supabase Dashboard

1. Go to: Supabase Dashboard → Edge Functions
2. Click on "Manage secrets"
3. Add these secrets:

```bash
RESEND_API_KEY=re_your_api_key_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=meeting-scheduler@your-project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
(paste your private key here - keep the line breaks!)
-----END PRIVATE KEY-----
```

#### Method B: Using Supabase CLI (Advanced)

```bash
supabase secrets set RESEND_API_KEY=re_your_api_key
supabase secrets set GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
supabase secrets set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```

---

### Step 5: Deploy Edge Function (5 minutes)

#### 5.1: Install Supabase CLI

```bash
npm install -g supabase
```

#### 5.2: Login

```bash
supabase login
```

#### 5.3: Link Your Project

```bash
supabase link --project-ref your-project-ref
```

(Find your project ref in Supabase Dashboard → Settings → API)

#### 5.4: Deploy the Function

```bash
supabase functions deploy schedule-meeting
```

---

### Step 6: Test the Feature (5 minutes)

1. **Reload your app**
2. **Navigate** to any startup detail page
3. **Click** "Schedule Meeting"
4. **Fill in**:
   - Title: "Test Meeting"
   - Participant Email: your-email@gmail.com
   - Select date (tomorrow)
   - Select time (any time in future)
   - Duration: 30 minutes
5. **Click** "Schedule Meeting"

#### ✅ Success Indicators:

- Meeting appears in Supabase `meetings` table
- Email received at participant email
- Google Calendar event created
- Google Meet link included

---

## 🔧 Troubleshooting

### "Function not found"

- **Solution**: Redeploy the edge function

```bash
supabase functions deploy schedule-meeting
```

### "Google Calendar API error"

- **Solution**:
  1. Verify Calendar API is enabled
  2. Check service account email is correct
  3. Ensure private key has no extra spaces

### "Email not sent"

- **Solution**:
  1. Check RESEND_API_KEY is correct
  2. For testing, emails from Resend go to the email you signed up with
  3. Check Resend Dashboard → Logs for errors

### "Unauthorized"

- **Solution**: Make sure user is logged in before scheduling

---

## 📚 Files Created

✅ **Database**:

- `supabase/migrations/20251202000001_create_meetings_table.sql`

✅ **Edge Function**:

- `supabase/functions/schedule-meeting/index.ts`

✅ **React Native**:

- `hooks/useMeetings.ts`
- Updated: `app/(tabs)/schedule-meeting.tsx`

✅ **Documentation**:

- `docs/MEETING_SETUP_GUIDE.md` (Detailed guide)

---

## 🎨 Features Included

✅ **Google Calendar Integration**

- Automatic calendar event creation
- Google Meet link generation
- Reminders (1 day before, 30 min before)

✅ **Email Notifications**

- Beautiful HTML email templates
- Meeting details included
- Direct link to join meeting

✅ **Database Storage**

- All meetings saved in Supabase
- RLS policies for security
- Upcoming meetings view

✅ **Mobile & Web Support**

- Date/time pickers work on both platforms
- Responsive design
- Platform-specific optimizations

---

## ⏱️ Total Setup Time: ~45 minutes

### Time Breakdown:

- Database migration: 5 min
- Google Cloud setup: 15 min
- Resend setup: 5 min
- Supabase secrets: 10 min
- Deploy function: 5 min
- Testing: 5 min

---

## 🚀 Next Steps (Optional)

### Phase 2 Enhancements:

- [ ] Meeting reminders (push notifications)
- [ ] Zoom integration (alternative to Google Meet)
- [ ] Meeting recording
- [ ] Calendar sync (iCal format)
- [ ] Meeting notes feature
- [ ] Recurring meetings

---

## 📞 Need Help?

1. Check `docs/MEETING_SETUP_GUIDE.md` for detailed instructions
2. Review Supabase Edge Function logs
3. Check Resend Dashboard for email delivery status
4. Verify Google Calendar API is enabled

---

## ✅ Setup Checklist

Copy this checklist and check off as you complete each step:

```
[ ] Step 1: Database migration run successfully
[ ] Step 2: Google Cloud project created
[ ] Step 2: Google Calendar API enabled
[ ] Step 2: Service account created
[ ] Step 2: JSON key file downloaded
[ ] Step 3: Resend account created
[ ] Step 3: Resend API key obtained
[ ] Step 4: RESEND_API_KEY secret set in Supabase
[ ] Step 4: GOOGLE_SERVICE_ACCOUNT_EMAIL secret set
[ ] Step 4: GOOGLE_PRIVATE_KEY secret set
[ ] Step 5: Supabase CLI installed
[ ] Step 5: Project linked
[ ] Step 5: Edge function deployed
[ ] Step 6: Test meeting created successfully
[ ] Step 6: Email received
[ ] Step 6: Calendar event created
```

---

**Once all items are checked, your meeting scheduler is fully operational!** 🎉
