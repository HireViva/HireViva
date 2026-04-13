import userModel from '../models/userModel.js';
import { getSubscriptionInfo } from '../middleware/subscriptionMiddleware.js';

// Get subscription status
export const getSubscriptionStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const subscriptionInfo = getSubscriptionInfo(user);

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

// Get usage statistics
export const getUsageStats = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            usage: {
                mockTestsUsed: user.mockTestsUsed,
                aiInterviewsUsed: user.aiInterviewsUsed,
                subscriptionTier: user.subscriptionTier
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
