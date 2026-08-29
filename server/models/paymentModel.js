import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            index: true
        },
        orderId: {
            type: String,
            required: true,
            index: true
        },
        paymentId: {
            type: String,
            index: true,
            default: null
        },
        signature: {
            type: String,
            default: null
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'INR'
        },
        plan: {
            type: String,
            enum: ['basic', 'pro'],
            required: true
        },
        status: {
            type: String,
            enum: ['created', 'success', 'failed'],
            default: 'created',
            index: true
        },
        paymentMethod: {
            type: String,
            enum: ['card', 'upi', 'netbanking', 'wallet', 'other', null],
            default: null
        },
        receipt: {
            type: String
        },
        invoiceUrl: {
            type: String,
            default: null
        },
        // Refund tracking
        refundId: {
            type: String,
            default: null
        },
        refundAmount: {
            type: Number,
            default: null
        },
        refundStatus: {
            type: String,
            enum: ['initiated', 'processed', 'failed', null],
            default: null
        },
        refundedAt: {
            type: Date,
            default: null
        },
        // Razorpay raw response (for audit trail)
        razorpayResponse: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    { timestamps: true }
);

// Compound index for faster lookups
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;
