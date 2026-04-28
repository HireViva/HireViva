# HireViva Environment Setup Guide

## Overview
This guide covers setting up environment variables for development and production deployment on Vercel and Render.

## Server Environment Variables

### Required Variables
All variables in `.env.example` must be set for the application to work properly.

### Development Setup
1. Copy `.env.example` to `.env` in the server folder:
```bash
cd server
cp .env.example .env
```

2. Fill in your actual credentials:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/hireviva
JWT_SECRET=your-super-secret-key-for-jwt
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Production Deployment

### Render Deployment

1. **Create Render Service**
   - Go to https://render.com/
   - Create new "Web Service"
   - Connect your GitHub repository

2. **Set Environment Variables on Render**
   - Go to Service Settings → Environment
   - Add the following variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://your-production-db-uri
   JWT_SECRET=your-production-jwt-secret
   RAZORPAY_KEY_ID=rzp_live_xxxxx  (NOT TEST)
   RAZORPAY_KEY_SECRET=production-key-secret
   RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
   CLIENT_URL=https://hireviva.vercel.app
   FRONTEND_URL=https://hireviva.vercel.app
   GROQ_API_KEY=production-groq-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-app-password
   ```

3. **Important: Use LIVE Razorpay Keys in Production**
   - Test keys start with `rzp_test_`
   - Live keys start with `rzp_live_`
   - Never use test keys in production

### Vercel Client Deployment

1. **Client Environment Variables**
   - Go to Vercel → Project Settings → Environment Variables
   - Add:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

2. **Update Vercel Configuration**
   - Ensure `client/vercel.json` is configured correctly:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist"
   }
   ```

## CORS Configuration

The server now supports:
- Development origins (localhost:5173, localhost:8080)
- Vercel production domain (*.vercel.app)
- Custom Render backend URL
- Credentials are properly handled

The CORS configuration in `server.js` automatically handles:
- Wildcard Vercel domains
- Custom CLIENT_URL and FRONTEND_URL env vars
- Proper credentials in all environments

## Payment System Setup

### Razorpay Configuration

1. **Test Mode** (Development)
   - Use test keys from https://dashboard.razorpay.com/
   - Test keys won't charge actual money
   - Perfect for development and testing

2. **Live Mode** (Production)
   - Switch to live keys on Razorpay dashboard
   - Update Render environment variables
   - Update Vercel environment variables
   - Ensure webhooks are configured in Razorpay dashboard

### Webhook Configuration

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-render-backend-url/api/payment/webhook`
3. Set webhook events:
   - payment.captured
   - payment.failed
   - refund.processed
4. Add webhook secret to `.env` as `RAZORPAY_WEBHOOK_SECRET`

## Verification Checklist

Before deploying to production:

- [ ] MongoDB connection string is correct
- [ ] Razorpay keys are LIVE keys (not test)
- [ ] JWT_SECRET is a strong, random value
- [ ] All email credentials are correct
- [ ] GROQ_API_KEY is configured
- [ ] Render backend URL is set in Vercel env vars
- [ ] CORS origins are properly configured
- [ ] Webhook secret is added to Razorpay
- [ ] Database is whitelisted to allow connections from Render IP

## Troubleshooting

### 500 Error on Payment
- Check if Razorpay credentials are configured
- Verify JWT_SECRET matches between server and client
- Check MongoDB connection
- Check Render logs for detailed error messages

### CORS Errors
- Ensure VITE_API_URL matches your Render backend URL
- Check that backend has correct CLIENT_URL env var
- Ensure credentials are being sent properly

### Payment Verification Fails
- Verify Razorpay webhook secret is correct
- Check if using correct API keys (test vs live)
- Ensure payment record exists in database

## Database Backup

For production MongoDB:
1. Use MongoDB Atlas backup options
2. Set up regular backups
3. Keep backup credentials secure

## SSL/HTTPS

Both Vercel and Render provide free SSL certificates automatically.
No additional configuration needed.

## Monitoring

1. Set up error tracking (e.g., Sentry)
2. Monitor payment failures in dashboard
3. Set up email alerts for critical errors

## Support

For issues:
1. Check Render logs: Service → Logs
2. Check Vercel logs: Deployments → Function Logs
3. Check MongoDB Atlas logs: Monitoring → Logs
4. Check Razorpay webhook logs: Webhooks → View Logs
