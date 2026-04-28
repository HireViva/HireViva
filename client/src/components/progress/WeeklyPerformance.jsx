import React, { useMemo } from 'react';
import './WeeklyPerformance.css';

const WeeklyPerformance = ({ data = [] }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        weeks: [],
        datasets: []
      };
    }

    const weeks = data.map(w => `W${w.week}`);
    
    return {
      weeks,
      datasets: [
        {
          name: 'AI Interview',
          data: data.map(w => w.aiInterview || 0),
          color: '#8b5cf6'
        },
        {
          name: 'Coding',
          data: data.map(w => w.coding || 0),
          color: '#00ff88'
        },
        {
          name: 'Aptitude',
          data: data.map(w => w.aptitude || 0),
          color: '#ff6b9d'
        },
        {
          name: 'Communication',
          data: data.map(w => w.communication || 0),
          color: '#3b82f6'
        },
        {
          name: 'Core Subjects',
          data: data.map(w => w.coreSubjects || 0),
          color: '#f59e0b'
        }
      ]
    };
  }, [data]);

  const createLineChart = () => {
    if (chartData.weeks.length === 0) return null;

    const width = 400;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    const xStep = graphWidth / (chartData.weeks.length - 1 || 1);
    const yMax = 100;
    const yStep = graphHeight / yMax;

    const lines = chartData.datasets.map((dataset) => {
      let pathData = '';
      dataset.data.forEach((value, index) => {
        const x = padding.left + index * xStep;
        const y = padding.top + graphHeight - value * yStep;
        pathData += (index === 0 ? 'M' : 'L') + ` ${x} ${y}`;
      });

      return (
        <path
          key={dataset.name}
          d={pathData}
          stroke={dataset.color}
          strokeWidth="2"
          fill="none"
          className="chart-line"
        />
      );
    });

    // X-axis labels
    const xLabels = chartData.weeks.map((week, index) => (
      <text
        key={`x-${index}`}
        x={padding.left + index * xStep}
        y={height - 10}
        textAnchor="middle"
        fontSize="12"
        fill="#a0a0a0"
      >
        {week}
      </text>
    ));

    // Y-axis labels
    const yLabels = [0, 25, 50, 75, 100].map((value) => (
      <text
        key={`y-${value}`}
        x={padding.left - 10}
        y={padding.top + graphHeight - (value * graphHeight) / 100}
        textAnchor="end"
        fontSize="12"
        fill="#a0a0a0"
      >
        {value}
      </text>
    ));

    return (
      <svg width="100%" height="240" viewBox={`0 0 ${width} ${height}`}>
        {/* Grid */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#404050"
          strokeWidth="1"
        />
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width}
          y2={height - padding.bottom}
          stroke="#404050"
          strokeWidth="1"
        />

        {/* Horizontal grid lines */}
        {[0, 25, 50, 75, 100].map((value) => (
          <line
            key={`grid-${value}`}
            x1={padding.left}
            y1={padding.top + graphHeight - (value * graphHeight) / 100}
            x2={width - padding.right}
            y2={padding.top + graphHeight - (value * graphHeight) / 100}
            stroke="#404050"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}

        {/* Lines */}
        {lines}

        {/* Labels */}
        {xLabels}
        {yLabels}
      </svg>
    );
  };

  return (
    <div className="weekly-performance">
      <h3>Combined Weekly Performance</h3>
      <p className="subtitle">AI Interview • Coding • Aptitude • Communication • Core Subjects</p>

      <div className="chart-wrapper">
        {createLineChart()}
      </div>

      <div className="legend">
        {chartData.datasets.map((dataset) => (
          <div key={dataset.name} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: dataset.color }}
            ></div>
            <span>{dataset.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyPerformance;
