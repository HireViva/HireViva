# HireViva Payment Fix - Quick Start Guide

## What Was Fixed

Your payment system had several issues causing the 500 error:

1. ✓ **CORS Configuration**: Enhanced to handle Vercel, Render, and development domains properly
2. ✓ **Payment Error Handling**: Added better error messages and validation
3. ✓ **Environment Variables**: Improved configuration for production
4. ✓ **Client API**: Better error handling and fallback URLs for production
5. ✓ **Credential Validation**: Added checks for missing Razorpay keys
6. ✓ **User Authentication**: Better validation of JWT tokens

---

## Steps to Fix Your Payment System

### Step 1: Update Server Environment (CRITICAL)

```bash
cd server

# Check your .env file - must have these:
cat .env
```

**Required in `.env`:**
```
RAZORPAY_KEY_ID=rzp_test_SEKB3nwC0hfLqP
RAZORPAY_KEY_SECRET=your_secret_here
JWT_SECRET=any_random_string_here
MONGODB_URI=mongodb://localhost:27017/hireviva
```

If any are missing, add them:
```bash
# Open .env and add missing variables
nano .env
```

### Step 2: Run Configuration Check

```bash
# From server directory
node check-payment-config.js
```

**Expected output:**
```
✓ Razorpay Key ID: rzp_test_... (TEST)
✓ Razorpay Key Secret: [SET]
✓ MongoDB URI: [SET] (Database: hireviva)
✓ JWT Secret: [SET]
✓ CLIENT_URL: http://localhost:5173
✓ All checks passed!
```

**If any fail**, the script tells you exactly what to fix.

### Step 3: Restart Server

```bash
# Kill existing server (Ctrl+C)
# Then restart:
npm run dev

# You should see:
# Server is running on port 5000
```

### Step 4: Test Payment Endpoint

```bash
# In another terminal, from server directory:
node test-payment-endpoint.js

# You should see:
# ✓ Server is running
# ✓ Order creation successful
# Order ID: order_1234567890
```

If this fails, check the error message and refer to [PAYMENT_ERROR_TROUBLESHOOTING.md](PAYMENT_ERROR_TROUBLESHOOTING.md).

### Step 5: Test in Browser

1. Open your app: http://localhost:5173
2. **Login first** (this is important!)
3. Click on a pricing plan → "Get Started"
4. Razorpay modal should appear
5. Use test card: `4111 1111 1111 1111` (any future date, any CVC)
6. Click Pay
7. Should see success message

**If you get 500 error:**
- Check server terminal for error messages
- Run `node check-payment-config.js` again
- See [PAYMENT_ERROR_TROUBLESHOOTING.md](PAYMENT_ERROR_TROUBLESHOOTING.md)

---

## For Production Deployment

### Deploy to Render (Backend)

1. Go to https://render.com/
2. Create "New Web Service"
3. Connect your GitHub repo
4. Set **Environment Variables**:
```
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY  (NOT TEST!)
RAZORPAY_KEY_SECRET=your_live_secret
JWT_SECRET=generate_random_string
MONGODB_URI=your_production_mongodb_uri
CLIENT_URL=https://hireviva.vercel.app
FRONTEND_URL=https://hireviva.vercel.app
```

5. Deploy
6. Copy your backend URL (e.g., `https://hireviva-api.onrender.com`)

### Deploy to Vercel (Frontend)

1. Go to https://vercel.com/
2. Import your GitHub repo
3. Set **Environment Variables**:
```
VITE_API_URL=https://hireviva-api.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
VITE_GOOGLE_CLIENT_ID=your_google_id
```

4. Deploy

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.**

---

## Common Issues & Quick Fixes

### Issue: "Payment system not configured"
```bash
# Fix: Add Razorpay keys to .env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### Issue: "Please login to subscribe"
```bash
# Fix: Make sure you're logged in
# Then try payment again
# Keys are only sent to authenticated users for security
```

### Issue: "Cannot connect to server"
```bash
# Fix: Check if server is running
# Terminal should show: "Server is running on port 5000"
# If not, start it: npm run dev
```

### Issue: CORS Error in Console
```bash
# Fix: Ensure VITE_API_URL matches server URL
# Development: http://localhost:5000
# Production: https://hireviva-api.onrender.com
```

### Issue: "Razorpay is not defined"
```bash
# Wait a moment - Razorpay script loads asynchronously
# If persists, check browser console for script errors
```

---

## Verification Checklist

Run through this before considering payment system ready:

- [ ] `node check-payment-config.js` shows all green ✓
- [ ] `node test-payment-endpoint.js` works
- [ ] Can login to app
- [ ] Can see pricing plans
- [ ] Can click "Get Started" and see Razorpay modal
- [ ] Can enter test card and complete payment
- [ ] See success message
- [ ] Can see subscription is activated

---

## Test Razorpay Cards

Use these cards to test payments (in TEST mode only):

| Card Number | Name | Details |
|-------------|------|---------|
| 4111 1111 1111 1111 | Visa | Any future date, any CVC |
| 5555 5555 5555 4444 | Mastercard | Any future date, any CVC |
| 3782 822463 10005 | Amex | Any future date, any CVC |

For test payments, use:
- **Any future date** (e.g., 12/25)
- **Any 3-4 digit CVC** (e.g., 123)
- **Any OTP** (e.g., 123456) - Razorpay will auto-confirm

---

## Files Changed

These files were updated to fix the payment system:

### Backend
- `server/server.js` - Enhanced CORS configuration
- `server/controllers/paymentController.js` - Better error handling
- `server/config/razorpay.config.js` - Credential validation

### Frontend  
- `client/src/api.js` - Production-ready API configuration
- `client/src/components/PricingModal.jsx` - Better error messages
- `client/.env` - Added production notes

### Documentation & Tools
- `ENV_SETUP_GUIDE.md` - Environment setup guide
- `DEPLOYMENT_GUIDE.md` - Production deployment guide
- `PAYMENT_ERROR_TROUBLESHOOTING.md` - Detailed troubleshooting
- `server/check-payment-config.js` - Configuration validator
- `server/test-payment-endpoint.js` - Endpoint tester
- `.env.example` - Example configuration

---

## Next Steps

1. **Immediate**: Run configuration check
   ```bash
   cd server && node check-payment-config.js
   ```

2. **Test locally**: Test payment flow in development
   - Login, go to pricing, try a payment

3. **Deploy to production**: Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

4. **Monitor**: Check logs after deployment to catch any issues

---

## Support & Help

If you're still having issues:

1. **Check the logs**: `node check-payment-config.js`
2. **Test the endpoint**: `node test-payment-endpoint.js`
3. **Read troubleshooting**: [PAYMENT_ERROR_TROUBLESHOOTING.md](PAYMENT_ERROR_TROUBLESHOOTING.md)
4. **Check Razorpay logs**: https://dashboard.razorpay.com/ → Webhooks → Logs

---

## Key Improvements Made

### Security
- Better credential validation
- Improved CORS handling
- Better error messages (no sensitive info exposed)

### Reliability  
- Detailed logging for debugging
- Fallback URLs for production
- Configuration validation

### User Experience
- Better error messages to users
- Graceful error handling
- Smooth payment flow

### Maintainability
- Configuration tools
- Testing scripts
- Comprehensive documentation

---

## Questions?

Refer to:
- `ENV_SETUP_GUIDE.md` - For environment setup
- `DEPLOYMENT_GUIDE.md` - For production deployment
- `PAYMENT_ERROR_TROUBLESHOOTING.md` - For debugging
- `PAYMENT_TROUBLESHOOTING.md` - For payment-specific issues

Run `node check-payment-config.js` to identify any remaining issues.
