import userProgressModel from '../models/userProgressModel.js';
import TestAttempt from '../models/TestAttempt.js';
import AptitudeTestAttempt from '../models/AptitudeTestAttempt.js';
import InterviewSession from '../models/InterviewSession.js';

const MODULE_KEYS = ['aiInterview', 'coding', 'aptitude', 'communication', 'coreSubjects'];
const TRACKED_ACTIVITY_SOURCES = ['coding_sheet', 'mock_test', 'aptitude', 'ai_interview', 'manual'];
const MS_IN_A_DAY = 24 * 60 * 60 * 1000;
const WEEKS_IN_CHART = 8;
const MENTOR_FOCUS_AREAS = ['general', 'weak_areas', 'coding_tips', 'interview_tips', 'study_plan'];
const inFlightRecalculations = new Map();

const getDefaultModuleMetric = () => ({
  attempts: 0,
  completed: 0,
  score: 0,
  avgScore: 0,
  bestScore: 0,
  completionRate: 0,
  lastAttempt: null
});

const getDefaultModuleProgress = () => ({
  aiInterview: getDefaultModuleMetric(),
  coding: getDefaultModuleMetric(),
  aptitude: getDefaultModuleMetric(),
  communication: getDefaultModuleMetric(),
  coreSubjects: getDefaultModuleMetric()
});

const getProgressInsertDefaults = (userId) => ({
  userId,
  solved: [],
  starred: [],
  notes: {},
  moduleProgress: getDefaultModuleProgress(),
  topicProgress: [],
  dayStreak: {
    current: 0,
    longest: 0,
    lastActivity: null,
    activityLog: []
  },
  weeklyPerformance: [],
  overallScore: 0,
  totalProblemsSolved: 0,
  totalAttempts: 0,
  lastCalculated: new Date()
});

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clampScore = (value) => {
  const numeric = toNumber(value, 0);
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const startOfDay = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
};

const toDateKey = (dateValue) => {
  const date = startOfDay(dateValue);
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const keyToDate = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const isValidSource = (source) => TRACKED_ACTIVITY_SOURCES.includes(source);

const normalizeStarred = (starred = []) => {
  const unique = new Set();
  starred.forEach((entry) => {
    const value = Number(entry);
    if (Number.isFinite(value)) {
      unique.add(value);
    }
  });
  return Array.from(unique);
};

const normalizeSolvedEntries = (solved = []) => {
  const solvedMap = new Map();

  solved.forEach((entry) => {
    const rawQuestionId = typeof entry === 'number' ? entry : entry?.questionId;
    const questionId = Number(rawQuestionId);
    if (!Number.isFinite(questionId)) return;

    const solvedDate = startOfDay(
      typeof entry === 'number' ? new Date() : entry?.solvedDate || new Date()
    ) || startOfDay(new Date());

    const source = isValidSource(entry?.source) ? entry.source : 'coding_sheet';
    const previous = solvedMap.get(questionId);

    if (!previous || solvedDate > previous.solvedDate) {
      solvedMap.set(questionId, {
        questionId,
        solvedDate,
        source
      });
    }
  });

  return Array.from(solvedMap.values()).sort((a, b) => a.questionId - b.questionId);
};

const sanitizeModuleMetric = (metric = {}) => ({
  attempts: Math.max(0, Math.round(toNumber(metric.attempts, 0))),
  completed: Math.max(0, Math.round(toNumber(metric.completed, 0))),
  score: clampScore(metric.score),
  avgScore: clampScore(metric.avgScore ?? metric.score),
  bestScore: clampScore(metric.bestScore ?? metric.score),
  completionRate: clampScore(metric.completionRate),
  lastAttempt: metric.lastAttempt ? new Date(metric.lastAttempt) : null
});

const sanitizeModuleProgress = (moduleProgress = {}) => {
  const defaultProgress = getDefaultModuleProgress();
  MODULE_KEYS.forEach((module) => {
    defaultProgress[module] = sanitizeModuleMetric(moduleProgress[module]);
  });
  return defaultProgress;
};

const toSerializableSolvedIds = (progress) =>
  normalizeSolvedEntries(progress.solved).map((entry) => entry.questionId);

const getWeekNumber = (date) => {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstDayNr = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDayNr + 3);
  return 1 + Math.round((target - firstThursday) / (7 * MS_IN_A_DAY));
};

const startOfWeek = (dateValue) => {
  const date = startOfDay(dateValue);
  if (!date) return null;
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
};

const average = (values = []) => {
  if (!values.length) return 0;
  const sum = values.reduce((total, value) => total + value, 0);
  return Math.round(sum / values.length);
};

const extractCodingScore = (attempt) => {
  if (Number.isFinite(attempt?.percentage)) {
    return clampScore(attempt.percentage);
  }

  if (Number.isFinite(attempt?.correctAnswers) && Number.isFinite(attempt?.totalQuestions) && attempt.totalQuestions > 0) {
    return clampScore((attempt.correctAnswers / attempt.totalQuestions) * 100);
  }

  if (Number.isFinite(attempt?.score) && Number.isFinite(attempt?.totalQuestions) && attempt.totalQuestions > 0) {
    return clampScore((attempt.score / attempt.totalQuestions) * 100);
  }

  return clampScore(attempt?.score || 0);
};

const extractInterviewScore = (session) => {
  if (Number.isFinite(session?.scores?.overall)) {
    return clampScore(session.scores.overall);
  }
  return clampScore(session?.score || 0);
};

const toPerformanceRecord = (entry, scoreExtractor, dateField = 'createdAt') => {
  const date = new Date(entry?.[dateField] || entry?.updatedAt || entry?.createdAt || Date.now());
  if (Number.isNaN(date.getTime())) return null;
  return {
    date,
    score: clampScore(scoreExtractor(entry))
  };
};

const buildModuleMetricFromRecords = (records = []) => {
  const validScores = records
    .map((record) => record.score)
    .filter((score) => Number.isFinite(score));

  const attempts = records.length;
  const completed = attempts;
  const avgScore = average(validScores);
  const bestScore = validScores.length ? Math.max(...validScores) : 0;

  return {
    attempts,
    completed,
    score: avgScore,
    avgScore,
    bestScore: clampScore(bestScore),
    completionRate: attempts > 0 ? 100 : 0,
    lastAttempt: attempts > 0 ? records[records.length - 1].date : null
  };
};

const collectActivityDateKeys = (progress, codingRecords, aptitudeRecords, interviewRecords) => {
  const dateKeys = new Set();

  normalizeSolvedEntries(progress.solved).forEach((entry) => {
    const key = toDateKey(entry.solvedDate);
    if (key) dateKeys.add(key);
  });

  [codingRecords, aptitudeRecords, interviewRecords].forEach((records) => {
    records.forEach((record) => {
      const key = toDateKey(record.date);
      if (key) dateKeys.add(key);
    });
  });

  (progress.dayStreak?.activityLog || []).forEach((entry) => {
    if (!entry?.active) return;
    const key = toDateKey(entry.date);
    if (key) dateKeys.add(key);
  });

  return dateKeys;
};

const calculateStreakFromActivityKeys = (activityKeys) => {
  const sortedKeys = Array.from(activityKeys).sort();
  if (!sortedKeys.length) {
    return {
      current: 0,
      longest: 0,
      lastActivity: null
    };
  }

  const dates = sortedKeys.map((key) => keyToDate(key)).filter(Boolean);
  let longest = 1;
  let run = 1;

  for (let index = 1; index < dates.length; index += 1) {
    const difference = Math.round((dates[index] - dates[index - 1]) / MS_IN_A_DAY);
    if (difference === 1) {
      run += 1;
      if (run > longest) {
        longest = run;
      }
    } else if (difference > 1) {
      run = 1;
    }
  }

  let current = 1;
  for (let index = dates.length - 1; index > 0; index -= 1) {
    const difference = Math.round((dates[index] - dates[index - 1]) / MS_IN_A_DAY);
    if (difference === 1) {
      current += 1;
    } else {
      break;
    }
  }

  const today = startOfDay(new Date());
  const lastActivity = dates[dates.length - 1];
  const dayGap = Math.round((today - lastActivity) / MS_IN_A_DAY);
  if (dayGap > 1) {
    current = 0;
  }

  return {
    current,
    longest,
    lastActivity
  };
};

const buildActivityLogFromKeys = (activityKeys, existingLog = []) => {
  const existingSourceByDate = new Map();
  existingLog.forEach((entry) => {
    const key = toDateKey(entry?.date);
    if (key && entry?.source) {
      existingSourceByDate.set(key, entry.source);
    }
  });

  return Array.from(activityKeys)
    .sort()
    .slice(-365)
    .map((key) => ({
      date: keyToDate(key),
      active: true,
      source: isValidSource(existingSourceByDate.get(key))
        ? existingSourceByDate.get(key)
        : 'manual'
    }))
    .filter((entry) => entry.date);
};

const buildHeatmap = (activityLog = [], days = 28) => {
  const activeDates = new Set();
  activityLog.forEach((entry) => {
    if (!entry?.active) return;
    const key = toDateKey(entry.date);
    if (key) activeDates.add(key);
  });

  const heatmap = [];
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = startOfDay(new Date());
    date.setDate(date.getDate() - index);
    const key = toDateKey(date);
    heatmap.push({
      date,
      active: activeDates.has(key)
    });
  }

  return heatmap;
};

const calculateOverallScore = (moduleProgress) => {
  const scores = MODULE_KEYS.map((module) => clampScore(moduleProgress[module]?.score || 0));
  return average(scores);
};

const mergeModuleProgress = (existingModuleProgress, codingRecords, aptitudeRecords, interviewRecords) => {
  const merged = sanitizeModuleProgress(existingModuleProgress);
  merged.coding = buildModuleMetricFromRecords(codingRecords);
  merged.aptitude = buildModuleMetricFromRecords(aptitudeRecords);
  merged.aiInterview = buildModuleMetricFromRecords(interviewRecords);

  // Communication and core subjects are currently user-managed/manual.
  merged.communication = sanitizeModuleMetric(existingModuleProgress?.communication);
  merged.coreSubjects = sanitizeModuleMetric(existingModuleProgress?.coreSubjects);
  return merged;
};

const calculatePeriodAverage = (records, periodStart, periodEnd) => {
  const scores = records
    .filter((record) => record.date >= periodStart && record.date < periodEnd)
    .map((record) => record.score);
  return average(scores);
};

const buildWeeklyPerformance = (codingRecords, aptitudeRecords, interviewRecords, existingWeeks = []) => {
  const existingMap = new Map(
    (existingWeeks || []).map((weekEntry) => [`${weekEntry.year}-${weekEntry.week}`, weekEntry])
  );

  const chartPoints = [];
  const baseDate = startOfDay(new Date());

  for (let offset = WEEKS_IN_CHART - 1; offset >= 0; offset -= 1) {
    const target = new Date(baseDate);
    target.setDate(target.getDate() - offset * 7);
    const weekStart = startOfWeek(target);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const week = getWeekNumber(weekStart);
    const year = weekStart.getFullYear();

    const coding = calculatePeriodAverage(codingRecords, weekStart, weekEnd);
    const aptitude = calculatePeriodAverage(aptitudeRecords, weekStart, weekEnd);
    const aiInterview = calculatePeriodAverage(interviewRecords, weekStart, weekEnd);
    const existing = existingMap.get(`${year}-${week}`) || {};
    const communication = clampScore(existing.communication || 0);
    const coreSubjects = clampScore(existing.coreSubjects || 0);
    const overall = calculateOverallScore({
      aiInterview: { score: aiInterview },
      coding: { score: coding },
      aptitude: { score: aptitude },
      communication: { score: communication },
      coreSubjects: { score: coreSubjects }
    });

    chartPoints.push({
      week,
      year,
      weekStart,
      weekLabel: `${weekStart.toLocaleString('en-US', { month: 'short' })} ${weekStart.getDate()}`,
      overall,
      aiInterview,
      coding,
      aptitude,
      communication,
      coreSubjects
    });
  }

  return chartPoints;
};

const buildTopicProgress = (moduleProgress, existingTopics = []) => {
  const defaults = [
    { topicKey: 'dsa', topicName: 'Data Structures & Algorithms', module: 'coding' },
    { topicKey: 'aptitude_reasoning', topicName: 'Aptitude Reasoning', module: 'aptitude' },
    { topicKey: 'interview_readiness', topicName: 'Interview Readiness', module: 'aiInterview' },
    { topicKey: 'communication', topicName: 'Communication', module: 'communication' },
    { topicKey: 'core_subjects', topicName: 'Core Subjects', module: 'coreSubjects' }
  ];

  const existingMap = new Map();
  (existingTopics || []).forEach((topic) => {
    const key = topic.topicKey || topic.topicName?.toLowerCase().replace(/\s+/g, '_');
    if (key) existingMap.set(key, topic);
  });

  const mergedTopics = defaults.map((topic) => {
    const existing = existingMap.get(topic.topicKey);
    const calculated = clampScore(moduleProgress[topic.module]?.score || 0);
    const fallback = clampScore(existing?.completion || 0);

    return {
      topicKey: topic.topicKey,
      topicName: existing?.topicName || topic.topicName,
      completion: calculated > 0 ? calculated : fallback,
      lastUpdated: new Date()
    };
  });

  // Keep custom topics that are not part of defaults.
  existingMap.forEach((topic, key) => {
    const existsInDefaults = defaults.some((defaultTopic) => defaultTopic.topicKey === key);
    if (!existsInDefaults && topic?.topicName) {
      mergedTopics.push({
        topicKey: key,
        topicName: topic.topicName,
        completion: clampScore(topic.completion || 0),
        lastUpdated: topic.lastUpdated ? new Date(topic.lastUpdated) : new Date()
      });
    }
  });

  return mergedTopics;
};

const serializeNotes = (notesMap) => {
  if (!notesMap) return {};
  if (notesMap instanceof Map) {
    return Object.fromEntries(notesMap);
  }
  return notesMap;
};

const normalizeProgressDocument = async (progress) => {
  let shouldSave = false;

  const solved = normalizeSolvedEntries(progress.solved);
  if (JSON.stringify(progress.solved) !== JSON.stringify(solved)) {
    progress.solved = solved;
    shouldSave = true;
  }

  const starred = normalizeStarred(progress.starred);
  if (JSON.stringify(progress.starred) !== JSON.stringify(starred)) {
    progress.starred = starred;
    shouldSave = true;
  }

  if (!(progress.notes instanceof Map)) {
    progress.notes = new Map(Object.entries(progress.notes || {}));
    shouldSave = true;
  }

  const sanitizedModules = sanitizeModuleProgress(progress.moduleProgress);
  if (JSON.stringify(progress.moduleProgress) !== JSON.stringify(sanitizedModules)) {
    progress.moduleProgress = sanitizedModules;
    shouldSave = true;
  }

  if (shouldSave) {
    await progress.save();
  }

  return progress;
};

const ensureProgressDocument = async (userId) => {
  const progress = await userProgressModel.findOneAndUpdate(
    { userId },
    { $setOnInsert: getProgressInsertDefaults(userId) },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  return normalizeProgressDocument(progress);
};

const fetchUserPerformanceData = async (userId) => {
  const [codingAttempts, aptitudeAttempts, interviewSessions] = await Promise.all([
    TestAttempt.find({ userId, isSubmitted: true }).sort({ createdAt: 1 }).lean(),
    AptitudeTestAttempt.find({ userId, isSubmitted: true }).sort({ createdAt: 1 }).lean(),
    InterviewSession.find({ userId, status: 'completed' }).sort({ updatedAt: 1 }).lean()
  ]);

  const codingRecords = codingAttempts
    .map((attempt) => toPerformanceRecord(attempt, extractCodingScore, 'createdAt'))
    .filter(Boolean);

  const aptitudeRecords = aptitudeAttempts
    .map((attempt) => toPerformanceRecord(attempt, extractCodingScore, 'createdAt'))
    .filter(Boolean);

  const interviewRecords = interviewSessions
    .map((session) => toPerformanceRecord(session, extractInterviewScore, 'updatedAt'))
    .filter(Boolean);

  return {
    codingRecords,
    aptitudeRecords,
    interviewRecords
  };
};

const buildDashboardPayload = (progress) => ({
  overallScore: clampScore(progress.overallScore),
  totalProblemsSolved: Math.max(0, progress.totalProblemsSolved || 0),
  totalAttempts: Math.max(0, progress.totalAttempts || 0),
  dayStreak: Math.max(0, progress.dayStreak?.current || 0),
  longestDayStreak: Math.max(0, progress.dayStreak?.longest || 0),
  aiInterviewsDone: Math.max(0, progress.moduleProgress?.aiInterview?.completed || 0),
  moduleBreakdown: {
    aiInterview: clampScore(progress.moduleProgress?.aiInterview?.score || 0),
    coding: clampScore(progress.moduleProgress?.coding?.score || 0),
    aptitude: clampScore(progress.moduleProgress?.aptitude?.score || 0),
    communication: clampScore(progress.moduleProgress?.communication?.score || 0),
    coreSubjects: clampScore(progress.moduleProgress?.coreSubjects?.score || 0)
  },
  moduleProgress: progress.moduleProgress,
  topicProgress: progress.topicProgress || [],
  weeklyPerformance: progress.weeklyPerformance || [],
  activityLog: buildHeatmap(progress.dayStreak?.activityLog || [], 28),
  lastCalculated: progress.lastCalculated
});

const toRecommendationTone = (score) => {
  if (score >= 80) return 'advanced';
  if (score >= 60) return 'balanced';
  return 'foundational';
};

const getWeakestModules = (moduleScores = []) => {
  return [...moduleScores]
    .sort((a, b) => (a.score || 0) - (b.score || 0))
    .slice(0, 2)
    .map((module) => module.label);
};

const buildDashboardSummary = (dashboardPayload) => {
  const moduleScores = [
    { label: 'AI Interview', ...(dashboardPayload.moduleProgress?.aiInterview || {}) },
    { label: 'Coding', ...(dashboardPayload.moduleProgress?.coding || {}) },
    { label: 'Aptitude', ...(dashboardPayload.moduleProgress?.aptitude || {}) },
    { label: 'Communication', ...(dashboardPayload.moduleProgress?.communication || {}) },
    { label: 'Core Subjects', ...(dashboardPayload.moduleProgress?.coreSubjects || {}) }
  ];
  const weakestModules = getWeakestModules(moduleScores);
  const bestModule = [...moduleScores].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  const weeklyPerformance = dashboardPayload.weeklyPerformance || [];
  const latestWeek = weeklyPerformance[weeklyPerformance.length - 1];

  return {
    overallScore: dashboardPayload.overallScore || 0,
    totalAttempts: dashboardPayload.totalAttempts || 0,
    totalProblemsSolved: dashboardPayload.totalProblemsSolved || 0,
    dayStreak: dashboardPayload.dayStreak || 0,
    aiInterviewsDone: dashboardPayload.aiInterviewsDone || 0,
    tone: toRecommendationTone(dashboardPayload.overallScore || 0),
    weakestModules,
    strongestModule: bestModule?.label || null,
    latestWeeklySnapshot: latestWeek
      ? {
          overall: latestWeek.overall || 0,
          coding: latestWeek.coding || 0,
          aptitude: latestWeek.aptitude || 0,
          aiInterview: latestWeek.aiInterview || 0
        }
      : null
  };
};

const buildFallbackSuggestion = (focusArea, summary) => {
  const weakAreas = summary.weakestModules.length > 0
    ? summary.weakestModules.join(' and ')
    : 'your lowest-scoring modules';

  const codingScore = summary.latestWeeklySnapshot?.coding ?? 0;
  const interviewScore = summary.latestWeeklySnapshot?.aiInterview ?? 0;

  const templates = {
    weak_areas: `Your next high-impact move is to focus on ${weakAreas}. Spend 45 minutes daily on targeted practice, then review one mistake log entry before ending the session. Track whether each session improves accuracy or speed so we can adjust next week.`,
    coding_tips: `Your coding progress is currently around ${codingScore} this week. Do one timed problem block daily: 20 minutes solve, 10 minutes optimization, 10 minutes explanation aloud. Prioritize medium-level arrays/graphs first and write a short post-solution summary after each attempt.`,
    interview_tips: `Your interview performance is around ${interviewScore} this week. Run a 15-minute mock daily using STAR format: 2 behavioral answers + 1 technical explanation. Record yourself once every two days and improve one speaking habit per session.`,
    study_plan: `For the next 7 days: Day 1-3 focus on ${weakAreas}, Day 4-5 mix coding drills with aptitude revision, Day 6 do one mock interview, Day 7 review all mistakes and create the next week's top 5 goals. Keep sessions short, measurable, and consistent.`,
    general: `You are at ${summary.overallScore}% overall with a ${summary.dayStreak}-day streak. Keep momentum by maintaining daily consistency and doubling down on ${weakAreas}. Aim for one measurable win each day: one solved problem, one mock question, and one review note.`
  };

  return templates[focusArea] || templates.general;
};

const callClaudeMentor = async (focusArea, summary) => {
  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }

  const prompt = [
    'You are an AI interview prep mentor for HireViva.',
    'Generate one concise, practical, personalized suggestion in plain text.',
    'Keep it under 120 words and action-oriented.',
    `Focus area: ${focusArea}`,
    `Student data: ${JSON.stringify(summary)}`,
    'Do not use markdown bullets. Mention specific next actions and short timeframe.'
  ].join('\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: 260,
      temperature: 0.4,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const contentList = Array.isArray(data?.content) ? data.content : [];
  const textBlock = contentList.find((item) => item?.type === 'text');
  return textBlock?.text?.trim() || null;
};

const upsertActivityEntry = (progress, source = 'manual', occurredAt = new Date()) => {
  const normalizedSource = isValidSource(source) ? source : 'manual';
  const activityDate = startOfDay(occurredAt) || startOfDay(new Date());
  const activityKey = toDateKey(activityDate);
  const existingLog = progress.dayStreak?.activityLog || [];

  const existing = existingLog.find(
    (entry) => toDateKey(entry.date) === activityKey
  );

  if (!existing) {
    existingLog.push({
      date: activityDate,
      active: true,
      source: normalizedSource
    });
  } else {
    existing.active = true;
    if (!existing.source || existing.source === 'manual') {
      existing.source = normalizedSource;
    }
  }

  progress.dayStreak.activityLog = existingLog;
};

const recalculateProgressDocument = async (userId) => {
  const progress = await ensureProgressDocument(userId);
  const { codingRecords, aptitudeRecords, interviewRecords } = await fetchUserPerformanceData(userId);

  progress.solved = normalizeSolvedEntries(progress.solved);
  progress.starred = normalizeStarred(progress.starred);

  progress.moduleProgress = mergeModuleProgress(
    progress.moduleProgress,
    codingRecords,
    aptitudeRecords,
    interviewRecords
  );

  progress.totalProblemsSolved = progress.solved.length;
  progress.totalAttempts = MODULE_KEYS.reduce(
    (total, module) => total + (progress.moduleProgress[module]?.attempts || 0),
    0
  );
  progress.overallScore = calculateOverallScore(progress.moduleProgress);
  progress.topicProgress = buildTopicProgress(progress.moduleProgress, progress.topicProgress);
  progress.weeklyPerformance = buildWeeklyPerformance(
    codingRecords,
    aptitudeRecords,
    interviewRecords,
    progress.weeklyPerformance
  );

  const activityKeys = collectActivityDateKeys(progress, codingRecords, aptitudeRecords, interviewRecords);
  const streak = calculateStreakFromActivityKeys(activityKeys);
  progress.dayStreak.current = streak.current;
  progress.dayStreak.longest = Math.max(streak.longest, progress.dayStreak?.longest || 0);
  progress.dayStreak.lastActivity = streak.lastActivity;
  progress.dayStreak.activityLog = buildActivityLogFromKeys(activityKeys, progress.dayStreak?.activityLog || []);
  progress.lastCalculated = new Date();

  await progress.save();
  return progress;
};

/**
 * Recalculate all user progress metrics.
 * Deduplicates concurrent recalculations for the same user to avoid DB race conditions.
 */
export const recalculateUserProgress = async (userId) => {
  const lockKey = String(userId);

  if (inFlightRecalculations.has(lockKey)) {
    return inFlightRecalculations.get(lockKey);
  }

  const recalculationPromise = recalculateProgressDocument(userId)
    .finally(() => {
      inFlightRecalculations.delete(lockKey);
    });

  inFlightRecalculations.set(lockKey, recalculationPromise);
  return recalculationPromise;
};

/**
 * Add problem solved for DSA/coding-sheet tracking
 */
export const addProblemSolved = async (userId, questionId, source = 'coding_sheet') => {
  const progress = await ensureProgressDocument(userId);
  const normalizedQuestionId = Number(questionId);

  if (!Number.isFinite(normalizedQuestionId)) {
    throw new Error('Invalid questionId');
  }

  const alreadySolved = progress.solved.some((entry) => entry.questionId === normalizedQuestionId);
  if (!alreadySolved) {
    progress.solved.push({
      questionId: normalizedQuestionId,
      solvedDate: new Date(),
      source: isValidSource(source) ? source : 'coding_sheet'
    });
  }

  progress.solved = normalizeSolvedEntries(progress.solved);
  progress.totalProblemsSolved = progress.solved.length;
  upsertActivityEntry(progress, source);

  const activityKeys = collectActivityDateKeys(progress, [], [], []);
  const streak = calculateStreakFromActivityKeys(activityKeys);
  progress.dayStreak.current = streak.current;
  progress.dayStreak.longest = Math.max(streak.longest, progress.dayStreak?.longest || 0);
  progress.dayStreak.lastActivity = streak.lastActivity;
  progress.dayStreak.activityLog = buildActivityLogFromKeys(activityKeys, progress.dayStreak?.activityLog || []);
  progress.lastCalculated = new Date();

  await progress.save();
  return progress;
};

/**
 * Record generic activity and refresh streak counters.
 */
export const recordUserActivity = async (userId, source = 'manual', occurredAt = new Date()) => {
  const progress = await ensureProgressDocument(userId);
  upsertActivityEntry(progress, source, occurredAt);

  const activityKeys = collectActivityDateKeys(progress, [], [], []);
  const streak = calculateStreakFromActivityKeys(activityKeys);
  progress.dayStreak.current = streak.current;
  progress.dayStreak.longest = Math.max(streak.longest, progress.dayStreak?.longest || 0);
  progress.dayStreak.lastActivity = streak.lastActivity;
  progress.dayStreak.activityLog = buildActivityLogFromKeys(activityKeys, progress.dayStreak?.activityLog || []);
  progress.lastCalculated = new Date();

  await progress.save();
  return progress;
};

/**
 * Get complete dashboard payload.
 */
const getDashboardPayloadForUser = async (userId, { recalculate = true } = {}) => {
  const progress = recalculate
    ? await recalculateUserProgress(userId)
    : await ensureProgressDocument(userId);

  return buildDashboardPayload(progress);
};

/**
 * Get complete dashboard payload.
 */
export const getDashboardMetrics = async (userId) => {
  return getDashboardPayloadForUser(userId, { recalculate: true });
};

/**
 * Get KPI card metrics.
 */
export const getProgressMetrics = async (userId) => {
  const payload = await getDashboardPayloadForUser(userId, { recalculate: false });
  return {
    overallScore: payload.overallScore,
    totalProblemsSolved: payload.totalProblemsSolved,
    totalAttempts: payload.totalAttempts,
    dayStreak: payload.dayStreak,
    longestDayStreak: payload.longestDayStreak,
    aiInterviewsDone: payload.aiInterviewsDone,
    lastCalculated: payload.lastCalculated
  };
};

/**
 * Get score-centric dataset for module cards/radars.
 */
export const getProgressScores = async (userId) => {
  const payload = await getDashboardPayloadForUser(userId, { recalculate: false });

  const moduleScores = [
    {
      key: 'aiInterview',
      label: 'AI Interview',
      ...payload.moduleProgress.aiInterview
    },
    {
      key: 'coding',
      label: 'Coding',
      ...payload.moduleProgress.coding
    },
    {
      key: 'aptitude',
      label: 'Aptitude',
      ...payload.moduleProgress.aptitude
    },
    {
      key: 'communication',
      label: 'Communication',
      ...payload.moduleProgress.communication
    },
    {
      key: 'coreSubjects',
      label: 'Core Subjects',
      ...payload.moduleProgress.coreSubjects
    }
  ];

  return {
    overallScore: payload.overallScore,
    moduleScores
  };
};

/**
 * Get chart-specific datasets.
 */
export const getProgressCharts = async (userId) => {
  const payload = await getDashboardPayloadForUser(userId, { recalculate: false });
  return {
    weeklyPerformance: payload.weeklyPerformance,
    moduleBreakdown: payload.moduleBreakdown,
    topicProgress: payload.topicProgress,
    activityLog: payload.activityLog
  };
};

/**
 * Get a personalized mentor suggestion for the dashboard.
 */
export const getMentorSuggestion = async (userId, focusArea = 'general') => {
  const normalizedFocus = MENTOR_FOCUS_AREAS.includes(focusArea) ? focusArea : 'general';
  const dashboardPayload = await getDashboardMetrics(userId);
  const summary = buildDashboardSummary(dashboardPayload);
  let suggestion = null;
  let provider = 'fallback';

  try {
    suggestion = await callClaudeMentor(normalizedFocus, summary);
    if (suggestion) {
      provider = 'claude';
    }
  } catch (error) {
    console.error('Claude mentor suggestion error:', error.message);
  }

  if (!suggestion) {
    suggestion = buildFallbackSuggestion(normalizedFocus, summary);
  }

  return {
    provider,
    focusArea: normalizedFocus,
    suggestion,
    basedOn: {
      overallScore: summary.overallScore,
      dayStreak: summary.dayStreak,
      weakestModules: summary.weakestModules,
      strongestModule: summary.strongestModule
    }
  };
};

/**
 * Get simplified progress object for DSA tracker compatibility.
 */
export const getTrackerProgress = async (userId) => {
  const progress = await ensureProgressDocument(userId);

  return {
    solved: toSerializableSolvedIds(progress),
    starred: normalizeStarred(progress.starred),
    notes: serializeNotes(progress.notes)
  };
};
