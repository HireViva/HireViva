import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            index: true
        },
        subscriptionType: {
            type: String,
            enum: ['basic', 'pro'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'INR'
        },
        orderId: {
            type: String,
            index: true
        },
        paymentId: {
            type: String,
            index: true
        },
        signature: {
            type: String
        },
        status: {
            type: String,
            enum: ['created', 'verified', 'failed', 'refunded', 'refund_pending'],
            default: 'created'
        },
        receipt: {
            type: String
        },
        refundId: {
            type: String
        },
        refundAmount: {
            type: Number
        },
        refundStatus: {
            type: String
        }
    },
    { timestamps: true }
);

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export default Transaction;
