import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './DayStreak.css';

const DayStreak = () => {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchDayStreak();
  }, []);

  const fetchDayStreak = async () => {
    try {
      const response = await fetch('/api/progress/day-streak', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStreak(data.data);
      }
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
      <p className="reminder">Keep up your daily practice! 🔥</p>
    </div>
  );
};

export default DayStreak;
