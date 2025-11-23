# User Credentials & Test Accounts

## ⚠️ Important Security Notice

**These are test credentials for development purposes only.**
- Never use these credentials in production
- Change all passwords before deployment
- Use strong, unique passwords in production
- Enable 2FA for all production accounts

## 🔐 Test User Accounts

These credentials are available directly on the login page for easy access.

### Founder Test Account
```
Email: founder@nextignition.com
Password: Founder123!
Role: Founder
Subscription: Pro
Description: Startup founder with Pro subscription
```

### Co-founder Test Account
```
Email: cofounder@nextignition.com
Password: CoFounder123!
Role: Co-founder
Subscription: Elite
Description: Co-founder with Elite subscription
```

### Investor Test Account
```
Email: investor@nextignition.com
Password: Investor123!
Role: Investor
Subscription: Elite
Description: Angel investor with Elite subscription
```

### Expert Test Account
```
Email: expert@nextignition.com
Password: Expert123!
Role: Expert
Subscription: Pro
Description: Business advisor with Pro subscription
```

### Admin Test Account
```
Email: admin@nextignition.com
Password: Admin123!
Role: Admin
Subscription: Elite
Description: Platform administrator
```

## 🧪 Development Credentials

### Local Development
```
Supabase URL: http://localhost:54321
Supabase Key: (local development key)
```

### Test Environment
```
Supabase URL: (test environment URL)
Supabase Key: (test environment key)
```

## 📝 Default Passwords Pattern

For test accounts, use the pattern:
```
[Role]123!
```

Examples:
- Founder: `Founder123!`
- Co-founder: `CoFounder123!`
- Investor: `Investor123!`
- Expert: `Expert123!`
- Admin: `Admin123!`

## 🚀 Quick Access

All test credentials are available directly on the login page:
1. Go to the login screen
2. Click on "🧪 Test Credentials" section
3. Expand to see all available accounts
4. Tap any credential card to auto-fill the login form
5. Click "Sign In" to login

## 🔑 API Keys (Development)

### Supabase Keys
```
ANON_KEY: (development anon key)
SERVICE_ROLE_KEY: (development service key)
```

### Third-Party Services
```
Stripe Test Key: pk_test_...
SendGrid API Key: SG.test...
```

## 🗄️ Database Credentials

### Development Database
```
Host: localhost
Port: 5432
Database: nextignition_dev
User: postgres
Password: (local password)
```

### Test Database
```
Host: (test host)
Port: 5432
Database: nextignition_test
User: (test user)
Password: (test password)
```

## 🔐 Password Requirements

### Minimum Requirements
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters recommended

### Strong Password Example
```
MySecureP@ssw0rd2024!
```

## 🛡️ Security Best Practices

### For Development
1. Use test credentials only
2. Never commit real credentials
3. Use environment variables
4. Rotate test passwords regularly

### For Production
1. Use strong, unique passwords
2. Enable 2FA for all accounts
3. Regular password rotation
4. Monitor for breaches
5. Use password managers

## 📋 Credential Management

### Environment Variables
Store credentials in `.env` file (gitignored):
```
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Secret Management
- Use secret management services
- Never hardcode credentials
- Rotate keys regularly
- Monitor access logs

## 🔄 Password Reset

### Test Account Reset
1. Use "Forgot Password" flow
2. Enter test email
3. Check test email inbox
4. Reset password

### Production Reset
1. User requests reset
2. System sends secure link
3. User sets new password
4. Password updated

## 🧪 Testing Scenarios

### Authentication Testing
- Login with valid credentials
- Login with invalid credentials
- Password reset flow
- Email verification
- Session management

### Role-Based Testing
- Test each role's access
- Verify role restrictions
- Test role switching (if applicable)

## 📞 Support Credentials

### Support Test Account
```
Email: support@test.nextignition.com
Password: TestSupport123!
Role: Support
```

## ⚠️ Production Checklist

Before going to production:
- [ ] Change all default passwords
- [ ] Enable 2FA for admin accounts
- [ ] Set up proper secret management
- [ ] Configure secure API keys
- [ ] Set up monitoring and alerts
- [ ] Review access logs
- [ ] Implement password policies
- [ ] Set up backup authentication

## 🔍 Credential Verification

### Verify Test Accounts
1. Login with test credentials
2. Verify role access
3. Test features
4. Confirm permissions

### Verify Production Accounts
1. Use production credentials
2. Test authentication
3. Verify security settings
4. Confirm access controls

## 📚 Related Documentation

- [User Credentials & Authentication](./01-user-credentials.md)
- [Security Settings](./06-core-features.md#4-security-settings)
- [Deployment Guide](./16-deployment.md)

