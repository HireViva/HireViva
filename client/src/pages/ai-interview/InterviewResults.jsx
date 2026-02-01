import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import interviewService from '../../services/interviewService'
import ScoreCard from '../../components/ai-interview/ScoreCard'
import { Home, RotateCcw, Download, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import AIInterviewLayout from './AIInterviewLayout'
import './InterviewResults.css'

const InterviewResults = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await interviewService.getInterview(id)
                setResults(data)
            } catch (error) {
                console.error('Error fetching results:', error)
                // Mock data for demo
                setResults({
                    overall: 78,
                    scores: {
                        technical: 75,
                        communication: 82,
                        problemSolving: 76,
                        confidence: 80
                    },
                    strengths: [
                        'Clear and articulate communication',
                        'Good understanding of core concepts',
                        'Confident in explaining thought process',
                        'Structured approach to problem-solving'
                    ],
                    improvements: [
                        'Could provide more specific examples',
                        'Consider edge cases in solutions',
                        'Practice explaining complex topics more simply'
                    ],
                    feedback: 'Overall, you demonstrated a solid understanding of the role requirements. Your communication skills are strong, and you articulated your thoughts clearly. To improve, focus on providing more concrete examples from your experience and consider edge cases when solving problems. Keep practicing, and you\'ll continue to improve!',
                    role: 'Software Engineer',
                    difficulty: 'Medium',
                    duration: 15
                })
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [id])

    const handleDownload = () => {
        // Create a simple text report
        const report = `
AI INTERVIEW RESULTS
===================

Overall Score: ${results.overall}/100
Role: ${results.role}
Difficulty: ${results.difficulty}
Duration: ${results.duration} minutes

CATEGORY SCORES
---------------
Technical: ${results.scores.technical}/100
Communication: ${results.scores.communication}/100
Problem Solving: ${results.scores.problemSolving}/100
Confidence: ${results.scores.confidence}/100

STRENGTHS
---------
${results.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

AREAS FOR IMPROVEMENT
--------------------
${results.improvements.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

DETAILED FEEDBACK
----------------
${results.feedback}
    `.trim()

        const blob = new Blob([report], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `interview-results-${id}.txt`
        a.click()
        URL.revokeObjectURL(url)
    }

    if (loading) {
        return (
            <div className="interview-results">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Analyzing your interview...</p>
                </div>
            </div>
        )
    }

    if (!results) {
        return (
            <div className="interview-results">
                <div className="error-container">
                    <p>Failed to load results</p>
                    <button className="btn btn-primary" onClick={() => navigate('/ai-interview')}>
                        Go Home
                    </button>
                </div>
            </div>
        )
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'success'
        if (score >= 60) return 'primary'
        return 'warning'
    }

    return (
        <AIInterviewLayout>
            <div className="interview-results fade-in">
                <div className="results-container">
                    {/* Header */}
                    <div className="results-header">
                        <h1>Interview Complete! 🎉</h1>
                        <p>Here's your detailed performance analysis</p>
                    </div>

                    {/* Overall Score */}
                    <div className="overall-score glass">
                        <div className="score-circle">
                            <svg viewBox="0 0 200 200">
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke="rgba(148, 163, 184, 0.1)"
                                    strokeWidth="12"
                                />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(results.overall / 100) * 565.48} 565.48`}
                                    transform="rotate(-90 100 100)"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="var(--primary)" />
                                        <stop offset="100%" stopColor="var(--secondary)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="score-value">
                                <span className="score-number">{results.overall}</span>
                                <span className="score-max">/100</span>
                            </div>
                        </div>
                        <div className="score-details">
                            <h2>Overall Performance</h2>
                            <div className="interview-meta">
                                <span className="meta-item">📋 {results.role}</span>
                                <span className="meta-item">⚡ {results.difficulty}</span>
                                <span className="meta-item">⏱️ {results.duration} min</span>
                            </div>
                        </div>
                    </div>

                    {/* Category Scores */}
                    <div className="category-scores">
                        <h2 className="section-title">Category Breakdown</h2>
                        <div className="scores-grid">
                            <ScoreCard
                                title="Technical Skills"
                                score={results.scores.technical}
                                color={getScoreColor(results.scores.technical)}
                            />
                            <ScoreCard
                                title="Communication"
                                score={results.scores.communication}
                                color={getScoreColor(results.scores.communication)}
                            />
                            <ScoreCard
                                title="Problem Solving"
                                score={results.scores.problemSolving}
                                color={getScoreColor(results.scores.problemSolving)}
                            />
                            <ScoreCard
                                title="Confidence"
                                score={results.scores.confidence}
                                color={getScoreColor(results.scores.confidence)}
                            />
                        </div>
                    </div>

                    {/* Feedback Sections */}
                    <div className="feedback-sections">
                        <div className="feedback-section glass">
                            <div className="section-header success">
                                <CheckCircle2 size={24} />
                                <h3>Strengths</h3>
                            </div>
                            <ul className="feedback-list">
                                {results.strengths.map((strength, index) => (
                                    <li key={index}>
                                        <span className="bullet">✓</span>
                                        {strength}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="feedback-section glass">
                            <div className="section-header warning">
                                <TrendingUp size={24} />
                                <h3>Areas for Improvement</h3>
                            </div>
                            <ul className="feedback-list">
                                {results.improvements.map((improvement, index) => (
                                    <li key={index}>
                                        <span className="bullet">→</span>
                                        {improvement}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Detailed Feedback */}
                    <div className="detailed-feedback glass">
                        <div className="section-header">
                            <AlertCircle size={24} />
                            <h3>Detailed Feedback</h3>
                        </div>
                        <p className="feedback-text">{results.feedback}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button className="btn btn-secondary" onClick={() => navigate('/ai-interview')}>
                            <Home size={20} />
                            Go Home
                        </button>
                        <button className="btn btn-secondary" onClick={handleDownload}>
                            <Download size={20} />
                            Download Report
                        </button>
                        <button className="btn btn-primary" onClick={() => navigate('/ai-interview')}>
                            <RotateCcw size={20} />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        </AIInterviewLayout>
    )
}

export default InterviewResults
