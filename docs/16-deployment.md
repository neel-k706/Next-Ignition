# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Expo CLI installed
- Expo account
- iOS/Android development setup (for mobile)

## Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Run on Device
- **iOS**: Scan QR code with Camera app
- **Android**: Scan QR code with Expo Go app
- **Web**: Press 'w' in terminal

## Building for Production

### Web Build
```bash
npm run build:web
```

Output: `dist/` folder

### iOS Build
```bash
eas build --platform ios
```

### Android Build
```bash
eas build --platform android
```

## Deployment Options

### Web Deployment

#### Vercel
1. Install Vercel CLI
2. Run `vercel`
3. Follow prompts

#### Netlify
1. Install Netlify CLI
2. Run `netlify deploy`
3. Configure build settings

### Mobile Deployment

#### App Store (iOS)
1. Build with EAS
2. Submit to App Store Connect
3. Review and release

#### Google Play (Android)
1. Build with EAS
2. Upload to Google Play Console
3. Review and release

## Environment Variables

### Development
- `.env.local` (gitignored)
- Local Supabase instance

### Production
- Set in deployment platform
- Production Supabase instance
- API keys and secrets

## Database Setup

### Supabase Migration
1. Run migrations:
```bash
supabase migration up
```

2. Seed data (optional):
```bash
supabase db seed
```

## Security Checklist

- [ ] Environment variables secured
- [ ] API keys not in code
- [ ] HTTPS enabled
- [ ] Authentication configured
- [ ] Database secured
- [ ] Error handling in place
- [ ] Logging configured

## Monitoring

### Error Tracking
- Set up error tracking (Sentry, etc.)
- Monitor production errors
- Set up alerts

### Analytics
- Configure analytics
- Track user behavior
- Monitor performance

## Maintenance

### Regular Updates
- Update dependencies
- Security patches
- Feature updates

### Backup
- Database backups
- File storage backups
- Configuration backups

## Troubleshooting

### Common Issues
- **Build failures**: Check dependencies
- **Runtime errors**: Check logs
- **Performance**: Optimize assets
- **Authentication**: Verify credentials

### Support
- Check documentation
- Review error logs
- Contact support team

