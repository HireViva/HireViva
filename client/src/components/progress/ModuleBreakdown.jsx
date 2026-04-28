import React, { useState } from 'react';
import './ModuleBreakdown.css';

const ModuleBreakdown = ({ data }) => {
  const modules = [
    { key: 'aiInterview', label: 'AI Interview', color: '#8b5cf6' },
    { key: 'coding', label: 'Coding', color: '#00ff88' },
    { key: 'aptitude', label: 'Aptitude', color: '#ff6b9d' },
    { key: 'communication', label: 'Communication', color: '#3b82f6' },
    { key: 'coreSubjects', label: 'Core Subjects', color: '#f59e0b' }
  ];

  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const normalizedData = Object.entries(data).map(([key, value]) => ({
    key,
    value,
    percentage: Math.round((value / (total || 100)) * 100)
  }));

  // Create SVG pie chart
  const createPieChart = () => {
    let currentAngle = -90;
    const paths = [];
    const radius = 80;
    const centerX = 120;
    const centerY = 120;

    modules.forEach((module) => {
      const dataValue = data[module.key] || 0;
      const sliceAngle = (dataValue / 100) * 360;
      const endAngle = currentAngle + sliceAngle;

      const startRad = (currentAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = sliceAngle > 180 ? 1 : 0;

      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      paths.push(
        <path
          key={module.key}
          d={path}
          fill={module.color}
          opacity="0.8"
          className="pie-slice"
        />
      );

      currentAngle = endAngle;
    });

    return paths;
  };

  return (
    <div className="module-breakdown">
      <h3>Module Breakdown</h3>
      <p className="subtitle">Contribution to overall progress score</p>

      <div className="breakdown-content">
        <div className="pie-chart">
          <svg width="240" height="240" viewBox="0 0 240 240">
            {createPieChart()}
            <circle cx="120" cy="120" r="50" fill="#16213e" />
          </svg>
        </div>

        <div className="breakdown-list">
          {modules.map((module) => (
            <div key={module.key} className="breakdown-item">
              <div className="item-header">
                <div className="color-dot" style={{ backgroundColor: module.color }}></div>
                <span className="item-label">{module.label}</span>
              </div>
              <div className="item-value">{data[module.key] || 0}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleBreakdown;
