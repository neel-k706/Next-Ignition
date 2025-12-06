# Testing Guide - Dynamic Features

## 🧪 Complete Testing Checklist

### Prerequisites

1. ✅ Migration file applied to Supabase
2. ✅ Storage bucket "pitch-materials" created
3. ✅ Storage RLS policies applied
4. ✅ App running with valid Supabase credentials

---

## 1. Test Subscription System

### Test User: neelkayasth2645@gmail.com

**Expected Plan:** PRO

#### Steps:

1. Login with `neelkayasth2645@gmail.com`
2. Navigate to Profile tab
3. Scroll to "Subscription" section

**✅ Success Criteria:**

- Shows "PRO" plan (not FREE)
- Status shows "ACTIVE"
- Description shows "Advanced features including pitch materials"

#### Test Premium Features:

1. Go to Founder Dashboard
2. Click "Upload Pitch Deck"
3. Click "Record Pitch Video"

**✅ Success Criteria:**

- Should navigate to upload screens (no "Upgrade required" message)
- Features are unlocked

### Test Free User

**Create a new account or use different email**

#### Steps:

1. Register new user or login with different account
2. Check Profile > Subscription

**✅ Success Criteria:**

- Shows "FREE" plan
- Clicking "Upload Pitch Deck" shows "Upgrade required" alert
- Clicking "Record Pitch Video" shows "Upgrade required" alert

---

## 2. Test Dynamic Dashboard Stats

### Founder Dashboard

Navigate to: `/(tabs)/index` or Home tab

**✅ Success Criteria:**

- "Connections" shows real count from database (not hardcoded 12)
- "Active Chats" shows real count (not hardcoded 3)
- "Investor Views" shows real count (not hardcoded 5)

#### How to Verify:

1. Open Supabase Dashboard
2. Check `connections` table - count accepted connections for your user
3. Check `conversation_members` table - count conversations for your user
4. Check `pitch_materials` + `investor_views` - count views

**Numbers should match exactly**

---

## 3. Test Real-time Chat

### Send Message Test

1. Navigate to Chat tab
2. Select or create a conversation
3. Type a message and send

**✅ Success Criteria:**

- Message appears immediately
- Check Supabase `messages` table - new row inserted
- `sender_id` matches your user ID
- `content` matches what you typed

### Real-time Subscription Test

1. Open app on two devices/browsers with different accounts
2. Start conversation between them
3. Send message from Device A

**✅ Success Criteria:**

- Message appears on Device B without refresh
- Real-time subscription working

---

## 4. Test Notifications

### Mark as Read

1. Navigate to Notifications tab
2. Tap a notification

**✅ Success Criteria:**

- Notification marked as read in UI
- Check Supabase `notifications` table - `read` column updated to `true`
- Unread count decreases

### Delete Notification

1. Swipe or use delete action
2. Check database

**✅ Success Criteria:**

- Notification removed from list
- Row deleted from `notifications` table

### Real-time Notification

1. Manually insert a notification in Supabase:

```sql
INSERT INTO public.notifications (profile_id, type, title, body, read)
VALUES (
  'YOUR-USER-ID-HERE',
  'system',
  'Test Notification',
  'This is a test notification',
  false
);
```

**✅ Success Criteria:**

- Notification appears in app without refresh
- Unread count increments

---

## 5. Test Profile Data

### View Profile

Navigate to Profile tab

**✅ Success Criteria:**

- Name shows from `profiles.full_name`
- Email shows from `profiles.email`
- Role badge shows from `profiles.role`
- Location shows from `profiles.location` (if set)
- Subscription shows real plan from joined query

### Edit Profile

1. Tap Edit button
2. Update name or bio
3. Save

**✅ Success Criteria:**

- Check `profiles` table - data updated
- Profile screen reflects changes
- No need to refresh app

---

## 6. Test Pitch Materials (When Upload UI Built)

### Upload Pitch Deck

**Note:** Requires Pro plan or higher

1. Upload a PDF file
2. Check Supabase Storage bucket `pitch-materials`
3. Check `pitch_materials` table

**✅ Success Criteria:**

- File uploaded to storage at path: `{user_id}/decks/{timestamp}_{filename}`
- Row created in `pitch_materials` table
- `type` = 'deck'
- `storage_path` points to uploaded file
- `url` contains public URL

### Delete Pitch Material

1. Delete a pitch deck/video
2. Check storage and database

**✅ Success Criteria:**

- File removed from storage
- Row deleted from `pitch_materials` table

---

## 7. Test Startup Profile

### View Startup Details

1. Navigate to Startup Profile
2. Check if data loads

**✅ Success Criteria:**

- Fetches from `startup_profiles` table
- Shows real startup name, stage, industry
- Pitch deck/video URLs (if uploaded)
- Visibility toggle persisted

### Update Startup Info

1. Edit startup details
2. Save changes

**✅ Success Criteria:**

- `startup_profiles` table updated
- Changes reflected immediately

---

## 8. Database Verification

### Manual Checks in Supabase

#### Subscriptions Table

```sql
SELECT
  p.full_name,
  p.email,
  s.plan_key,
  s.status,
  pl.name as plan_name
FROM profiles p
LEFT JOIN subscriptions s ON s.profile_id = p.id
LEFT JOIN plans pl ON pl.key = s.plan_key
WHERE p.email = 'neelkayasth2645@gmail.com';
```

**Expected:**

- plan_key: 'pro'
- status: 'active'
- plan_name: 'Pro'

#### Stats Query

```sql
-- Connections
SELECT COUNT(*) FROM connections
WHERE (requester_id = 'YOUR-USER-ID' OR target_id = 'YOUR-USER-ID')
AND status = 'accepted';

-- Conversations
SELECT COUNT(*) FROM conversation_members
WHERE profile_id = 'YOUR-USER-ID';

-- Pitch Materials
SELECT COUNT(*) FROM pitch_materials
WHERE owner_profile_id = 'YOUR-USER-ID';

-- Notifications (Unread)
SELECT COUNT(*) FROM notifications
WHERE profile_id = 'YOUR-USER-ID' AND read = false;
```

**Dashboard numbers should match these queries**

---

## 9. Performance Testing

### Load Time Test

1. Clear app cache
2. Login
3. Navigate to Dashboard

**✅ Success Criteria:**

- Stats load within 1-2 seconds
- No infinite loading states
- Errors logged in console if queries fail

### Refresh Test

1. Pull to refresh on Dashboard
2. Observe loading state

**✅ Success Criteria:**

- Both dashboard data AND stats refresh
- Loading indicator shows briefly
- Data updates correctly

---

## 10. Error Handling

### No Internet Test

1. Disable internet
2. Navigate to Dashboard

**✅ Success Criteria:**

- Shows loading state or error message
- Doesn't crash app
- Reconnecting restores functionality

### Invalid Subscription Test

1. Manually delete subscription in Supabase:

```sql
DELETE FROM subscriptions WHERE profile_id = 'YOUR-USER-ID';
```

2. Refresh app

**✅ Success Criteria:**

- Defaults to FREE plan
- No crashes
- Premium features locked

---

## 🎯 Quick Smoke Test (5 minutes)

1. ✅ Login as test user (neelkayasth2645@gmail.com)
2. ✅ Profile shows PRO plan
3. ✅ Dashboard shows real numbers (not 12, 3, 5)
4. ✅ Chat loads conversations from database
5. ✅ Send a message - appears in Supabase
6. ✅ Notifications load from database
7. ✅ Mark notification as read - updates database
8. ✅ Upload buttons don't show "Upgrade required"

---

## 🐛 Common Issues & Solutions

### Issue: Stats show 0 for everything

**Solution:**

- Check if tables exist in Supabase
- Verify migration ran successfully
- Check RLS policies allow read access

### Issue: Subscription shows FREE instead of PRO

**Solution:**

- Check `subscriptions` table has entry for user
- Verify email matches exactly: `neelkayasth2645@gmail.com`
- Check migration DO block executed successfully

### Issue: Chat messages don't appear

**Solution:**

- Check `messages` table exists
- Verify Supabase Realtime is enabled
- Check console for errors

### Issue: "Upgrade required" shows for Pro user

**Solution:**

- Verify subscription loaded in `useSubscription` hook
- Check `permissions.canUploadPitchDeck` is true
- Console log `currentPlanKey` to debug

---

## ✅ Final Verification

Run this checklist after testing:

- [ ] Test user has PRO plan visible
- [ ] Dashboard stats are dynamic
- [ ] Chat sends/receives messages
- [ ] Notifications work and update database
- [ ] Profile shows real subscription data
- [ ] Premium features unlocked for Pro users
- [ ] Premium features locked for Free users
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] App doesn't crash on any screen

**If all checked:** Your dynamic transformation is complete! 🎉
