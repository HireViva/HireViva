import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true // One progress document per user
  },
  
  // Question tracking
  solved: [{
    type: Number,
    questionId: Number,
    solvedDate: {
      type: Date,
      default: Date.now
    }
  }],
  starred: [{
    type: Number,
  }],
  notes: {
    type: Map,
    of: {
      content: String,
      lastUpdated: Date
    },
    default: {}
  },

  // Module-wise metrics
  moduleProgress: {
    aiInterview: {
      attempts: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      lastAttempt: Date
    },
    coding: {
      attempts: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      lastAttempt: Date
    },
    aptitude: {
      attempts: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      lastAttempt: Date
    },
    communication: {
      attempts: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      lastAttempt: Date
    },
    coreSubjects: {
      attempts: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      lastAttempt: Date
    }
  },

  // Topic-wise completion
  topicProgress: [{
    topicName: String,
    completion: Number, // 0-100
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],

  // Streak tracking
  dayStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivity: Date,
    activityLog: [{
      date: Date,
      active: Boolean
    }]
  },

  // Overall metrics
  overallScore: { type: Number, default: 0 },
  totalProblemsSolved: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },

  // Weekly performance data
  weeklyPerformance: [{
    week: Number, // Week number
    year: Number,
    aiInterview: Number,
    coding: Number,
    aptitude: Number,
    communication: Number,
    coreSubjects: Number
  }],

  // Last updated
  lastCalculated: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});

// Index for faster lookups
userProgressSchema.index({ userId: 1 });
userProgressSchema.index({ 'dayStreak.lastActivity': 1 });

const userProgressModel = mongoose.models.userProgress ||
  mongoose.model('userProgress', userProgressSchema);

export default userProgressModel;