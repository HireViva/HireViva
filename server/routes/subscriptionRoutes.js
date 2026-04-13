import express from 'express';
import { getSubscriptionStatus, getUsageStats } from '../controllers/subscriptionController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.get('/status', userAuth, getSubscriptionStatus);
router.get('/usage', userAuth, getUsageStats);

export default router;
