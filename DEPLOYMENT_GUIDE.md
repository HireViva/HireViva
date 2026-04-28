# HireViva Deployment Guide for Vercel + Render

## Overview
This guide provides step-by-step instructions to deploy HireViva:
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render.com (Node.js + Express)
- **Database**: MongoDB Atlas
- **Payments**: Razorpay

---

## PART 1: Backend Setup on Render

### Step 1: Prepare Your Repository
```bash
# Ensure your server has all dependencies
cd server
npm install

# Create .env file with production variables
cp .env.example .env
# Edit .env with your credentials
```

### Step 2: Create Render Account
1. Go to https://render.com/
2. Sign up with GitHub
3. Create new "Web Service"

### Step 3: Connect GitHub Repository
1. Click "Create +" → "Web Service"
2. Select your GitHub repository
3. Configure build settings:
   - **Name**: hireviva-api
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `node server/server.js`
   - **Root Directory**: (leave empty)

### Step 4: Set Environment Variables on Render
In Render dashboard → Service Settings → Environment:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hireviva
JWT_SECRET=generate_a_strong_random_string_here
RAZORPAY_KEY_ID=rzp_live_your_live_key_here
RAZORPAY_KEY_SECRET=your_live_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
CLIENT_URL=https://hireviva.vercel.app
FRONTEND_URL=https://hireviva.vercel.app
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
ADMIN_EMAIL=admin@hireviva.com
```

**Important**: Use **LIVE** Razorpay keys, not test keys!

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://hireviva-api.onrender.com`)

### Step 6: Configure Render Database IP Whitelist
For MongoDB Atlas security:
1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Whitelist
3. Add Render's IP: `0.0.0.0/0` (or your specific IP if available)

---

## PART 2: Frontend Setup on Vercel

### Step 1: Deploy Frontend
```bash
# Make sure you're in client directory
cd client

# Verify build works
npm run build

# Should generate dist/ folder
```

### Step 2: Create Vercel Account
1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click "New Project"

### Step 3: Import Project
1. Select your GitHub repository
2. Configure project:
   - **Framework**: Vite
   - **Root Directory**: `./client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 4: Set Environment Variables on Vercel
In Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_URL=https://hireviva-api.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Important**: 
- Use the Render backend URL you copied in Part 1
- Use **LIVE** Razorpay key (not test)

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your frontend will be at `https://hireviva.vercel.app`

---

## PART 3: Payment System Configuration

### Razorpay Setup

#### Get Live Keys
1. Go to https://dashboard.razorpay.com/
2. Switch to "Production" mode (toggle in top-right)
3. Go to Settings → API Keys
4. Copy **Key ID** and **Key Secret**

#### Configure Webhooks
1. Go to Settings → Webhooks
2. Click "Add Webhook"
3. **Webhook URL**: `https://hireviva-api.onrender.com/api/payment/webhook`
4. **Events**: Select:
   - payment.authorized
   - payment.failed
   - refund.created
   - refund.processed
5. Copy webhook **Secret** and add to Render env vars as `RAZORPAY_WEBHOOK_SECRET`

#### Test Webhook (Optional)
1. In webhooks list, find your webhook
2. Click "Test"
3. Check Render logs to verify it received the webhook

---

## PART 4: Database Setup (MongoDB Atlas)

### Create MongoDB Cluster
1. Go to https://www.mongodb.com/cloud/atlas/
2. Create new cluster
3. Choose free M0 tier
4. Go to Deployment → Databases
5. Click "Browse Collections" and create database named `hireviva`

### Get Connection String
1. Click "Connect"
2. Choose "Connect Your Application"
3. Select Node.js driver
4. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/hireviva`

### Update Render Env Var
1. Go to Render Service → Environment Variables
2. Update `MONGODB_URI` with your connection string

---

## PART 5: CORS Configuration Verification

### Why CORS is Pre-configured
The backend has been updated to automatically handle:
- Vercel domains (*.vercel.app)
- Render backend domain
- Development domains (localhost)
- Custom domains via env vars

### Verify CORS Works
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to subscribe in PricingModal
4. Check if request to `/api/payment/createorder` succeeds
5. Should NOT see CORS errors

### If CORS Errors Occur
Add these to Render environment:
```
CLIENT_URL=https://hireviva.vercel.app
FRONTEND_URL=https://hireviva.vercel.app
```

---

## PART 6: Email Configuration

### Gmail Setup (Optional but Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Set in Render env vars:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

---

## PART 7: Testing After Deployment

### Test Payment Flow
1. Go to deployed frontend: https://hireviva.vercel.app
2. Click on a pricing plan
3. Complete payment flow
4. **Use Razorpay test card**: 4111 1111 1111 1111

### Check Logs
- **Render Logs**: Service → Logs
- **Vercel Logs**: Deployments → Function Logs
- **MongoDB**: Monitoring → Logs

### Common Issues & Solutions

#### 500 Error on Payment
```
Solution:
1. Check Render logs for error details
2. Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set
3. Verify MONGODB_URI is correct
4. Check JWT_SECRET is set
```

#### CORS Error
```
Solution:
1. Verify VITE_API_URL in Vercel matches Render URL
2. Check CLIENT_URL in Render matches Vercel URL
3. Clear browser cache and try again
```

#### Payment Verification Fails
```
Solution:
1. Verify RAZORPAY_KEY_SECRET is correct
2. Check webhook configuration in Razorpay dashboard
3. Verify you're using LIVE keys, not test keys
```

#### Database Connection Error
```
Solution:
1. Verify MONGODB_URI in Render
2. Add Render IP to MongoDB whitelist
3. Check MongoDB cluster is running
```

---

## PART 8: Monitoring & Maintenance

### Set Up Error Tracking (Optional)
1. Install Sentry: `npm install @sentry/node`
2. Add to server.js:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: process.env.NODE_ENV,
});
```

### Regular Backups
1. MongoDB Atlas → Backup
2. Set up daily backups
3. Test restore procedures monthly

### Monitor Performance
- Render: Metrics → CPU, Memory, Disk
- Vercel: Analytics → Web Vitals
- Razorpay: Webhooks → View Logs

---

## PART 9: Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] Razorpay keys are LIVE (rzp_live_), not test
- [ ] MongoDB connection is working
- [ ] CORS is properly configured
- [ ] Email system is working
- [ ] Webhooks are configured in Razorpay
- [ ] SSL certificates are active (auto on Vercel/Render)
- [ ] Database backups are enabled
- [ ] Error logging is configured
- [ ] Payment flow has been tested end-to-end

---

## Quick Reference: URLs After Deployment

- **Frontend**: https://hireviva.vercel.app
- **Backend API**: https://hireviva-api.onrender.com/api
- **Backend Health**: https://hireviva-api.onrender.com/
- **Razorpay Dashboard**: https://dashboard.razorpay.com/
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Render Dashboard**: https://dashboard.render.com/
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## Support & Troubleshooting

### Check Service Status
- Render: https://status.render.com/
- Vercel: https://www.vercel-status.com/
- Razorpay: https://status.razorpay.com/

### Debug Steps
1. Check browser console (F12) for frontend errors
2. Check Render logs for backend errors
3. Check MongoDB Atlas logs for database errors
4. Check Razorpay webhook logs for payment errors

### Get Help
- Render Support: https://render.com/docs/
- Vercel Support: https://vercel.com/support
- Razorpay Support: https://razorpay.com/support/
- MongoDB Support: https://www.mongodb.com/support/
