import React, { useMemo } from 'react';
import './ModuleBreakdown.css';

const modules = [
  { key: 'aiInterview', label: 'AI Interview', color: '#8b5cf6' },
  { key: 'coding', label: 'Coding', color: '#00ff88' },
  { key: 'aptitude', label: 'Aptitude', color: '#ff6b9d' },
  { key: 'communication', label: 'Communication', color: '#3b82f6' },
  { key: 'coreSubjects', label: 'Core Subjects', color: '#f59e0b' }
];

const toScore = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, numeric));
};

const ModuleBreakdown = ({ data = {} }) => {
  const moduleData = useMemo(() => {
    const values = modules.map((module) => ({
      ...module,
      value: toScore(data[module.key])
    }));

    const total = values.reduce((sum, module) => sum + module.value, 0);
    const average = values.length > 0
      ? Math.round(total / values.length)
      : 0;

    return {
      values: values.map((module) => ({
        ...module,
        share: total > 0 ? (module.value / total) * 100 : 0
      })),
      total,
      average
    };
  }, [data]);

  const createPieChart = () => {
    if (moduleData.total === 0) return null;

    let currentAngle = -90;
    const paths = [];
    const radius = 80;
    const centerX = 120;
    const centerY = 120;

    moduleData.values.forEach((module) => {
      if (module.share <= 0) return;

      const sliceAngle = (module.share / 100) * 360;
      const endAngle = currentAngle + sliceAngle;
      const startRad = (currentAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);
      const largeArc = sliceAngle > 180 ? 1 : 0;

      paths.push(
        <path
          key={module.key}
          d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={module.color}
          opacity="0.85"
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
          <svg width="240" height="240" viewBox="0 0 240 240" role="img" aria-label="Module contribution chart">
            <circle
              cx="120"
              cy="120"
              r="80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="20"
            />
            {createPieChart()}
            <circle cx="120" cy="120" r="50" fill="#16213e" />
            <text x="120" y="116" textAnchor="middle" fill="#e8efff" fontSize="22" fontWeight="700">
              {moduleData.average}%
            </text>
            <text x="120" y="136" textAnchor="middle" fill="#9db0d9" fontSize="11">
              Avg Score
            </text>
          </svg>
        </div>

        <div className="breakdown-list">
          {moduleData.values.map((module) => (
            <div key={module.key} className="breakdown-item">
              <div className="item-header">
                <div className="color-dot" style={{ backgroundColor: module.color }}></div>
                <span className="item-label">{module.label}</span>
              </div>
              <div className="item-value">{Math.round(module.value)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleBreakdown;
