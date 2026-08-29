import React, { useState, useEffect } from 'react';
import { progressService } from '../../services/progressService';
import './DayStreak.css';

const DayStreak = ({ data = null }) => {
  const [streak, setStreak] = useState(data);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) {
      setStreak(data);
      setLoading(false);
      return;
    }
    fetchDayStreak();
  }, [data]);

  const fetchDayStreak = async () => {
    try {
      const response = await progressService.getDayStreak();
      setStreak(response?.data || null);
    } catch (error) {
      console.error('Error fetching day streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="day-streak loading">Loading...</div>;

  return (
    <div className="day-streak">
      <h3>Day Streak</h3>
      <div className="streak-display">
        <div className="current-streak">
          <div className="streak-number">{streak?.current || 0}</div>
          <div className="streak-label">Current Streak</div>
        </div>
        <div className="separator">|</div>
        <div className="longest-streak">
          <div className="streak-number">{streak?.longest || 0}</div>
          <div className="streak-label">Longest Streak</div>
        </div>
      </div>
      <p className="reminder">Keep up your daily practice!</p>
    </div>
  );
};

export default DayStreak;
