const CORE_SUBJECT_LABELS = {
  1: "OS",
  2: "DBMS",
  3: "CN",
  4: "OOP",
  5: "DSA",
};

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const round = (value, digits = 1) => {
  const factor = 10 ** digits;
  return Math.round(safeNumber(value) * factor) / factor;
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return [];
};

const getDateValue = (item) => item?.completedAt || item?.createdAt || item?.updatedAt || item?.date;

const formatDateLabel = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recent";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getAttemptScore = (attempt) => {
  if (!attempt) return 0;
  if (attempt.percentage !== undefined && attempt.percentage !== null) return safeNumber(attempt.percentage);
  if (attempt.totalQuestions) {
    return (safeNumber(attempt.correctAnswers) / safeNumber(attempt.totalQuestions, 1)) * 100;
  }
  return safeNumber(attempt.score);
};

export const normalizeQuizAttempts = (response, section) =>
  toArray(response?.attempts)
    .map((attempt) => ({
      id: attempt._id || attempt.id || attempt.attemptId,
      section,
      testSet: attempt.testSet || attempt.testId,
      score: round(getAttemptScore(attempt)),
      correctAnswers: safeNumber(attempt.correctAnswers),
      totalQuestions: safeNumber(attempt.totalQuestions),
      completedAt: getDateValue(attempt),
    }))
    .filter((attempt) => attempt.score >= 0);

export const normalizeInterviewAttempts = (response) =>
  toArray(response?.attempts || response?.sessions || response?.interviews || response?.history)
    .map((item) => ({
      id: item._id || item.id || item.sessionId,
      section: "AI Interview",
      score: round(item.overall ?? item.scores?.overall ?? item.score),
      role: item.role,
      completedAt: getDateValue(item),
    }))
    .filter((item) => item.score > 0);

export const buildTrendData = (attempts, fallbackLabel = "Recent") => {
  const sorted = [...attempts].sort((a, b) => {
    const first = new Date(a.completedAt || 0).getTime();
    const second = new Date(b.completedAt || 0).getTime();
    return first - second;
  });

  if (!sorted.length) return [];

  return sorted.map((attempt, index) => ({
    label: attempt.completedAt ? formatDateLabel(attempt.completedAt) : `${fallbackLabel} ${index + 1}`,
    score: round(attempt.score),
    section: attempt.section,
  }));
};

export const buildOverallTrend = (attempts, codingCompletion) => {
  const trend = buildTrendData(attempts);

  if (trend.length) return trend;
  if (codingCompletion > 0) {
    return [{ label: "Current", score: round(codingCompletion), section: "Coding Sheet" }];
  }

  return [];
};

export const calculateAverageScore = (attempts, codingCompletion) => {
  const scores = attempts.map((attempt) => safeNumber(attempt.score)).filter((score) => score > 0);
  if (codingCompletion > 0) scores.push(codingCompletion);
  if (!scores.length) return 0;

  return round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

export const calculateImprovement = (attempts) => {
  const dated = attempts
    .filter((attempt) => attempt.completedAt)
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

  if (dated.length < 2) return 0;

  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const currentWeek = dated.filter((attempt) => now - new Date(attempt.completedAt).getTime() <= weekMs);
  const previousWeek = dated.filter((attempt) => {
    const age = now - new Date(attempt.completedAt).getTime();
    return age > weekMs && age <= weekMs * 2;
  });

  const currentWindow = currentWeek.length ? currentWeek : dated.slice(Math.ceil(dated.length / 2));
  const previousWindow = previousWeek.length ? previousWeek : dated.slice(0, Math.floor(dated.length / 2));

  const currentAvg = average(currentWindow.map((attempt) => attempt.score));
  const previousAvg = average(previousWindow.map((attempt) => attempt.score));

  if (!previousAvg) return currentAvg ? round(currentAvg) : 0;
  return round(((currentAvg - previousAvg) / previousAvg) * 100);
};

const average = (values) => {
  const numbers = values.map((value) => safeNumber(value)).filter((value) => Number.isFinite(value));
  if (!numbers.length) return 0;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
};

export const buildCodingAnalytics = (progress, questions) => {
  const solvedIds = new Set(progress?.solved || []);
  const solvedQuestions = questions.filter((question) => solvedIds.has(question.id));
  const byDifficulty = DIFFICULTIES.map((difficulty) => {
    const total = questions.filter((question) => question.difficulty === difficulty).length;
    const solved = solvedQuestions.filter((question) => question.difficulty === difficulty).length;

    return {
      label: difficulty,
      solved,
      total,
      rate: total ? round((solved / total) * 100) : 0,
    };
  });

  const totalSolved = solvedQuestions.length;
  const successRate = questions.length ? round((totalSolved / questions.length) * 100) : 0;
  const weakestDifficulty = [...byDifficulty].sort((a, b) => a.rate - b.rate)[0]?.label || "Easy";

  return {
    byDifficulty,
    totalSolved,
    totalQuestions: questions.length,
    successRate,
    insight:
      totalSolved > 0
        ? `${successRate}% completion across the coding sheet. Focus next on ${weakestDifficulty}.`
        : "Start solving problems to unlock difficulty-wise insights.",
  };
};

export const buildSubjectAnalytics = (attempts, statsByTestSet = {}) => {
  const grouped = new Map();

  attempts.forEach((attempt) => {
    const key = String(attempt.testSet || "General");
    const item = grouped.get(key) || { scores: [], attempts: 0 };
    item.scores.push(attempt.score);
    item.attempts += 1;
    grouped.set(key, item);
  });

  Object.entries(statsByTestSet || {}).forEach(([key, value]) => {
    const testSet = String(key);
    if (grouped.has(testSet)) return;
    grouped.set(testSet, {
      scores: [safeNumber(value.avgScore || value.bestScore)],
      attempts: safeNumber(value.attempts),
    });
  });

  const subjects = [...grouped.entries()].map(([testSet, value]) => ({
    label: CORE_SUBJECT_LABELS[testSet] || `Set ${testSet}`,
    score: round(average(value.scores)),
    attempts: value.attempts,
  }));

  const sorted = [...subjects].sort((a, b) => b.score - a.score);
  const strongest = sorted[0] || null;
  const weakest = sorted[sorted.length - 1] || null;

  return {
    subjects,
    strongest,
    weakest,
    insight:
      strongest && weakest
        ? `Strongest area: ${strongest.label}. Weak area: ${weakest.label}.`
        : "Complete a core subject mock test to reveal strongest and weakest areas.",
  };
};

export const buildAccuracyAnalytics = (attempts, stats = {}) => {
  const totalAttempts = safeNumber(stats?.totalAttempts || stats?.totalCompleted || attempts.length);
  const totalQuestions = attempts.reduce((sum, attempt) => sum + safeNumber(attempt.totalQuestions), 0);
  const correctAnswers = attempts.reduce((sum, attempt) => sum + safeNumber(attempt.correctAnswers), 0);
  const accuracy = totalQuestions ? round((correctAnswers / totalQuestions) * 100) : round(stats?.averageScore || 0);
  const improvement = calculateImprovement(attempts);

  return {
    accuracy,
    totalAttempts,
    improvement,
    insight:
      totalAttempts > 1
        ? `Performance ${improvement >= 0 ? "improved" : "changed"} by ${Math.abs(improvement)}%.`
        : "Take more attempts to generate a reliable improvement trend.",
  };
};

export const buildInterviewAnalytics = (attempts) => {
  const avgScore = calculateAverageScore(attempts, 0);
  const improvement = calculateImprovement(attempts);

  return {
    trend: buildTrendData(attempts, "Interview"),
    totalInterviews: attempts.length,
    avgScore,
    improvement,
    insight:
      attempts.length > 1
        ? `Performance ${improvement >= 0 ? "improved" : "changed"} by ${Math.abs(improvement)}%.`
        : "Complete more interviews to build a performance trend.",
  };
};

export const sortLatestFirst = (attempts) =>
  [...attempts].sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
