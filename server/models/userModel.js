import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false, // Not required for Google OAuth users
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    googleId: {
        type: String,
        default: null,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
    },
    verifyOtp: {
        type: Number,
        default: 0,
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: '',
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0,
    },
    quizStats: {
        totalAttempts: { type: Number, default: 0 },
        totalCompleted: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        bestScore: { type: Number, default: 0 },
        totalTimeSpent: { type: Number, default: 0 }, // in minutes
        lastAttemptDate: { type: Date }
    },
    aptitudeQuizStats: {
        totalAttempts: { type: Number, default: 0 },
        totalCompleted: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        bestScore: { type: Number, default: 0 },
        totalTimeSpent: { type: Number, default: 0 }, // in minutes
        lastAttemptDate: { type: Date }
    },
    // Subscription fields
    subscriptionTier: {
        type: String,
        enum: ['free', 'basic', 'pro'],
        default: 'free'
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    subscriptionStartDate: {
        type: Date,
        default: null
    },
    subscriptionEndDate: {
        type: Date,
        default: null
    },
    mockTestsUsed: {
        type: Number,
        default: 0
    },
    aiInterviewsUsed: {
        type: Number,
        default: 0
    },
    razorpayCustomerId: {
        type: String,
        default: null
    }
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
