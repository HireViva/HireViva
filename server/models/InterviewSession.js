// Placeholder for InterviewSession model
// This will be implemented when backend is connected

import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    conversation: [{
        speaker: {
            type: String,
            enum: ['user', 'ai']
        },
        message: String,
        timestamp: Date
    }],
    scores: {
        overall: Number,
        technical: Number,
        communication: Number,
        problemSolving: Number,
        confidence: Number
    },
    feedback: {
        strengths: [String],
        improvements: [String],
        detailed: String
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    }
}, {
    timestamps: true
});

export default mongoose.model('InterviewSession', interviewSessionSchema);
