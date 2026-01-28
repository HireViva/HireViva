import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true // One progress document per user
  },
  solved: [{
    type: Number, // Question IDs
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
  }
}, {
  timestamps: true
});

// Index for faster lookups
userProgressSchema.index({ userId: 1 });

const userProgressModel = mongoose.models.userProgress ||
  mongoose.model('userProgress', userProgressSchema);

export default userProgressModel;