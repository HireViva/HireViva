import React from 'react';
import './TopicCompletion.css';

const TopicCompletion = ({ data = [] }) => {
  const topics = [
    { name: 'Data Structures & Algorithms', completion: 82 },
    { name: 'System Design', completion: 55 },
    { name: 'DBMS & SQL', completion: 70 },
    { name: 'OS Concepts', completion: 48 },
    { name: 'Verbal Communication', completion: 55 },
    { name: 'Quant & Logical Reasoning', completion: 68 },
    { name: 'Networks & Security', completion: 40 }
  ];

  return (
    <div className="topic-completion">
      <h3>Topic-wise Completion</h3>
      <p className="subtitle">Across all learning modules</p>

      <div className="topics-list">
        {topics.map((topic, index) => (
          <div key={index} className="topic-item">
            <div className="topic-header">
              <span className="topic-name">{topic.name}</span>
              <span className="topic-percentage">{topic.completion}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${topic.completion}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicCompletion;
