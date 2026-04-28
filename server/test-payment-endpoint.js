#!/usr/bin/env node

/**
 * Payment Endpoint Test Script
 * Test payment creation and verification without the frontend
 * Usage: node test-payment-endpoint.js
 */

import 'dotenv/config.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const API_URL = process.env.API_URL || 'http://localhost:5000';
const JWT_SECRET = process.env.JWT_SECRET;

// Test configuration
const testUserId = '507f1f77bcf86cd799439011'; // Dummy MongoDB ObjectId
const testPlan = 'basic';

console.log('='.repeat(70));
console.log('Payment Endpoint Test Script');
console.log('='.repeat(70));

console.log('\nConfiguration:');
console.log(`- API URL: ${API_URL}`);
console.log(`- Test Plan: ${testPlan}`);
console.log(`- JWT Secret Set: ${JWT_SECRET ? 'Yes' : 'No'}`);

if (!JWT_SECRET) {
    console.error('\n✗ ERROR: JWT_SECRET not configured in .env');
    process.exit(1);
}

// Create a test JWT token
const testToken = jwt.sign(
    { id: testUserId },
    JWT_SECRET,
    { expiresIn: '24h' }
);

console.log(`- Test Token: ${testToken.substring(0, 30)}...`);

// Test 1: Check server is running
async function testServerHealth() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 1: Server Health Check');
    console.log('='.repeat(70));

    try {
        const response = await axios.get(`${API_URL}/`);
        console.log('✓ Server is running');
        console.log(`  Response: ${response.data}`);
        return true;
    } catch (error) {
        console.error('✗ Server health check failed');
        console.error(`  Error: ${error.message}`);
        return false;
    }
}

// Test 2: Test Create Order Endpoint
async function testCreateOrder() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 2: Create Payment Order');
    console.log('='.repeat(70));

    try {
        const response = await axios.post(
            `${API_URL}/api/payment/createorder`,
            { subscriptionType: testPlan },
            {
                headers: {
                    'Cookie': `token=${testToken}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        );

        if (response.data.success) {
            console.log('✓ Order creation successful');
            console.log(`  Order ID: ${response.data.order.id}`);
            console.log(`  Amount: ${response.data.order.amount / 100} INR`);
            console.log(`  Currency: ${response.data.order.currency}`);
            console.log(`  Razorpay Key: ${response.data.key}`);
            return response.data;
        } else {
            console.error('✗ Order creation failed');
            console.error(`  Message: ${response.data.message}`);
            return null;
        }
    } catch (error) {
        console.error('✗ Create order endpoint failed');
        console.error(`  Status: ${error.response?.status}`);
        console.error(`  Message: ${error.response?.data?.message || error.message}`);
        console.error(`  Error: ${error.response?.data?.error}`);
        return null;
    }
}

// Test 3: Test Verify Payment (with mock data)
async function testVerifyPayment() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 3: Verify Payment Signature');
    console.log('='.repeat(70));

    console.log('Note: This test demonstrates signature verification');
    console.log('In production, this would be called after Razorpay payment');

    // You would normally get these from Razorpay's webhook or payment response
    const mockData = {
        razorpay_order_id: 'order_test_12345',
        razorpay_payment_id: 'pay_test_12345',
        razorpay_signature: 'test_signature'
    };

    try {
        const response = await axios.post(
            `${API_URL}/api/payment/verifypayment`,
            {
                ...mockData,
                subscriptionType: testPlan
            },
            {
                headers: {
                    'Cookie': `token=${testToken}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        );

        console.log('Response:', response.data);
    } catch (error) {
        console.log('Expected error (mock payment data):');
        console.log(`  Status: ${error.response?.status}`);
        console.log(`  Message: ${error.response?.data?.message}`);
        console.log('This is expected because we\'re using mock payment data');
    }
}

// Test 4: Check Environment Variables
function testEnvironmentVariables() {
    console.log('\n' + '='.repeat(70));
    console.log('TEST 4: Environment Variables');
    console.log('='.repeat(70));

    const requiredVars = [
        'RAZORPAY_KEY_ID',
        'RAZORPAY_KEY_SECRET',
        'JWT_SECRET',
        'MONGODB_URI',
    ];

    const optionalVars = [
        'CLIENT_URL',
        'FRONTEND_URL',
        'GROQ_API_KEY',
        'EMAIL_USER',
        'EMAIL_PASS',
    ];

    console.log('\nRequired Variables:');
    let allSet = true;
    requiredVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            const displayValue = varName.includes('SECRET') || varName.includes('PASS')
                ? '[SET]'
                : value.substring(0, 20) + (value.length > 20 ? '...' : '');
            console.log(`  ✓ ${varName}: ${displayValue}`);
        } else {
            console.log(`  ✗ ${varName}: NOT SET`);
            allSet = false;
        }
    });

    console.log('\nOptional Variables:');
    optionalVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            console.log(`  ✓ ${varName}: SET`);
        } else {
            console.log(`  - ${varName}: not set (optional)`);
        }
    });

    return allSet;
}

// Run all tests
async function runAllTests() {
    const startTime = Date.now();

    // Test environment
    const envOk = testEnvironmentVariables();

    if (!envOk) {
        console.log('\n' + '='.repeat(70));
        console.log('⚠️  Required environment variables missing!');
        console.log('Configure your .env file and try again.');
        console.log('='.repeat(70));
        process.exit(1);
    }

    // Test server
    const serverOk = await testServerHealth();

    if (!serverOk) {
        console.log('\n' + '='.repeat(70));
        console.log('✗ Server is not running!');
        console.log('Start the server with: npm run dev');
        console.log('='.repeat(70));
        process.exit(1);
    }

    // Test order creation
    const orderData = await testCreateOrder();

    if (orderData) {
        // Test verification (with mock data)
        await testVerifyPayment();
    }

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n' + '='.repeat(70));
    console.log('Test Summary');
    console.log('='.repeat(70));
    console.log(`✓ All tests completed in ${duration}s`);

    if (orderData) {
        console.log('\nPayment system is working correctly!');
        console.log('\nNext steps:');
        console.log('1. Test the payment flow in the browser');
        console.log('2. Complete a test payment using Razorpay test card');
        console.log('3. Verify the subscription is activated');
        console.log('4. Check MongoDB for payment records');
    } else {
        console.log('\nPayment system needs configuration.');
        console.log('Check the error messages above and fix the issues.');
    }

    console.log('='.repeat(70));
}

// Run tests
runAllTests().catch(error => {
    console.error('\nTest script error:', error.message);
    process.exit(1);
});
