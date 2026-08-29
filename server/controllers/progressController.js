import userProgressModel from '../models/userProgressModel.js';
import {
  addProblemSolved,
  getDashboardMetrics,
  getMentorSuggestion,
  getProgressCharts,
  getProgressMetrics,
  getProgressScores,
  getTrackerProgress,
  recalculateUserProgress
} from '../services/progressService.js';

const toQuestionId = (entry) => Number((typeof entry === 'number' ? entry : entry?.questionId));

const serializeSolvedIds = (solved = []) => {
  const unique = new Set();
  solved.forEach((entry) => {
    const id = toQuestionId(entry);
    if (Number.isFinite(id)) unique.add(id);
  });
  return Array.from(unique);
};

const normalizeStarred = (starred = []) => {
  const unique = new Set();
  starred.forEach((entry) => {
    const id = Number(entry);
    if (Number.isFinite(id)) unique.add(id);
  });
  return Array.from(unique);
};

const mapSolvedPayloadToEntries = (solved = []) => {
  const now = new Date();
  const entries = [];

  solved.forEach((entry) => {
    const questionId = toQuestionId(entry);
    if (!Number.isFinite(questionId)) return;

    const solvedDate = entry?.solvedDate ? new Date(entry.solvedDate) : now;
    entries.push({
      questionId,
      solvedDate: Number.isNaN(solvedDate.getTime()) ? now : solvedDate,
      source: 'manual'
    });
  });

  // Keep unique by questionId.
  const byQuestionId = new Map();
  entries.forEach((entry) => byQuestionId.set(entry.questionId, entry));
  return Array.from(byQuestionId.values());
};

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await getTrackerProgress(userId);

    return res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch progress'
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const metrics = await getDashboardMetrics(userId);

    return res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard metrics'
    });
  }
};

export const getMetrics = async (req, res) => {
  try {
    const userId = req.userId;
    const metrics = await getProgressMetrics(userId);

    return res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Get metrics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch metrics'
    });
  }
};

export const getScores = async (req, res) => {
  try {
    const userId = req.userId;
    const scores = await getProgressScores(userId);

    return res.json({
      success: true,
      data: scores
    });
  } catch (error) {
    console.error('Get scores error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch scores'
    });
  }
};

export const getCharts = async (req, res) => {
  try {
    const userId = req.userId;
    const charts = await getProgressCharts(userId);

    return res.json({
      success: true,
      data: charts
    });
  } catch (error) {
    console.error('Get charts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data'
    });
  }
};

export const getModuleBreakdown = async (req, res) => {
  try {
    const userId = req.userId;
    const scores = await getProgressScores(userId);

    const breakdown = {
      aiInterview: {
        name: 'AI Interview',
        score: scores.moduleScores.find((item) => item.key === 'aiInterview')?.score || 0,
        attempts: scores.moduleScores.find((item) => item.key === 'aiInterview')?.attempts || 0,
        completed: scores.moduleScores.find((item) => item.key === 'aiInterview')?.completed || 0
      },
      coding: {
        name: 'Coding',
        score: scores.moduleScores.find((item) => item.key === 'coding')?.score || 0,
        attempts: scores.moduleScores.find((item) => item.key === 'coding')?.attempts || 0,
        completed: scores.moduleScores.find((item) => item.key === 'coding')?.completed || 0
      },
      aptitude: {
        name: 'Aptitude',
        score: scores.moduleScores.find((item) => item.key === 'aptitude')?.score || 0,
        attempts: scores.moduleScores.find((item) => item.key === 'aptitude')?.attempts || 0,
        completed: scores.moduleScores.find((item) => item.key === 'aptitude')?.completed || 0
      },
      communication: {
        name: 'Communication',
        score: scores.moduleScores.find((item) => item.key === 'communication')?.score || 0,
        attempts: scores.moduleScores.find((item) => item.key === 'communication')?.attempts || 0,
        completed: scores.moduleScores.find((item) => item.key === 'communication')?.completed || 0
      },
      coreSubjects: {
        name: 'Core Subjects',
        score: scores.moduleScores.find((item) => item.key === 'coreSubjects')?.score || 0,
        attempts: scores.moduleScores.find((item) => item.key === 'coreSubjects')?.attempts || 0,
        completed: scores.moduleScores.find((item) => item.key === 'coreSubjects')?.completed || 0
      }
    };

    return res.json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    console.error('Get module breakdown error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch module breakdown'
    });
  }
};

export const getWeeklyPerformance = async (req, res) => {
  try {
    const userId = req.userId;
    const charts = await getProgressCharts(userId);

    return res.json({
      success: true,
      data: charts.weeklyPerformance || []
    });
  } catch (error) {
    console.error('Get weekly performance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch weekly performance'
    });
  }
};

export const getDayStreak = async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await recalculateUserProgress(userId);

    return res.json({
      success: true,
      data: progress.dayStreak
    });
  } catch (error) {
    console.error('Get day streak error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch day streak'
    });
  }
};

export const toggleSolved = async (req, res) => {
  try {
    const userId = req.userId;
    const { questionId } = req.body;
    const normalizedQuestionId = Number(questionId);

    if (!Number.isFinite(normalizedQuestionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID'
      });
    }

    let progress = await userProgressModel.findOne({ userId });
    if (!progress) {
      progress = await addProblemSolved(userId, normalizedQuestionId, 'coding_sheet');
      return res.json({
        success: true,
        solved: serializeSolvedIds(progress.solved),
        totalSolved: progress.solved.length
      });
    }

    const currentSolved = serializeSolvedIds(progress.solved);
    const alreadySolved = currentSolved.includes(normalizedQuestionId);

    if (alreadySolved) {
      const filteredSolved = (progress.solved || []).filter(
        (entry) => toQuestionId(entry) !== normalizedQuestionId
      );
      progress.solved = mapSolvedPayloadToEntries(filteredSolved);
      progress.totalProblemsSolved = serializeSolvedIds(progress.solved).length;
      await progress.save();
    } else {
      progress = await addProblemSolved(userId, normalizedQuestionId, 'coding_sheet');
    }

    return res.json({
      success: true,
      solved: serializeSolvedIds(progress.solved),
      totalSolved: serializeSolvedIds(progress.solved).length
    });
  } catch (error) {
    console.error('Toggle solved error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update solved status'
    });
  }
};

export const toggleStarred = async (req, res) => {
  try {
    const userId = req.userId;
    const { questionId } = req.body;
    const normalizedQuestionId = Number(questionId);

    if (!Number.isFinite(normalizedQuestionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID'
      });
    }

    let progress = await userProgressModel.findOne({ userId });
    if (!progress) {
      progress = await userProgressModel.create({
        userId,
        solved: [],
        starred: [normalizedQuestionId],
        notes: new Map()
      });
    } else {
      const starred = normalizeStarred(progress.starred);
      if (starred.includes(normalizedQuestionId)) {
        progress.starred = starred.filter((id) => id !== normalizedQuestionId);
      } else {
        progress.starred = [...starred, normalizedQuestionId];
      }
      await progress.save();
    }

    return res.json({
      success: true,
      starred: normalizeStarred(progress.starred)
    });
  } catch (error) {
    console.error('Toggle starred error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update starred status'
    });
  }
};

export const saveNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { questionId, content } = req.body;
    const normalizedQuestionId = Number(questionId);

    if (!Number.isFinite(normalizedQuestionId) || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data'
      });
    }

    let progress = await userProgressModel.findOne({ userId });
    if (!progress) {
      progress = await userProgressModel.create({
        userId,
        solved: [],
        starred: [],
        notes: new Map()
      });
    }

    const trimmedContent = content.trim();
    progress.notes.set(String(normalizedQuestionId), {
      content: trimmedContent,
      lastUpdated: new Date()
    });
    await progress.save();

    return res.json({
      success: true,
      note: {
        content: trimmedContent,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Save note error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save note'
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { questionId } = req.body;
    const normalizedQuestionId = Number(questionId);

    if (!Number.isFinite(normalizedQuestionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID'
      });
    }

    const progress = await userProgressModel.findOne({ userId });
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    progress.notes.delete(String(normalizedQuestionId));
    await progress.save();

    return res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete note'
    });
  }
};

export const bulkUpdateProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { solved, starred, notes } = req.body;

    let progress = await userProgressModel.findOne({ userId });
    if (!progress) {
      progress = await userProgressModel.create({
        userId,
        solved: [],
        starred: [],
        notes: new Map()
      });
    }

    if (Array.isArray(solved)) {
      progress.solved = mapSolvedPayloadToEntries(solved);
      progress.totalProblemsSolved = progress.solved.length;
    }

    if (Array.isArray(starred)) {
      progress.starred = normalizeStarred(starred);
    }

    if (notes && typeof notes === 'object') {
      progress.notes = new Map(Object.entries(notes));
    }

    await progress.save();

    const trackerProgress = await getTrackerProgress(userId);
    return res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: trackerProgress
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update progress'
    });
  }
};

export const getAIMentorSuggestion = async (req, res) => {
  try {
    const userId = req.userId;
    const { focusArea } = req.body || {};

    const suggestionData = await getMentorSuggestion(userId, focusArea);

    return res.json({
      success: true,
      data: suggestionData
    });
  } catch (error) {
    console.error('Get AI mentor suggestion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate mentor suggestion'
    });
  }
};
