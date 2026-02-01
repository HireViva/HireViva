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
        required: true,
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
    }
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
