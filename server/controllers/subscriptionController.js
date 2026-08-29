import userModel from '../models/userModel.js';
import Subscription from '../models/subscriptionModel.js';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans.js';

/**
 * Get subscription status for the authenticated user
 * GET /api/subscription/status
 */
export const getSubscriptionStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const tier = user.subscriptionTier;
        const limits = SUBSCRIPTION_PLANS[tier];

        const subscriptionInfo = {
            tier,
            isSubscribed: user.isSubscribed,
            status: user.subscriptionStatus,
            startDate: user.subscriptionStartDate,
            endDate: user.subscriptionEndDate,
            mockTests: {
                used: user.mockTestsUsed,
                limit: limits.mockTestsLimit,
                remaining: limits.mockTestsLimit === Infinity
                    ? 'unlimited'
                    : Math.max(0, limits.mockTestsLimit - user.mockTestsUsed)
            },
            aiInterviews: {
                used: user.aiInterviewsUsed,
                limit: limits.aiInterviewLimit,
                remaining: limits.aiInterviewLimit === Infinity
                    ? 'unlimited'
                    : Math.max(0, limits.aiInterviewLimit - user.aiInterviewsUsed)
            }
        };

        return res.status(200).json({
            success: true,
            subscription: subscriptionInfo
        });
    } catch (error) {
        console.error('Get subscription status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get subscription status'
        });
    }
};

/**
 * Get usage statistics for the authenticated user
 * GET /api/subscription/usage
 */
export const getUsageStats = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const tier = user.subscriptionTier;
        const limits = SUBSCRIPTION_PLANS[tier];

        return res.status(200).json({
            success: true,
            usage: {
                mockTestsUsed: user.mockTestsUsed,
                aiInterviewsUsed: user.aiInterviewsUsed,
                subscriptionTier: tier,
                limits: {
                    mockTests: limits.mockTestsLimit === Infinity ? 'unlimited' : limits.mockTestsLimit,
                    aiInterviews: limits.aiInterviewLimit === Infinity ? 'unlimited' : limits.aiInterviewLimit
                }
            }
        });
    } catch (error) {
        console.error('Get usage stats error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get usage statistics'
        });
    }
};

/**
 * Get subscription history for the authenticated user
 * GET /api/subscription/history
 */
export const getSubscriptionHistory = async (req, res) => {
    try {
        const userId = req.userId;

        const subscriptions = await Subscription.find({ userId })
            .populate('paymentId', 'orderId paymentId amount status paymentMethod')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            subscriptions
        });
    } catch (error) {
        console.error('Get subscription history error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get subscription history'
        });
    }
};

/**
 * Get available plans
 * GET /api/subscription/plans
 */
export const getPlans = async (req, res) => {
    try {
        const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
            id: key,
            name: plan.name,
            price: plan.price,
            currency: plan.currency,
            features: plan.features,
            limits: {
                mockTests: plan.mockTestsLimit === Infinity ? 'unlimited' : plan.mockTestsLimit,
                aiInterviews: plan.aiInterviewLimit === Infinity ? 'unlimited' : plan.aiInterviewLimit
            }
        }));

        return res.status(200).json({
            success: true,
            plans
        });
    } catch (error) {
        console.error('Get plans error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get plans'
        });
    }
};
