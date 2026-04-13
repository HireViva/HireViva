import express from 'express';
import { createOrder, verifyPayment, getTransactions, cancelSubscription } from '../controllers/paymentController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// All payment routes require authentication
router.post('/createorder', userAuth, createOrder);
router.post('/verifypayment', userAuth, verifyPayment);
router.get('/transactions', userAuth, getTransactions);
router.post('/cancel', userAuth, cancelSubscription);

export default router;
