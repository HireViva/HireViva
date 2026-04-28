import userModel from '../models/userModel.js';
import { SUBSCRIPTION_PLANS } from '../config/subscriptionPlans.js';

// Get limits from centralized config
const SUBSCRIPTION_LIMITS = {
    free: {
        mockTests: SUBSCRIPTION_PLANS.free.mockTestsLimit,
        aiInterviews: SUBSCRIPTION_PLANS.free.aiInterviewLimit
    },
    basic: {
        mockTests: SUBSCRIPTION_PLANS.basic.mockTestsLimit,
        aiInterviews: SUBSCRIPTION_PLANS.basic.aiInterviewLimit
    },
    pro: {
        mockTests: SUBSCRIPTION_PLANS.pro.mockTestsLimit,
        aiInterviews: SUBSCRIPTION_PLANS.pro.aiInterviewLimit
    }
};

// Check if subscription is expired
const isSubscriptionExpired = (user) => {
    if (user.subscriptionTier === 'free') return false;

    if (!user.subscriptionEndDate) return true;

    return new Date() > new Date(user.subscriptionEndDate);
};

// Check if user can access mock tests
export const checkMockTestAccess = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if subscription is expired
        if (isSubscriptionExpired(user)) {
            await userModel.findByIdAndUpdate(userId, {
                subscriptionTier: 'free',
                subscriptionStatus: 'expired',
                mockTestsUsed: 0,
                aiInterviewsUsed: 0
            });
            user.subscriptionTier = 'free';
            user.mockTestsUsed = 0;
        }

        const limit = SUBSCRIPTION_LIMITS[user.subscriptionTier].mockTests;

        if (user.mockTestsUsed >= limit) {
            return res.status(403).json({
                success: false,
                message: 'Mock test limit reached',
                currentTier: user.subscriptionTier,
                testsUsed: user.mockTestsUsed,
                testsLimit: limit,
                requiresUpgrade: true,
                suggestedTier: user.subscriptionTier === 'free' ? 'basic' : 'pro'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Check mock test access error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check access'
        });
    }
};

// Check if user can access AI interviews
export const checkAIInterviewAccess = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if subscription is expired
        if (isSubscriptionExpired(user)) {
            await userModel.findByIdAndUpdate(userId, {
                subscriptionTier: 'free',
                subscriptionStatus: 'expired',
                mockTestsUsed: 0,
                aiInterviewsUsed: 0
            });
            user.subscriptionTier = 'free';
            user.aiInterviewsUsed = 0;
        }

        const limit = SUBSCRIPTION_LIMITS[user.subscriptionTier].aiInterviews;

        if (user.aiInterviewsUsed >= limit) {
            return res.status(403).json({
                success: false,
                message: 'AI interview limit reached',
                currentTier: user.subscriptionTier,
                interviewsUsed: user.aiInterviewsUsed,
                interviewsLimit: limit,
                requiresUpgrade: true,
                suggestedTier: user.subscriptionTier === 'free' ? 'basic' : 'pro'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Check AI interview access error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check access'
        });
    }
};

// Increment mock test usage counter
export const incrementMockTestUsage = async (req, res, next) => {
    try {
        const userId = req.userId;
        await userModel.findByIdAndUpdate(userId, {
            $inc: { mockTestsUsed: 1 }
        });
        next();
    } catch (error) {
        console.error('Increment mock test usage error:', error);
        // Don't block the response, just log the error
        next();
    }
};

// Increment AI interview usage counter
export const incrementAIInterviewUsage = async (req, res, next) => {
    try {
        const userId = req.userId;
        await userModel.findByIdAndUpdate(userId, {
            $inc: { aiInterviewsUsed: 1 }
        });
        next();
    } catch (error) {
        console.error('Increment AI interview usage error:', error);
        // Don't block the response, just log the error
        next();
    }
};

// Get subscription info (helper for responses)
export const getSubscriptionInfo = (user) => {
    const tier = user.subscriptionTier;
    const limits = SUBSCRIPTION_LIMITS[tier];

    return {
        tier,
        status: user.subscriptionStatus,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        mockTests: {
            used: user.mockTestsUsed,
            limit: limits.mockTests,
            remaining: limits.mockTests === Infinity ? Infinity : Math.max(0, limits.mockTests - user.mockTestsUsed)
        },
        aiInterviews: {
            used: user.aiInterviewsUsed,
            limit: limits.aiInterviews,
            remaining: limits.aiInterviews === Infinity ? Infinity : Math.max(0, limits.aiInterviews - user.aiInterviewsUsed)
        }
    };
};
