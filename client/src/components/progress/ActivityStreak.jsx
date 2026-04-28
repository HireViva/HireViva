import React from 'react';
import './ActivityStreak.css';

const ActivityStreak = () => {
  // Generate activity data for last 28 days
  const generateActivityData = () => {
    const activities = [];
    for (let i = 27; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      activities.push({
        date,
        active: Math.random() > 0.3 // 70% chance of activity
      });
    }
    return activities;
  };

  const activities = generateActivityData();

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
