import React, { useEffect, useState } from 'react';
import { progressService } from '../../services/progressService';
import './ActivityStreak.css';

const toDateKey = (dateValue) => {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const buildLast28Days = (activityLog = []) => {
  const activeByDate = new Map();

  activityLog.forEach((entry) => {
    if (!entry?.date) return;
    activeByDate.set(toDateKey(entry.date), Boolean(entry.active));
  });

  const activities = [];
  for (let i = 27; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const dateKey = toDateKey(date);

    activities.push({
      date,
      active: activeByDate.get(dateKey) || false
    });
  }

  return activities;
};

const ActivityStreak = ({ activityLog = [] }) => {
  const [activities, setActivities] = useState(buildLast28Days(activityLog));
  const [loading, setLoading] = useState(activityLog.length === 0);

  useEffect(() => {
    const loadActivity = async () => {
      if (activityLog.length > 0) {
        setActivities(buildLast28Days(activityLog));
        setLoading(false);
        return;
      }

      try {
        const response = await progressService.getDayStreak();
        const apiLog = response?.data?.activityLog || [];
        setActivities(buildLast28Days(apiLog));
      } catch (error) {
        console.error('Error fetching activity streak:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [activityLog]);

  const renderActivityCalendar = () => {
    const weeks = [];
    for (let i = 0; i < activities.length; i += 7) {
      weeks.push(activities.slice(i, i + 7));
    }

    return weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="activity-week">
        {week.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`activity-day ${day.active ? 'active' : 'inactive'}`}
            title={day.date.toLocaleDateString()}
          ></div>
        ))}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="activity-streak">
        <h3>Activity Streak (Last 28 Days)</h3>
        <p>Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="activity-streak">
      <h3>Activity Streak (Last 28 Days)</h3>

      <div className="calendar-grid">
        {renderActivityCalendar()}
      </div>

      <div className="legend-info">
        <div className="legend-item">
          <div className="legend-dot inactive"></div>
          <span>No activity</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot active"></div>
          <span>Active day</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityStreak;
