import React from 'react';
import './TopicCompletion.css';

const TopicCompletion = ({ data = [] }) => {
  const fallbackTopics = [
    { name: 'Data Structures & Algorithms', completion: 0 },
    { name: 'Aptitude Reasoning', completion: 0 },
    { name: 'Interview Readiness', completion: 0 },
    { name: 'Communication', completion: 0 },
    { name: 'Core Subjects', completion: 0 }
  ];
  const topics = Array.isArray(data) && data.length > 0
    ? data.map((topic) => ({
        name: topic.topicName || 'Untitled Topic',
        completion: Math.max(0, Math.min(100, Number(topic.completion) || 0))
      }))
    : fallbackTopics;

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
