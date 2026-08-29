import { createRazorpayInstance } from '../config/razorpay.config.js';
import { SUBSCRIPTION_PLANS, isValidPaidPlan } from '../config/subscriptionPlans.js';
import Payment from '../models/paymentModel.js';
import Subscription from '../models/subscriptionModel.js';
import userModel from '../models/userModel.js';
import crypto from 'crypto';

// ============================================================
// STEP 1: CREATE ORDER
// POST /api/payment/createorder
// ============================================================
export const createOrder = async (req, res) => {
    try {
        const plan = req.body.plan || req.body.subscriptionType;
        const userId = req.userId;

        // Validate userId
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User ID not found. Please login again.'
            });
        }

        // Validate plan
        if (!plan || !isValidPaidPlan(plan)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid plan. Must be "basic" or "pro".'
            });
        }

        // Check if Razorpay credentials are configured
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('Razorpay credentials not configured');
            return res.status(500).json({
                success: false,
                message: 'Payment system not configured. Please contact support.'
            });
        }

        const planConfig = SUBSCRIPTION_PLANS[plan];
        
        try {
            const razorpayInstance = createRazorpayInstance();

            // Generate short receipt ID (max 40 chars for Razorpay)
            // Format: receipt_<plan>_<short_user_id>_<timestamp>
            const shortUserId = userId.toString().substring(0, 8); // Use first 8 chars of ObjectId
            const timestamp = Date.now().toString().substring(0, 8); // Use first 8 chars of timestamp
            const receiptId = `receipt_${plan}_${shortUserId}_${timestamp}`.substring(0, 40);

            const options = {
                amount: planConfig.priceInPaise,
                currency: planConfig.currency,
                receipt: receiptId,
                notes: {
                    userId: userId.toString(),
                    plan
                }
            };

            // Create Razorpay order
            const order = await razorpayInstance.orders.create(options);

            // Store payment record with status "created"
            const payment = await Payment.create({
                userId,
                orderId: order.id,
                amount: planConfig.price,
                currency: order.currency,
                plan,
                status: 'created',
                receipt: order.receipt
            });

            return res.status(200).json({
                success: true,
                order,
                paymentRecordId: payment._id,
                key: process.env.RAZORPAY_KEY_ID
            });
        } catch (razorpayError) {
            console.error('Razorpay API error:', razorpayError);
            return res.status(500).json({
                success: false,
                message: 'Failed to create payment order. Please try again.',
                error: process.env.NODE_ENV === 'development' ? razorpayError.message : undefined
            });
        }
    } catch (error) {
        console.error('Create order error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ============================================================
// STEP 2: VERIFY PAYMENT
// POST /api/payment/verify
// ============================================================
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        const plan = req.body.plan || req.body.subscriptionType;
        const userId = req.userId;

        // Validate userId
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User ID not found. Please login again.'
            });
        }

        // Validate inputs
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification details'
            });
        }

        // Find the payment record
        const payment = await Payment.findOne({ orderId: razorpay_order_id, userId });
        if (!payment) {
            console.error(`Payment record not found for orderId: ${razorpay_order_id}, userId: ${userId}`);
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }

        // Check Razorpay secret is configured
        if (!process.env.RAZORPAY_KEY_SECRET) {
            console.error('Razorpay secret not configured');
            return res.status(500).json({
                success: false,
                message: 'Payment verification not configured'
            });
        }

        // Verify signature using crypto HMAC
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            // INVALID — Mark payment as failed
            payment.status = 'failed';
            payment.paymentId = razorpay_payment_id;
            payment.signature = razorpay_signature;
            payment.failureReason = 'Signature mismatch';
            await payment.save();

            console.error(`Payment signature verification failed for orderId: ${razorpay_order_id}`);
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed. Signature mismatch.'
            });
        }

        // VALID — Update payment record
        const paymentPlan = plan || payment.plan;
        payment.status = 'success';
        payment.paymentId = razorpay_payment_id;
        payment.signature = razorpay_signature;

        // Try to fetch payment details from Razorpay for method info
        try {
            const razorpayInstance = createRazorpayInstance();
            const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);
            payment.paymentMethod = paymentDetails.method || 'other';
            payment.razorpayResponse = paymentDetails;
        } catch (fetchErr) {
            console.warn('Could not fetch payment details from Razorpay:', fetchErr.message);
        }

        await payment.save();

        // Upgrade user plan
        const subscriptionStartDate = new Date();
        const subscriptionEndDate = new Date();
        const planConfig = SUBSCRIPTION_PLANS[paymentPlan];
        
        if (!planConfig) {
            console.error(`Invalid plan config for plan: ${paymentPlan}`);
            return res.status(500).json({
                success: false,
                message: 'Invalid subscription plan configuration'
            });
        }

        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + (planConfig?.durationDays || 30));

        // Update user subscription
        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            subscriptionTier: paymentPlan,
            isSubscribed: true,
            subscriptionStatus: 'active',
            subscriptionStartDate,
            subscriptionEndDate,
            mockTestsUsed: 0,
            aiInterviewsUsed: 0
        }, { new: true });

        if (!updatedUser) {
            throw new Error('Failed to update user subscription');
        }

        // Create Subscription record
        // First, expire any existing active subscriptions for this user
        await Subscription.updateMany(
            { userId, status: 'active' },
            { $set: { status: 'expired' } }
        );

        const subscription = await Subscription.create({
            userId,
            plan: paymentPlan,
            startDate: subscriptionStartDate,
            endDate: subscriptionEndDate,
            status: 'active',
            paymentId: payment._id
        });

        console.log(`Payment verified successfully for user ${userId}, plan: ${paymentPlan}`);

        return res.status(200).json({
            success: true,
            message: 'Payment verified and subscription activated successfully',
            subscription: {
                plan: paymentPlan,
                startDate: subscriptionStartDate,
                endDate: subscriptionEndDate
            }
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ============================================================
// STEP 3: RAZORPAY WEBHOOK
// POST /api/payment/webhook (NO AUTH — called by Razorpay)
// ============================================================
export const handleWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // If webhook secret is configured, verify the signature
        if (webhookSecret) {
            const receivedSignature = req.headers['x-razorpay-signature'];
            const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(body)
                .digest('hex');

            if (expectedSignature !== receivedSignature) {
                console.error('[WEBHOOK] Invalid signature');
                return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
            }
        }

        const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { event: eventType, payload } = event;

        console.log(`[WEBHOOK] Received event: ${eventType}`);

        switch (eventType) {
            case 'payment.captured': {
                const paymentEntity = payload.payment.entity;
                const orderId = paymentEntity.order_id;

                await Payment.findOneAndUpdate(
                    { orderId },
                    {
                        status: 'success',
                        paymentId: paymentEntity.id,
                        paymentMethod: paymentEntity.method || 'other',
                        razorpayResponse: paymentEntity
                    }
                );
                console.log(`[WEBHOOK] Payment captured for order: ${orderId}`);
                break;
            }

            case 'payment.failed': {
                const paymentEntity = payload.payment.entity;
                const orderId = paymentEntity.order_id;

                await Payment.findOneAndUpdate(
                    { orderId },
                    {
                        status: 'failed',
                        paymentId: paymentEntity.id,
                        razorpayResponse: paymentEntity
                    }
                );
                console.log(`[WEBHOOK] Payment failed for order: ${orderId}`);
                break;
            }

            case 'refund.processed': {
                const refundEntity = payload.refund.entity;
                const paymentId = refundEntity.payment_id;

                await Payment.findOneAndUpdate(
                    { paymentId },
                    {
                        refundId: refundEntity.id,
                        refundAmount: refundEntity.amount / 100,
                        refundStatus: 'processed',
                        refundedAt: new Date()
                    }
                );
                console.log(`[WEBHOOK] Refund processed for payment: ${paymentId}`);
                break;
            }

            default:
                console.log(`[WEBHOOK] Unhandled event type: ${eventType}`);
        }

        // Always return 200 to Razorpay to acknowledge receipt
        return res.status(200).json({ success: true, message: 'Webhook processed' });
    } catch (error) {
        console.error('[WEBHOOK] Error processing webhook:', error);
        // Still return 200 to prevent Razorpay retries on our processing errors
        return res.status(200).json({ success: true, message: 'Webhook received' });
    }
};

// ============================================================
// GET PAYMENT HISTORY
// GET /api/payment/history
// ============================================================
export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [payments, total] = await Promise.all([
            Payment.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Payment.countDocuments({ userId })
        ]);

        return res.status(200).json({
            success: true,
            payments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get payment history error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch payment history'
        });
    }
};

// ============================================================
// CANCEL SUBSCRIPTION
// POST /api/payment/cancel
// ============================================================
export const cancelSubscription = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.subscriptionTier === 'free') {
            return res.status(400).json({
                success: false,
                message: 'No active paid subscription to cancel'
            });
        }

        // Update user — keep the plan active until endDate but mark as cancelled
        await userModel.findByIdAndUpdate(userId, {
            subscriptionStatus: 'cancelled'
        });

        // Update active Subscription record
        await Subscription.findOneAndUpdate(
            { userId, status: 'active' },
            { $set: { status: 'cancelled' } }
        );

        return res.status(200).json({
            success: true,
            message: 'Subscription cancelled. You will retain access until the end of your billing period.',
            subscription: {
                plan: user.subscriptionTier,
                status: 'cancelled',
                accessUntil: user.subscriptionEndDate
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

// ============================================================
// INITIATE REFUND (Admin Only)
// POST /api/payment/refund
// ============================================================
export const initiateRefund = async (req, res) => {
    try {
        const { paymentRecordId, amount } = req.body;

        if (!paymentRecordId) {
            return res.status(400).json({
                success: false,
                message: 'Payment record ID is required'
            });
        }

        const payment = await Payment.findById(paymentRecordId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }

        if (payment.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: 'Can only refund successful payments'
            });
        }

        if (payment.refundStatus === 'processed') {
            return res.status(400).json({
                success: false,
                message: 'This payment has already been refunded'
            });
        }

        if (!payment.paymentId) {
            return res.status(400).json({
                success: false,
                message: 'No Razorpay payment ID found for this record'
            });
        }

        const razorpayInstance = createRazorpayInstance();
        const refundAmount = amount ? Math.round(amount * 100) : Math.round(payment.amount * 100);

        const refund = await razorpayInstance.payments.refund(payment.paymentId, {
            amount: refundAmount,
            speed: 'normal',
            notes: {
                reason: 'Refund initiated by admin'
            }
        });

        // Update payment record
        payment.refundId = refund.id;
        payment.refundAmount = refundAmount / 100;
        payment.refundStatus = 'initiated';
        payment.refundedAt = new Date();
        await payment.save();

        // Downgrade user subscription
        await userModel.findByIdAndUpdate(payment.userId, {
            subscriptionTier: 'free',
            isSubscribed: false,
            subscriptionStatus: 'expired',
            mockTestsUsed: 0,
            aiInterviewsUsed: 0
        });

        // Update Subscription record
        await Subscription.findOneAndUpdate(
            { userId: payment.userId, status: 'active' },
            { $set: { status: 'cancelled' } }
        );

        return res.status(200).json({
            success: true,
            message: 'Refund initiated successfully',
            refund: {
                refundId: refund.id,
                amount: refundAmount / 100,
                status: refund.status
            }
        });
    } catch (error) {
        console.error('Initiate refund error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to initiate refund',
            error: error.message
        });
    }
};

// ============================================================
// ADMIN: GET ALL PAYMENTS
// GET /api/payment/admin/all
// ============================================================
export const getAllPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        const status = req.query.status; // Optional filter
        const plan = req.query.plan; // Optional filter

        // Build filter
        const filter = {};
        if (status && ['created', 'success', 'failed'].includes(status)) {
            filter.status = status;
        }
        if (plan && ['basic', 'pro'].includes(plan)) {
            filter.plan = plan;
        }

        const [payments, total] = await Promise.all([
            Payment.find(filter)
                .populate('userId', 'name email subscriptionTier')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Payment.countDocuments(filter)
        ]);

        // Aggregate stats
        const stats = await Payment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            payments,
            stats,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all payments error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch payments'
        });
    }
};
