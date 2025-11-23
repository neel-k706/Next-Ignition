# User Credentials & Authentication

## Overview

NextIgnition uses secure authentication with email/password and optional social login. All credentials are encrypted and stored securely.

## 🔐 Authentication Flows

### 1. User Registration

#### Step 1: Sign Up
- Navigate to `/register`
- Enter email address
- Create password (minimum 8 characters)
- Confirm password
- Accept terms and conditions
- Click "Sign Up"

#### Step 2: Email Verification
- Check email inbox for verification link
- Click verification link
- Account activated

#### Step 3: Role Selection
After email verification, select your role:
- **Founder/Co-founder**: Building a startup
- **Investor**: Looking to invest
- **Expert/Advisor**: Providing mentorship
- **Admin**: Platform administrator (invite only)

#### Step 4: Profile Setup
- Complete basic profile information
- Add profile picture (optional)
- Set location
- Add bio/description

### 2. Login Flow

#### Standard Login
1. Navigate to `/login`
2. Enter registered email
3. Enter password
4. Click "Sign In"
5. Redirected to role-specific dashboard

#### Remember Me
- Check "Remember me" to stay logged in
- Session persists for 30 days
- Can be revoked from Settings > Security

#### Forgot Password
1. Click "Forgot Password?" on login screen
2. Enter registered email
3. Check email for reset link
4. Click link and set new password
5. Login with new password

### 3. Password Management

#### Change Password
1. Go to Settings > Security
2. Click "Change Password"
3. Enter current password
4. Enter new password (min 8 characters)
5. Confirm new password
6. Click "Change Password"

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters recommended

#### Reset Password (Forgot)
1. Go to Login screen
2. Click "Forgot Password?"
3. Enter email address
4. Check email for reset link
5. Click link (valid for 1 hour)
6. Enter new password
7. Confirm new password
8. Password updated

### 4. Two-Factor Authentication (2FA)

#### Enable 2FA (Future Feature)
1. Go to Settings > Security
2. Toggle "Two-Factor Authentication"
3. Scan QR code with authenticator app
4. Enter verification code
5. 2FA enabled

#### Disable 2FA
1. Go to Settings > Security
2. Toggle off "Two-Factor Authentication"
3. Enter password to confirm
4. 2FA disabled

### 5. Device Management

#### View Active Devices
1. Go to Settings > Security > Device Management
2. View list of all devices
3. See last active time for each device

#### Remove Device
1. Go to Settings > Security > Device Management
2. Click "Remove" next to device
3. Confirm removal
4. Device logged out

#### Current Device
- Marked with "Current" badge
- Cannot be removed (must logout first)

### 6. Session Management

#### Active Sessions
- Sessions persist for 30 days (if "Remember me" checked)
- Sessions expire after 7 days of inactivity
- Multiple devices can be logged in simultaneously

#### Logout
- Click profile menu > "Sign Out"
- Or go to Settings > Security > Sign Out
- All sessions on current device terminated

#### Force Logout All Devices
1. Go to Settings > Security
2. Click "Sign Out All Devices"
3. Confirm action
4. All devices logged out

## 🔒 Security Best Practices

### Password Security
- Use unique password (not used elsewhere)
- Change password every 90 days
- Don't share password with anyone
- Use password manager

### Account Security
- Enable 2FA when available
- Review active devices regularly
- Logout from shared devices
- Report suspicious activity immediately

### Email Security
- Use secure email address
- Don't share verification/reset links
- Links expire after 1 hour
- Report phishing attempts

## 📧 Email Notifications

### Account-Related Emails
- Welcome email (on registration)
- Email verification
- Password reset
- Password changed
- New device login
- Security alerts

### Email Preferences
- Go to Settings > Notifications
- Toggle email notifications on/off
- Choose notification types

## 🚨 Account Recovery

### Lost Access
If you lose access to your account:

1. **Forgot Password**
   - Use "Forgot Password?" flow
   - Reset via email

2. **Lost Email Access**
   - Contact support@nextignition.com
   - Provide account details
   - Identity verification required

3. **Account Compromised**
   - Contact support immediately
   - Change password immediately
   - Review active devices
   - Enable 2FA

## 🔑 API Authentication

### Access Tokens
- JWT tokens for API access
- Tokens expire after 24 hours
- Refresh tokens for extended sessions
- Revocable from Settings

### API Keys (Future)
- Generate API keys for integrations
- Manage from Settings > API Keys
- Rotate keys regularly

## 📱 Social Login (Future)

### Supported Providers
- Google
- LinkedIn
- GitHub

### Social Login Flow
1. Click social login button
2. Authorize NextIgnition
3. Account created/linked
4. Redirected to dashboard

## 🛡️ Privacy & Data

### Data Collection
- Email address (required)
- Password (encrypted)
- Profile information (optional)
- Usage analytics (anonymized)

### Data Protection
- All passwords encrypted (bcrypt)
- HTTPS for all connections
- Regular security audits
- GDPR compliant

### Data Deletion
- Request account deletion from Settings
- All data permanently deleted within 30 days
- Cannot be recovered

## 📞 Support

For authentication issues:
- Email: support@nextignition.com
- Help Center: In-app Help section
- Response time: Within 24 hours

