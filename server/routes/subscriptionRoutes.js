import express from 'express';
import {
    getSubscriptionStatus,
    getUsageStats,
    getSubscriptionHistory,
    getPlans
} from '../controllers/subscriptionController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Public route — no auth needed for viewing plans
router.get('/plans', getPlans);

// Authenticated routes
router.get('/status', userAuth, getSubscriptionStatus);
router.get('/usage', userAuth, getUsageStats);
router.get('/history', userAuth, getSubscriptionHistory);

export default router;
