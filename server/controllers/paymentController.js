import { createRazorpayInstance } from '../config/razorpay.config.js';
import Transaction from '../models/Transaction.js';
import userModel from '../models/userModel.js';
import crypto from 'crypto';

// Subscription pricing
const SUBSCRIPTION_PRICES = {
    basic: 299,
    pro: 599
};

// Create order for subscription
export const createOrder = async (req, res) => {
    try {
        const { subscriptionType } = req.body;
        const userId = req.userId; // From auth middleware

        if (!subscriptionType || !['basic', 'pro'].includes(subscriptionType)) {
            return res.status(400).json({ success: false, message: 'Invalid subscription type' });
        }

        const amount = SUBSCRIPTION_PRICES[subscriptionType];
        const razorpayInstance = createRazorpayInstance();

        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: 'INR',
            receipt: `receipt_${subscriptionType}_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                subscriptionType
            }
        };

        const order = await razorpayInstance.orders.create(options);

        // Save transaction record
        await Transaction.create({
            userId,
            subscriptionType,
            amount,
            currency: order.currency,
            orderId: order.id,
            status: 'created',
            receipt: order.receipt
        });

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
};

// Verify payment and activate subscription
export const verifyPayment = async (req, res) => {
    try {
        const { order_id, payment_id, signature, subscriptionType } = req.body;
        const userId = req.userId;

        if (!order_id || !payment_id || !signature) {
            return res.status(400).json({ success: false, message: 'Missing payment details' });
        }

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(`${order_id}|${payment_id}`);
        const expectedSignature = hmac.digest('hex');

        if (expectedSignature !== signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

        // Update transaction
        await Transaction.findOneAndUpdate(
            { orderId: order_id },
            {
                paymentId: payment_id,
                signature,
                status: 'verified'
            },
            { new: true }
        );

        // Update user subscription
        const subscriptionStartDate = new Date();
        const subscriptionEndDate = new Date();
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1); // 1 month subscription

        await userModel.findByIdAndUpdate(userId, {
            subscriptionTier: subscriptionType,
            subscriptionStatus: 'active',
            subscriptionStartDate,
            subscriptionEndDate,
            mockTestsUsed: 0, // Reset usage counters
            aiInterviewsUsed: 0
        });

        return res.status(200).json({
            success: true,
            message: 'Payment verified and subscription activated successfully',
            subscription: {
                tier: subscriptionType,
                startDate: subscriptionStartDate,
                endDate: subscriptionEndDate
            }
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
            error: error.message
        });
    }
};

// Get user's transaction history
export const getTransactions = async (req, res) => {
    try {
        const userId = req.userId;

        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            transactions
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch transactions'
        });
    }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findByIdAndUpdate(
            userId,
            { subscriptionStatus: 'cancelled' },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully',
            subscription: {
                tier: user.subscriptionTier,
                status: user.subscriptionStatus,
                endDate: user.subscriptionEndDate
            }
        });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to cancel subscription',
            error: error.message
        });
    }
};
