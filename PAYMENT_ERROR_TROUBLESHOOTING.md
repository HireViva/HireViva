# Payment Error (500) Troubleshooting Guide

## Error: AxiosError: Request failed with status code 500

This error typically occurs when the payment endpoint on the server returns an internal server error.

---

## Quick Diagnosis

### Step 1: Check Server Logs
```bash
# If running locally
npm run dev

# If deployed on Render
# Go to Render Dashboard → Select Service → Logs
# Look for error messages starting with "Create order error" or "Verify payment error"
```

### Step 2: Check Configuration
```bash
# In server directory, run:
node check-payment-config.js

# This will verify:
# ✓ Razorpay keys are set
# ✓ MongoDB connection
# ✓ JWT secret configured
# ✓ CORS settings
```

### Step 3: Test Payment Endpoint
```bash
# Install curl or use Postman
# Get your authentication token first

curl -X POST http://localhost:5000/api/payment/createorder \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN_HERE" \
  -d '{"subscriptionType": "basic"}'

# Should return something like:
# {"success": true, "order": {...}, "key": "rzp_test_..."}
```

---

## Common Causes & Solutions

### 1. Razorpay Credentials Not Set

**Error Message**: 
```
"Payment system not configured. Please contact support."
```

**Root Cause**: 
- `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET` not in environment variables

**Solution**:
```bash
# Development (local)
cd server
nano .env
# Add:
RAZORPAY_KEY_ID=rzp_test_XXXXX
RAZORPAY_KEY_SECRET=your_secret_key

# Production (Render)
1. Go to Render Dashboard → Service Settings → Environment
2. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
3. Restart the service
```

---

### 2. User Not Authenticated

**Error Message**: 
```
"User ID not found. Please login again."
```

**Root Cause**:
- User JWT token missing or invalid
- CORS not allowing credentials

**Solution**:
```bash
# Check 1: Ensure you're logged in
1. Go to your app
2. You should see user profile/name
3. If not, login first

# Check 2: Verify CORS credentials configuration
# In server.js, confirm:
app.use(cors({
    origin: ...allowed domains...,
    credentials: true,  // ← This must be true
    ...
}));

# Check 3: Verify client sends credentials
# In client/src/api.js, confirm:
const api = axios.create({
  baseURL,
  withCredentials: true,  // ← This must be true
  ...
});
```

---

### 3. Invalid or Missing Razorpay Key ID

**Error Message in Browser Console**:
```
"Please sign in or provide a valid key"
```

**Root Cause**:
- Razorpay key is malformed or wrong type (test vs live)
- Key not matching between backend and frontend

**Solution**:
```bash
# Verify on Razorpay Dashboard:
1. https://dashboard.razorpay.com/
2. Settings → API Keys
3. Copy the correct Key ID (should look like: rzp_test_xxxxx or rzp_live_xxxxx)

# Update in your environment:
VITE_RAZORPAY_KEY_ID=rzp_test_SEKB3nwC0hfLqP  # Frontend
RAZORPAY_KEY_ID=rzp_test_SEKB3nwC0hfLqP       # Backend (must match)
```

---

### 4. MongoDB Connection Failed

**Error Message**:
```
"Failed to create order"
"PaymentModel is not connected to database"
```

**Root Cause**:
- MongoDB URI incorrect
- Database not running
- IP not whitelisted (for MongoDB Atlas)

**Solution**:
```bash
# Development (local)
1. Start MongoDB locally:
   mongod
   
2. Verify connection in server/.env:
   MONGODB_URI=mongodb://localhost:27017/hireviva

# Production (MongoDB Atlas)
1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Whitelist
3. Add your server's IP or 0.0.0.0/0
4. Get connection string and verify it's correct:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hireviva
   
5. Test connection:
   mongosh "your_connection_string"
```

---

### 5. Payment Model Not Found in Database

**Error Message**:
```
"Failed to verify payment"
"PaymentModel is not connected"
```

**Root Cause**:
- Payment collection doesn't exist
- Model file not imported correctly
- Mongoose schema issue

**Solution**:
```bash
# Check 1: Verify Payment model is imported
# In server/controllers/paymentController.js:
import Payment from '../models/paymentModel.js';  // ← Check this exists

# Check 2: Ensure model file exists
ls server/models/paymentModel.js  # Should exist

# Check 3: Recreate payment record
# Try payment flow again - it will create the collection
```

---

### 6. JWT Secret Not Configured

**Error Message**:
```
"Failed to verify JWT"
"Authentication failed"
```

**Root Cause**:
- `JWT_SECRET` not set in environment

**Solution**:
```bash
# Development
cd server
echo "JWT_SECRET=your_super_secret_key" >> .env

# Production (Render)
1. Render Dashboard → Service Settings → Environment
2. Add: JWT_SECRET=generate_strong_random_string
3. Restart service

# Generate a secure random string:
# Option 1 (Node):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2 (Linux):
openssl rand -hex 32
```

---

### 7. Port Issue

**Error Message**:
```
"Cannot connect to server"
```

**Root Cause**:
- Server not running on correct port
- Port already in use

**Solution**:
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process using port
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use a different port
PORT=5001 npm run dev
```

---

### 8. CORS Policy Blocking Request

**Error Message** (in browser console):
```
"Access to XMLHttpRequest at 'http://...' from origin 'http://...' has been blocked by CORS policy"
```

**Root Cause**:
- Frontend domain not in CORS whitelist
- Credentials not being sent

**Solution**:
```bash
# Update server/server.js:
const allowedOrigins = [
    'http://localhost:5173',  // Development frontend
    'https://hireviva.vercel.app',  // Production frontend
    process.env.CLIENT_URL,  // From environment
];

# For production, make sure in Render env vars:
CLIENT_URL=https://hireviva.vercel.app
FRONTEND_URL=https://hireviva.vercel.app

# Verify client is sending credentials:
# In client/src/api.js:
const api = axios.create({
  baseURL,
  withCredentials: true,  // ← MUST be true
  ...
});
```

---

### 9. Environment Variables Not Loaded

**Error Message**:
```
"Cannot read property 'RAZORPAY_KEY_ID' of undefined"
```

**Root Cause**:
- .env file not in correct location
- dotenv not imported
- Wrong variable name

**Solution**:
```bash
# Check 1: Verify .env file exists
ls server/.env  # Should exist

# Check 2: Verify dotenv is imported
# In server/server.js:
import 'dotenv/config.js';  // ← Should be at top

# Check 3: Use correct variable names
# .env uses: RAZORPAY_KEY_ID=...
# Code uses: process.env.RAZORPAY_KEY_ID

# Check 4: Restart server after .env changes
# Node doesn't reload .env automatically
npm run dev  # or restart the process
```

---

### 10. Subscription Plan Not Configured

**Error Message**:
```
"Invalid plan. Must be 'basic' or 'pro'."
```

**Root Cause**:
- Plan name doesn't match configuration
- Subscription plan not defined

**Solution**:
```bash
# Check in server/config/subscriptionPlans.js:
export const SUBSCRIPTION_PLANS = {
    free: { ... },
    basic: { ... },  // ← Must exist
    pro: { ... }     // ← Must exist
};

# Valid plans are: "free", "basic", "pro"
# Make sure frontend sends exact plan ID
```

---

## Step-by-Step Debugging Process

### 1. Enable Debug Logging
```bash
# In server .env:
DEBUG=*
NODE_ENV=development

npm run dev
```

### 2. Add Detailed Logging
```javascript
// In paymentController.js, add console.logs:
console.log('Received plan:', plan);
console.log('Received userId:', userId);
console.log('Environment variables check:');
console.log('- RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING');
console.log('- RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'MISSING');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'MISSING');
```

### 3. Test with Postman
```
POST http://localhost:5000/api/payment/createorder
Headers:
  Content-Type: application/json
  Cookie: token=YOUR_JWT_TOKEN

Body:
{
  "subscriptionType": "basic"
}

Should return:
{
  "success": true,
  "order": { ... },
  "key": "rzp_test_..."
}
```

### 4. Check All Logs
- Browser console (F12)
- Server terminal
- MongoDB Atlas logs
- Razorpay webhook logs

---

## Production Deployment Issues

### After Deploying to Render

#### Test Payment Configuration
```bash
# Run this command on Render:
node server/check-payment-config.js

# Or SSH into Render and run:
npm run check-payment
```

#### Check Render Logs
```
Render Dashboard → Select Service → Logs
Scroll down to see recent requests and errors
```

#### Common Production Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 502 Bad Gateway | Server crashed | Check Render logs, restart service |
| Timeout | Slow DB connection | Check MongoDB Atlas connection string |
| 503 Service Unavailable | Service sleeping | Upgrade from free tier or keep service active |
| CORS errors | Wrong frontend URL | Update CLIENT_URL in Render env vars |
| Payment fails | Using test keys in production | Update to LIVE Razorpay keys |

---

## Testing Checklist

- [ ] Run `node check-payment-config.js`
- [ ] All checks pass (green ✓)
- [ ] Can login to app
- [ ] Can navigate to pricing page
- [ ] Click "Get Started" on a plan
- [ ] Razorpay modal opens
- [ ] Enter test card: 4111 1111 1111 1111
- [ ] Payment processes successfully
- [ ] Subscription activates
- [ ] Can see subscription in user profile

---

## Need More Help?

1. **Check the logs**: Most errors are in server logs
2. **Run the config check**: `node check-payment-config.js`
3. **Test the endpoint**: Use Postman to test `/api/payment/createorder`
4. **Review ENV_SETUP_GUIDE.md**: Comprehensive setup guide
5. **Check DEPLOYMENT_GUIDE.md**: Production deployment steps

---

## Key Files to Check

- `server/.env` - Environment variables
- `server/controllers/paymentController.js` - Payment logic
- `server/routes/paymentRoutes.js` - API routes
- `server/config/razorpay.config.js` - Razorpay setup
- `client/src/api.js` - API client configuration
- `client/src/components/PricingModal.jsx` - Frontend payment UI
- `server/server.js` - CORS configuration
