#!/usr/bin/env node

/**
 * Payment System Debugging Script
 * Run this to verify your payment configuration
 */

import 'dotenv/config.js';

console.log('='.repeat(60));
console.log('HireViva Payment System Configuration Check');
console.log('='.repeat(60));

const checks = [];

// Check 1: Razorpay Keys
console.log('\n[1] Razorpay Configuration:');
if (process.env.RAZORPAY_KEY_ID) {
  const keyType = process.env.RAZORPAY_KEY_ID.startsWith('rzp_live') ? 'LIVE' : 'TEST';
  console.log(`    ✓ Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID.substring(0, 15)}... (${keyType})`);
  checks.push(true);
} else {
  console.log('    ✗ RAZORPAY_KEY_ID not set');
  checks.push(false);
}

if (process.env.RAZORPAY_KEY_SECRET) {
  console.log('    ✓ Razorpay Key Secret: [SET]');
  checks.push(true);
} else {
  console.log('    ✗ RAZORPAY_KEY_SECRET not set');
  checks.push(false);
}

// Check 2: MongoDB
console.log('\n[2] Database Configuration:');
if (process.env.MONGODB_URI) {
  const dbName = process.env.MONGODB_URI.split('/').pop();
  console.log(`    ✓ MongoDB URI: [SET] (Database: ${dbName})`);
  checks.push(true);
} else {
  console.log('    ✗ MONGODB_URI not set');
  checks.push(false);
}

// Check 3: JWT
console.log('\n[3] Authentication Configuration:');
if (process.env.JWT_SECRET) {
  console.log('    ✓ JWT Secret: [SET]');
  checks.push(true);
} else {
  console.log('    ✗ JWT_SECRET not set');
  checks.push(false);
}

// Check 4: CORS
console.log('\n[4] CORS Configuration:');
if (process.env.CLIENT_URL) {
  console.log(`    ✓ CLIENT_URL: ${process.env.CLIENT_URL}`);
  checks.push(true);
} else {
  console.log('    ! CLIENT_URL not set (CORS will use default development origins)');
  checks.push(true);
}

if (process.env.FRONTEND_URL) {
  console.log(`    ✓ FRONTEND_URL: ${process.env.FRONTEND_URL}`);
  checks.push(true);
} else {
  console.log('    ! FRONTEND_URL not set (CORS will use default development origins)');
  checks.push(true);
}

// Check 5: Email
console.log('\n[5] Email Configuration:');
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  console.log(`    ✓ Email: ${process.env.EMAIL_USER}`);
  checks.push(true);
} else {
  console.log('    ! Email not configured (optional)');
  checks.push(true);
}

// Check 6: Environment
console.log('\n[6] Deployment Environment:');
const env = process.env.NODE_ENV || 'development';
console.log(`    Environment: ${env}`);
if (env === 'production') {
  console.log('    ⚠️  WARNING: Production mode detected');
  if (!process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live')) {
    console.log('    ✗ ERROR: Using test Razorpay keys in PRODUCTION!');
    checks.push(false);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
const passed = checks.filter(c => c).length;
const total = checks.length;

if (passed === total) {
  console.log(`✓ All ${total} checks passed!`);
  console.log('\nYour payment system is properly configured.');
  console.log('\nNext steps:');
  console.log('1. Test payment flow in development');
  console.log('2. If errors occur, check the logs');
  console.log('3. Deploy to Render/Vercel');
  console.log('4. Test payment flow in production');
} else {
  console.log(`✗ ${total - passed} of ${total} checks failed!`);
  console.log('\nPlease fix the configuration above before deploying.');
  console.log('\nFor help, see ENV_SETUP_GUIDE.md');
}

console.log('='.repeat(60));

// Exit with error code if checks failed
process.exit(passed === total ? 0 : 1);
