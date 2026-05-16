import React, { useMemo, useState } from 'react';
import { progressService } from '../../services/progressService';

const chips = [
  { key: 'weak_areas', label: 'Weak Areas' },
  { key: 'coding_tips', label: 'Coding Tips' },
  { key: 'interview_tips', label: 'Interview Tips' },
  { key: 'study_plan', label: 'Study Plan' }
];

const providerLabel = (provider) => {
  if (provider === 'claude') {
    return 'Claude-powered';
  }
  return 'AI recommendation';
};

const AIMentorSuggestions = ({ dashboard }) => {
  const [loading, setLoading] = useState(false);
  const [activeFocus, setActiveFocus] = useState('general');
  const [suggestion, setSuggestion] = useState('');
  const [provider, setProvider] = useState('fallback');
  const [error, setError] = useState(null);

  const quickContext = useMemo(() => {
    if (!dashboard) return '';
    return `Score ${dashboard.overallScore}% | Streak ${dashboard.dayStreak} days | Attempts ${dashboard.totalAttempts}`;
  }, [dashboard]);

  const fetchSuggestion = async (focusArea = 'general') => {
    setLoading(true);
    setError(null);
    setActiveFocus(focusArea);

    try {
      const response = await progressService.getMentorSuggestion(focusArea);
      const data = response?.data;
      setSuggestion(data?.suggestion || 'No suggestion generated right now.');
      setProvider(data?.provider || 'fallback');
    } catch (requestError) {
      console.error('Mentor suggestion error:', requestError);
      setError(requestError?.response?.data?.message || 'Failed to get suggestion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentor-section">
      <div className="mentor-header">
        <h3>AI Mentor Suggestions</h3>
        <p className="mentor-subtitle">
          Click a chip or use the main button for a personalized suggestion based on your live dashboard scores.
        </p>
        <p className="mentor-context">{quickContext}</p>
      </div>

      <div className="mentor-chip-row">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => fetchSuggestion(chip.key)}
            disabled={loading}
            className={`mentor-chip ${activeFocus === chip.key ? 'active' : ''}`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mentor-main-btn"
        onClick={() => fetchSuggestion('general')}
        disabled={loading}
      >
        {loading ? 'Generating suggestion...' : 'Get Personalized Mentor Suggestion'}
      </button>

      {error && <p className="mentor-error">{error}</p>}

      {suggestion && !error && (
        <div className="mentor-output">
          <div className="mentor-output-meta">{providerLabel(provider)}</div>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default AIMentorSuggestions;
