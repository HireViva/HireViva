/**
 * Centralized Subscription Plans Configuration
 * Single source of truth for all plan limits and pricing
 */

export const SUBSCRIPTION_PLANS = {
    free: {
        name: 'Free',
        price: 0,
        priceInPaise: 0,
        currency: 'INR',
        mockTestsLimit: 2,
        aiInterviewLimit: 1,
        features: [
            '2 Mock Tests',
            '1 AI Interview',
            'Basic Analytics'
        ]
    },
    basic: {
        name: 'Basic',
        price: 299,
        priceInPaise: 29900,
        currency: 'INR',
        durationDays: 30,
        mockTestsLimit: 6,
        aiInterviewLimit: 5,
        features: [
            '6 Mock Tests per month',
            '5 AI Interviews per month',
            'Detailed Analytics',
            'Email Support'
        ]
    },
    pro: {
        name: 'Pro',
        price: 599,
        priceInPaise: 59900,
        currency: 'INR',
        durationDays: 30,
        mockTestsLimit: Infinity,
        aiInterviewLimit: Infinity,
        features: [
            'Unlimited Mock Tests',
            'Unlimited AI Interviews',
            'Advanced Analytics',
            'Priority Support',
            'Resume Analysis'
        ]
    }
};

/**
 * Get plan details by plan name
 * @param {string} planName - 'free', 'basic', or 'pro'
 * @returns {object|null} Plan config or null
 */
export const getPlanConfig = (planName) => {
    return SUBSCRIPTION_PLANS[planName] || null;
};

/**
 * Validate if a plan name is valid paid plan
 * @param {string} planName
 * @returns {boolean}
 */
export const isValidPaidPlan = (planName) => {
    return ['basic', 'pro'].includes(planName);
};
