import mongoose from "mongoose";

const testAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Refers to the 'user' model
        required: true
    },
    testSet: {
        type: Number,
        required: true
    },
    answers: {
        type: Map,
        of: Number
    },
    startTime: Date,
    endTime: Date,
    isSubmitted: {
        type: Boolean,
        default: false
    },
    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    incorrectAnswers: Number,
    timeTaken: Number, // in seconds
    percentage: Number, // 0-100
    attemptNumber: Number, // nth attempt for this testSet by this user
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("TestAttempt", testAttemptSchema);
