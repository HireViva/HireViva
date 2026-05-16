import mongoose from 'mongoose';

const solvedQuestionSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true
  },
  solvedDate: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['coding_sheet', 'mock_test', 'aptitude', 'ai_interview', 'manual'],
    default: 'coding_sheet'
  }
}, { _id: false });

const moduleMetricSchema = new mongoose.Schema({
  attempts: { type: Number, default: 0, min: 0 },
  completed: { type: Number, default: 0, min: 0 },
  score: { type: Number, default: 0, min: 0, max: 100 },
  avgScore: { type: Number, default: 0, min: 0, max: 100 },
  bestScore: { type: Number, default: 0, min: 0, max: 100 },
  completionRate: { type: Number, default: 0, min: 0, max: 100 },
  lastAttempt: Date
}, { _id: false });

const topicProgressSchema = new mongoose.Schema({
  topicKey: {
    type: String,
    trim: true
  },
  topicName: {
    type: String,
    trim: true,
    required: true
  },
  completion: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const activityLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['coding_sheet', 'mock_test', 'aptitude', 'ai_interview', 'manual'],
    default: 'manual'
  }
}, { _id: false });

const weeklyPerformanceSchema = new mongoose.Schema({
  week: Number,
  year: Number,
  weekStart: Date,
  weekLabel: String,
  overall: { type: Number, default: 0, min: 0, max: 100 },
  aiInterview: { type: Number, default: 0, min: 0, max: 100 },
  coding: { type: Number, default: 0, min: 0, max: 100 },
  aptitude: { type: Number, default: 0, min: 0, max: 100 },
  communication: { type: Number, default: 0, min: 0, max: 100 },
  coreSubjects: { type: Number, default: 0, min: 0, max: 100 }
}, { _id: false });

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true // One progress document per user
  },
  
  // Question tracking
  solved: [solvedQuestionSchema],
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
    aiInterview: { type: moduleMetricSchema, default: () => ({}) },
    coding: { type: moduleMetricSchema, default: () => ({}) },
    aptitude: { type: moduleMetricSchema, default: () => ({}) },
    communication: { type: moduleMetricSchema, default: () => ({}) },
    coreSubjects: { type: moduleMetricSchema, default: () => ({}) }
  },

  // Topic-wise completion
  topicProgress: [topicProgressSchema],

  // Streak tracking
  dayStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivity: Date,
    activityLog: [activityLogSchema]
  },

  // Overall metrics
  overallScore: { type: Number, default: 0 },
  totalProblemsSolved: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },

  // Weekly performance data
  weeklyPerformance: [weeklyPerformanceSchema],

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
