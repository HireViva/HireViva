import express from 'express';
import {
    createOrder,
    verifyPayment,
    handleWebhook,
    getPaymentHistory,
    cancelSubscription,
    initiateRefund,
    getAllPayments
} from '../controllers/paymentController.js';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminMiddleware.js';

const router = express.Router();

// ─── User Payment Routes (require auth) ─────────────────────
router.post('/createorder', userAuth, createOrder);
router.post('/verifypayment', userAuth, verifyPayment);
router.get('/history', userAuth, getPaymentHistory);
router.post('/cancel', userAuth, cancelSubscription);

// ─── Razorpay Webhook (NO auth — called by Razorpay servers) ─
router.post('/webhook', handleWebhook);

// ─── Admin Routes (require auth + admin role) ───────────────
router.post('/refund', userAuth, adminAuth, initiateRefund);
router.get('/admin/all', userAuth, adminAuth, getAllPayments);

export default router;
