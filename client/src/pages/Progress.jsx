import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ModuleBreakdown from '../components/progress/ModuleBreakdown';
import WeeklyPerformance from '../components/progress/WeeklyPerformance';
import DayStreak from '../components/progress/DayStreak';
import TopicCompletion from '../components/progress/TopicCompletion';
import ActivityStreak from '../components/progress/ActivityStreak';
import './Progress.css';

const Progress = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchDashboardMetrics();
    const interval = setInterval(fetchDashboardMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/progress/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
        <button onClick={fetchDashboardMetrics}>Retry</button>
      </div>
    );
  }

  if (!metrics) {
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
        <p className="subtitle">Combined performance across all HireViva modules — last 30 days</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card overall-score">
          <div className="metric-label">OVERALL SCORE</div>
          <div className="metric-value">{metrics.overallScore}%</div>
          <div className="metric-change">↑ +6% from last week</div>
        </div>

        <div className="metric-card ai-interviews">
          <div className="metric-label">AI INTERVIEWS DONE</div>
          <div className="metric-value">{metrics.aiInterviewsDone}</div>
          <div className="metric-change">↑ 3 this week</div>
        </div>

        <div className="metric-card problems-solved">
          <div className="metric-label">PROBLEMS SOLVED</div>
          <div className="metric-value">{metrics.totalProblemsSolved}</div>
          <div className="metric-change">↑ +22 this month</div>
        </div>

        <div className="metric-card day-streak">
          <div className="metric-label">DAY STREAK 🔥</div>
          <div className="metric-value">{metrics.dayStreak}</div>
          <div className="metric-change">↑ Personal best!</div>
        </div>
      </div>

      {/* Charts and Analysis */}
      <div className="charts-grid">
        <div className="chart-container">
          <WeeklyPerformance data={metrics.weeklyPerformance} />
        </div>

        <div className="chart-container">
          <ModuleBreakdown data={metrics.moduleBreakdown} />
        </div>
      </div>

      {/* Topic-wise and Activity */}
      <div className="bottom-grid">
        <div className="section">
          <TopicCompletion data={metrics.topicProgress} />
        </div>

        <div className="section">
          <DayStreak />
        </div>

        <div className="section">
          <ActivityStreak />
        </div>
      </div>
    </div>
  );
};

export default Progress;
