import { useState, useEffect } from 'react';
import api from '../api';

export const useSubscription = () => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubscription = async () => {
        try {
            setLoading(true);

            const response = await api.get('/subscription/status');

            if (response.data) {
                setSubscription(response.data.subscription);
            }
        } catch (err) {
            console.error('Subscription fetch error:', err);
            // If 401/403, we assume free tier or not logged in
            setSubscription({
                tier: 'free',
                status: 'active',
                mockTests: { used: 0, limit: 2, remaining: 2 },
                aiInterviews: { used: 0, limit: 1, remaining: 1 }
            });
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    const canAccessMockTest = () => {
        if (!subscription) return false;
        return subscription.mockTests.remaining > 0 || subscription.mockTests.remaining === Infinity;
    };

    const canAccessAIInterview = () => {
        if (!subscription) return false;
        return subscription.aiInterviews.remaining > 0 || subscription.aiInterviews.remaining === Infinity;
    };

    const refresh = () => {
        fetchSubscription();
    };

    return {
        subscription,
        loading,
        error,
        canAccessMockTest,
        canAccessAIInterview,
        refresh
    };
};
