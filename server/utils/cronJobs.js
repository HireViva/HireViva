import cron from 'node-cron';
import userModel from '../models/userModel.js';
import Subscription from '../models/subscriptionModel.js';

/**
 * Auto-Downgrade Cron Job
 * Runs daily at midnight (00:00) to check for expired subscriptions
 * Downgrades expired users back to free tier and resets usage counters
 */
const initCronJobs = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Running subscription expiry check...');
        const now = new Date();

        try {
            // Find all users with expired paid subscriptions
            const expiredUsers = await userModel.find({
                subscriptionTier: { $in: ['basic', 'pro'] },
                subscriptionEndDate: { $lt: now },
                subscriptionStatus: { $ne: 'expired' }
            });

            if (expiredUsers.length === 0) {
                console.log('[CRON] No expired subscriptions found.');
                return;
            }

            console.log(`[CRON] Found ${expiredUsers.length} expired subscription(s). Downgrading...`);

            // Bulk update expired users
            const userIds = expiredUsers.map(u => u._id);

            await userModel.updateMany(
                { _id: { $in: userIds } },
                {
                    $set: {
                        subscriptionTier: 'free',
                        subscriptionStatus: 'expired',
                        isSubscribed: false,
                        mockTestsUsed: 0,
                        aiInterviewsUsed: 0
                    }
                }
            );

            // Update corresponding Subscription records
            await Subscription.updateMany(
                {
                    userId: { $in: userIds },
                    status: 'active',
                    endDate: { $lt: now }
                },
                {
                    $set: { status: 'expired' }
                }
            );

            console.log(`[CRON] Successfully downgraded ${expiredUsers.length} user(s) to free tier.`);
        } catch (error) {
            console.error('[CRON] Error during subscription expiry check:', error);
        }
    }, {
        timezone: 'Asia/Kolkata'
    });

    console.log('[CRON] Subscription expiry cron job initialized (runs daily at midnight IST).');
};

export default initCronJobs;
