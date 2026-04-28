import userProgressModel from '../models/userProgressModel.js';
import TestAttempt from '../models/TestAttempt.js';
import AptitudeTestAttempt from '../models/AptitudeTestAttempt.js';
import InterviewSession from '../models/InterviewSession.js';

/**
 * Calculate week number from date
 */
export const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

/**
 * Calculate overall score across all modules
 */
export const calculateOverallScore = (moduleProgress) => {
  const modules = ['aiInterview', 'coding', 'aptitude', 'communication', 'coreSubjects'];
  const scores = modules.map(mod => moduleProgress[mod]?.score || 0);
  return Math.round(scores.reduce((a, b) => a + b, 0) / modules.length);
};

/**
 * Update day streak based on activity
 */
export const updateDayStreak = (progress) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = progress.dayStreak.lastActivity
    ? new Date(progress.dayStreak.lastActivity)
    : null;

  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
  }

  const daysDifference = lastActivity
    ? Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24))
    : 1;

  if (daysDifference === 0) {
    // Same day, no update needed
    return;
  } else if (daysDifference === 1) {
    // Consecutive day
    progress.dayStreak.current += 1;
    if (progress.dayStreak.current > progress.dayStreak.longest) {
      progress.dayStreak.longest = progress.dayStreak.current;
    }
  } else {
    // Streak broken
    progress.dayStreak.current = 1;
  }

  progress.dayStreak.lastActivity = today;
};

/**
 * Calculate module progress from test attempts
 */
export const calculateModuleProgress = async (userId, module) => {
  let attempts = 0;
  let completed = 0;
  let totalScore = 0;
  let lastAttempt = null;

  try {
    if (module === 'coding') {
      const codingAttempts = await TestAttempt.find({ userId });
      attempts = codingAttempts.length;
      completed = codingAttempts.filter(a => a.status === 'completed').length;
      totalScore = codingAttempts.length > 0
        ? Math.round(codingAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts)
        : 0;
      lastAttempt = codingAttempts.length > 0 ? codingAttempts[0].createdAt : null;
    } else if (module === 'aptitude') {
      const aptitudeAttempts = await AptitudeTestAttempt.find({ userId });
      attempts = aptitudeAttempts.length;
      completed = aptitudeAttempts.filter(a => a.status === 'completed').length;
      totalScore = aptitudeAttempts.length > 0
        ? Math.round(aptitudeAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts)
        : 0;
      lastAttempt = aptitudeAttempts.length > 0 ? aptitudeAttempts[0].createdAt : null;
    } else if (module === 'aiInterview') {
      const interviews = await InterviewSession.find({ userId });
      attempts = interviews.length;
      completed = interviews.filter(i => i.status === 'completed').length;
      totalScore = interviews.length > 0
        ? Math.round(interviews.reduce((sum, i) => sum + (i.score || 0), 0) / attempts)
        : 0;
      lastAttempt = interviews.length > 0 ? interviews[0].createdAt : null;
    }
  } catch (error) {
    console.error(`Error calculating ${module} progress:`, error);
  }

  return {
    attempts,
    completed,
    score: Math.min(100, totalScore),
    lastAttempt
  };
};

/**
 * Calculate weekly performance metrics
 */
export const calculateWeeklyPerformance = async (userId) => {
  const currentWeek = getWeekNumber(new Date());
  const currentYear = new Date().getFullYear();

  try {
    const codingTests = await TestAttempt.find({
      userId,
      createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
    });

    const aptitudeTests = await AptitudeTestAttempt.find({
      userId,
      createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
    });

    const interviews = await InterviewSession.find({
      userId,
      createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
    });

    const codingScore = codingTests.length > 0
      ? Math.round(codingTests.reduce((sum, t) => sum + (t.score || 0), 0) / codingTests.length)
      : 0;

    const aptitudeScore = aptitudeTests.length > 0
      ? Math.round(aptitudeTests.reduce((sum, t) => sum + (t.score || 0), 0) / aptitudeTests.length)
      : 0;

    const interviewScore = interviews.length > 0
      ? Math.round(interviews.reduce((sum, i) => sum + (i.score || 0), 0) / interviews.length)
      : 0;

    return {
      week: currentWeek,
      year: currentYear,
      coding: codingScore,
      aptitude: aptitudeScore,
      aiInterview: interviewScore,
      communication: 0,
      coreSubjects: 0
    };
  } catch (error) {
    console.error('Error calculating weekly performance:', error);
    return {
      week: currentWeek,
      year: currentYear,
      coding: 0,
      aptitude: 0,
      aiInterview: 0,
      communication: 0,
      coreSubjects: 0
    };
  }
};

/**
 * Recalculate all user progress metrics
 */
export const recalculateUserProgress = async (userId) => {
  try {
    let progress = await userProgressModel.findOne({ userId });

    if (!progress) {
      progress = await userProgressModel.create({
        userId,
        solved: [],
        starred: [],
        notes: {}
      });
    }

    // Update module progress
    const modules = ['coding', 'aptitude', 'aiInterview', 'communication', 'coreSubjects'];
    for (const module of modules) {
      const moduleData = await calculateModuleProgress(userId, module);
      progress.moduleProgress[module] = moduleData;
    }

    // Update overall score
    progress.overallScore = calculateOverallScore(progress.moduleProgress);

    // Update total problems solved
    progress.totalProblemsSolved = progress.solved.length;

    // Update total attempts
    progress.totalAttempts = Object.values(progress.moduleProgress)
      .reduce((sum, mod) => sum + (mod.attempts || 0), 0);

    // Update day streak
    updateDayStreak(progress);

    // Update weekly performance
    const weeklyData = await calculateWeeklyPerformance(userId);
    const existingWeek = progress.weeklyPerformance.find(
      w => w.week === weeklyData.week && w.year === weeklyData.year
    );

    if (existingWeek) {
      Object.assign(existingWeek, weeklyData);
    } else {
      progress.weeklyPerformance.push(weeklyData);
    }

    // Keep only last 12 weeks
    if (progress.weeklyPerformance.length > 12) {
      progress.weeklyPerformance = progress.weeklyPerformance.slice(-12);
    }

    progress.lastCalculated = new Date();
    await progress.save();

    return progress;
  } catch (error) {
    console.error('Error recalculating user progress:', error);
    throw error;
  }
};

/**
 * Add problem solved
 */
export const addProblemSolved = async (userId, questionId) => {
  let progress = await userProgressModel.findOne({ userId });

  if (!progress) {
    progress = await userProgressModel.create({
      userId,
      solved: [questionId],
      starred: [],
      notes: {}
    });
  } else {
    if (!progress.solved.includes(questionId)) {
      progress.solved.push(questionId);
      progress.totalProblemsSolved = progress.solved.length;
      updateDayStreak(progress);
      await progress.save();
    }
  }

  return progress;
};

/**
 * Get dashboard metrics
 */
export const getDashboardMetrics = async (userId) => {
  const progress = await recalculateUserProgress(userId);

  return {
    overallScore: progress.overallScore,
    totalProblemsSolved: progress.totalProblemsSolved,
    dayStreak: progress.dayStreak.current,
    aiInterviewsDone: progress.moduleProgress.aiInterview.completed || 0,
    moduleBreakdown: {
      aiInterview: progress.moduleProgress.aiInterview.score || 0,
      coding: progress.moduleProgress.coding.score || 0,
      aptitude: progress.moduleProgress.aptitude.score || 0,
      communication: progress.moduleProgress.communication.score || 0,
      coreSubjects: progress.moduleProgress.coreSubjects.score || 0
    },
    topicProgress: progress.topicProgress || [],
    weeklyPerformance: progress.weeklyPerformance.slice(-8) || [], // Last 8 weeks
    totalAttempts: progress.totalAttempts,
    lastCalculated: progress.lastCalculated
  };
};
