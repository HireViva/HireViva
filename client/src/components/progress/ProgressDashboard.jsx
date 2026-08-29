import React, { useEffect, useRef, useState } from 'react';
import ModuleBreakdown from './ModuleBreakdown';
import WeeklyPerformance from './WeeklyPerformance';
import DayStreak from './DayStreak';
import TopicCompletion from './TopicCompletion';
import ActivityStreak from './ActivityStreak';
import AIMentorSuggestions from './AIMentorSuggestions';
import { progressService } from '../../services/progressService';
import '../../pages/Progress.css';

const getModuleBreakdownFromScores = (scoresData = {}) => {
  const moduleScores = Array.isArray(scoresData.moduleScores) ? scoresData.moduleScores : [];
  return moduleScores.reduce((acc, module) => {
    acc[module.key] = Number(module.score) || 0;
    return acc;
  }, {});
};

const normalizeDashboardData = (dashboardData = {}) => ({
  overallScore: Number(dashboardData.overallScore ?? 0),
  totalProblemsSolved: Number(dashboardData.totalProblemsSolved ?? 0),
  totalAttempts: Number(dashboardData.totalAttempts ?? 0),
  dayStreak: Number(dashboardData.dayStreak ?? 0),
  longestDayStreak: Number(dashboardData.longestDayStreak ?? 0),
  aiInterviewsDone: Number(dashboardData.aiInterviewsDone ?? 0),
  moduleBreakdown: dashboardData.moduleBreakdown || getModuleBreakdownFromScores(dashboardData),
  moduleScores: dashboardData.moduleScores || [],
  weeklyPerformance: dashboardData.weeklyPerformance || [],
  topicProgress: dashboardData.topicProgress || [],
  activityLog: dashboardData.activityLog || [],
  lastCalculated: dashboardData.lastCalculated || null
});

const normalizeDashboardPayload = ({
  metricsData = {},
  scoresData = {},
  chartsData = {}
}) => normalizeDashboardData({
  overallScore: Number(metricsData.overallScore ?? scoresData.overallScore ?? 0),
  totalProblemsSolved: Number(metricsData.totalProblemsSolved ?? 0),
  totalAttempts: Number(metricsData.totalAttempts ?? 0),
  dayStreak: Number(metricsData.dayStreak ?? 0),
  longestDayStreak: Number(metricsData.longestDayStreak ?? 0),
  aiInterviewsDone: Number(metricsData.aiInterviewsDone ?? 0),
  moduleBreakdown: chartsData.moduleBreakdown || getModuleBreakdownFromScores(scoresData),
  moduleScores: scoresData.moduleScores || [],
  weeklyPerformance: chartsData.weeklyPerformance || [],
  topicProgress: chartsData.topicProgress || [],
  activityLog: chartsData.activityLog || [],
  lastCalculated: metricsData.lastCalculated || null
});

const formatLastCalculated = (value) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return date.toLocaleString();
};

const ProgressDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dashboardRef = useRef(null);

  useEffect(() => {
    dashboardRef.current = dashboard;
  }, [dashboard]);

  useEffect(() => {
    fetchDashboardMetrics();

    const interval = setInterval(() => {
      fetchDashboardMetrics(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardMetrics = async (silentRefresh = false) => {
    if (!silentRefresh) {
      setLoading(true);
    }

    try {
      const dashboardResponse = await progressService.getDashboard();
      const normalized = normalizeDashboardData(dashboardResponse?.data || {});
      dashboardRef.current = normalized;
      setDashboard(normalized);
      setError(null);
    } catch (dashboardError) {
      try {
        const [metricsResponse, scoresResponse, chartsResponse] = await Promise.all([
          progressService.getMetrics(),
          progressService.getScores(),
          progressService.getCharts()
        ]);

        const normalized = normalizeDashboardPayload({
          metricsData: metricsResponse?.data || {},
          scoresData: scoresResponse?.data || {},
          chartsData: chartsResponse?.data || {}
        });

        dashboardRef.current = normalized;
        setDashboard(normalized);
        setError(null);
      } catch (composedError) {
        console.error('Error fetching dashboard:', composedError);
        const message =
          composedError?.response?.data?.message ||
          dashboardError?.response?.data?.message ||
          composedError?.message ||
          'Failed to fetch progress dashboard data';

        if (!silentRefresh || !dashboardRef.current) {
          setError(message);
        }
      }
    } finally {
      if (!silentRefresh) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="progress-container loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-container error">
        <p>Error loading progress: {error}</p>
        <button onClick={() => fetchDashboardMetrics(false)}>Retry</button>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="progress-container">
        <p>No metrics available yet</p>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h1>Your Progress Overview</h1>
        <p className="subtitle">
          Live performance across HireViva modules | Last updated: {formatLastCalculated(dashboard.lastCalculated)}
        </p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card metric-overall">
          <div className="metric-label">OVERALL SCORE</div>
          <div className="metric-value">{dashboard.overallScore}%</div>
          <div className="metric-change">{dashboard.totalAttempts} total attempts</div>
        </div>

        <div className="metric-card metric-ai-interviews">
          <div className="metric-label">AI INTERVIEWS DONE</div>
          <div className="metric-value">{dashboard.aiInterviewsDone}</div>
          <div className="metric-change">Interviews completed</div>
        </div>

        <div className="metric-card metric-problems-solved">
          <div className="metric-label">PROBLEMS SOLVED</div>
          <div className="metric-value">{dashboard.totalProblemsSolved}</div>
          <div className="metric-change">Coding sheet completions</div>
        </div>

        <div className="metric-card metric-day-streak">
          <div className="metric-label">DAY STREAK</div>
          <div className="metric-value">{dashboard.dayStreak}</div>
          <div className="metric-change">Best streak: {dashboard.longestDayStreak} days</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <WeeklyPerformance data={dashboard.weeklyPerformance} />
        </div>

        <div className="chart-container">
          <ModuleBreakdown data={dashboard.moduleBreakdown} />
        </div>
      </div>

      <AIMentorSuggestions dashboard={dashboard} />

      <div className="bottom-grid">
        <div className="section">
          <TopicCompletion data={dashboard.topicProgress} />
        </div>

        <div className="section">
          <DayStreak data={{
            current: dashboard.dayStreak,
            longest: dashboard.longestDayStreak,
            activityLog: dashboard.activityLog
          }} />
        </div>

        <div className="section">
          <ActivityStreak activityLog={dashboard.activityLog} />
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
