# VPS Deployment Guide

## Environment Variables

Create `.env` file in production:

```bash
# Database
DATABASE_URL="file:./prod.db"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret-key-here"

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="eu-west-3"
AWS_BUCKET_NAME="vola-health-istanbul"

# Environment
NODE_ENV="production"
PORT=3000
```

## Deployment Steps

1. Connect to VPS: `ssh root@203.161.50.62`
2. Install Node.js, PM2, Nginx
3. Clone repository
4. Install dependencies
5. Setup database
6. Build application
7. Configure Nginx
8. Start with PM2

## PM2 Commands

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
``` 