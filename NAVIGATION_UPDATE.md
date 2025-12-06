# Role-Based Navigation Update

## Overview

Updated the bottom tab navigation to display role-specific tabs based on the user's role.

## Changes Made

### File Modified

- `app/(tabs)/_layout.tsx`

### Navigation Structure by Role

#### **Founder / Co-founder**

Bottom Navigation Tabs (visible):

1. **Home** - Dashboard/main screen
2. **Network** - Connect with other users
3. **Chat** - Messaging
4. **Funding** - Funding portal and applications
5. **Find Experts** - Mentorship/find experts
6. **Profile** - User profile

Hidden from Navigation:

- ❌ Opportunities (investor-only feature)
- ❌ Device Management (not accessible)
- ❌ Startup Detail (investor view)

#### **Investor**

Bottom Navigation Tabs (visible):

1. **Home** - Dashboard/main screen
2. **Network** - Connect with other users
3. **Chat** - Messaging
4. **Funding** - View funding applications
5. **Opportunities** - Investment opportunities
6. **Profile** - User profile

Hidden from Navigation:

- ❌ Find Experts/Mentorship (founder-specific)
- ❌ Device Management (not accessible)
- ❌ Startup Detail (hidden from nav, accessible via routes)

#### **Expert**

Bottom Navigation Tabs (visible):

1. **Home** - Dashboard/main screen
2. **Network** - Connect with other users
3. **Chat** - Messaging
4. **Profile** - User profile

Hidden from Navigation:

- ❌ Funding (not applicable to experts)
- ❌ Opportunities (investor-only)
- ❌ Find Experts/Mentorship (they are the experts)
- ❌ Device Management (not accessible)
- ❌ Startup Detail (not needed)

### Technical Implementation

```typescript
// Added UserRole type import
import type { UserRole } from '@/types/user';

// Get user role from profile
const { session, loading, profile } = useAuth();
const userRole = profile?.role as UserRole | undefined;

// Conditional href based on role
<Tabs.Screen
  name="funding"
  options={{
    href:
      userRole === 'founder' ||
      userRole === 'cofounder' ||
      userRole === 'investor'
        ? '/funding'
        : null,
    // ... other options
  }}
/>;
```

### New Tab: Find Experts (Mentorship)

Added "Find Experts" tab for founders:

- Label: "Find Experts"
- Icon: Users (lucide-react-native)
- Route: `/mentorship`
- Visible only for: founders and co-founders

### Hidden Screens

All these screens are still accessible via navigation but hidden from the bottom tab bar:

- device-management
- startup-detail
- funding-status
- pitch-upload
- pitch-video
- webinars
- documents
- feed
- reviews
- payment
- subscription
- startup-profile
- notifications
- expert-profile
- expert-sessions
- expert-analytics
- host-webinar
- investor-profile
- startup-discovery
- settings
- help
- security
- schedule-meeting
- request-mentorship
- sessions

## Testing

To test the navigation:

1. **As Founder:**

   - Login with founder account
   - Should see: Home, Network, Chat, Funding, Find Experts, Profile
   - Should NOT see: Opportunities

2. **As Investor:**

   - Login with investor account
   - Should see: Home, Network, Chat, Funding, Opportunities, Profile
   - Should NOT see: Find Experts

3. **As Expert:**
   - Login with expert account
   - Should see: Home, Network, Chat, Profile
   - Should NOT see: Funding, Opportunities, Find Experts

## Navigation Flow

Founders can access:

- ✅ Home → Founder Dashboard
- ✅ Network → Connect with investors/experts
- ✅ Chat → Messaging
- ✅ Funding → Submit funding applications
- ✅ Find Experts → Browse and request mentorship
- ✅ Profile → View/edit startup profile

## Notes

- All screens remain accessible via programmatic navigation (router.push)
- Only the bottom tab visibility is controlled by role
- The `href: null` option hides screens from the tab bar while keeping them routable
- Role is determined from `profile.role` in the AuthContext
