import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import { Briefcase, Clock, Target, Video, Mic } from 'lucide-react'
import AIInterviewLayout from './AIInterviewLayout'
import './InterviewSetup.css'

const InterviewSetup = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const resumeText = state?.resumeText || null

    const { hasPermission, isLoading, error, requestPermissions } = useMediaDevices()
    const [config, setConfig] = useState({
        role: 'Software Engineer',
        duration: 15,
        difficulty: 'Medium'
    })

    const roles = [
        'Software Engineer',
        'Product Manager',
        'Data Scientist',
        'DevOps Engineer',
        'UI/UX Designer',
        'Business Analyst'
    ]

    const durations = [5, 15, 30]
    const difficulties = ['Easy', 'Medium', 'Hard']

    const handleStartInterview = async () => {
        if (!hasPermission) {
            await requestPermissions()
        } else {
            navigate('/ai-interview/room', {
                state: {
                    ...config,
                    resumeText // Pass resume text to interview room
                }
            })
        }
    }

    return (
        <AIInterviewLayout>
            <div className="interview-setup fade-in">
                <div className="setup-container">
                    <div className="setup-header">
                        <div className="logo">
                            <div className="logo-icon">🎯</div>
                            <h1>AI Interview Platform</h1>
                        </div>
                        <p className="tagline">Practice interviews with AI-powered feedback</p>
                    </div>

                    <div className="setup-card glass">
                        <h2 className="card-title">Configure Your Interview</h2>

                        <div className="input-group">
                            <label>
                                <Briefcase size={18} />
                                <span>Select Role</span>
                            </label>
                            <select
                                value={config.role}
                                onChange={(e) => setConfig({ ...config, role: e.target.value })}
                            >
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>
                                <Clock size={18} />
                                <span>Duration</span>
                            </label>
                            <div className="duration-options">
                                {durations.map(duration => (
                                    <button
                                        key={duration}
                                        className={`duration-btn ${config.duration === duration ? 'active' : ''}`}
                                        onClick={() => setConfig({ ...config, duration })}
                                    >
                                        {duration} min
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>
                                <Target size={18} />
                                <span>Difficulty Level</span>
                            </label>
                            <div className="difficulty-options">
                                {difficulties.map(difficulty => (
                                    <button
                                        key={difficulty}
                                        className={`difficulty-btn ${config.difficulty === difficulty ? 'active' : ''} ${difficulty.toLowerCase()}`}
                                        onClick={() => setConfig({ ...config, difficulty })}
                                    >
                                        {difficulty}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="permissions-section">
                            <h3>Camera & Microphone Access</h3>
                            <div className="permissions-status">
                                {hasPermission ? (
                                    <div className="permission-granted">
                                        <span className="status-icon">✅</span>
                                        <span>Permissions granted</span>
                                    </div>
                                ) : (
                                    <div className="permission-pending">
                                        <Video size={20} />
                                        <Mic size={20} />
                                        <span>Camera and microphone access required</span>
                                    </div>
                                )}
                            </div>
                            {error && <div className="error-message">{error}</div>}
                        </div>

                        <button
                            className="btn btn-primary start-btn"
                            onClick={handleStartInterview}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Requesting permissions...' : hasPermission ? 'Start Interview' : 'Grant Permissions & Start'}
                        </button>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card glass">
                            <div className="feature-icon">🤖</div>
                            <h3>AI-Powered</h3>
                            <p>Interview with advanced AI that adapts to your responses</p>
                        </div>
                        <div className="feature-card glass">
                            <div className="feature-icon">📊</div>
                            <h3>Detailed Feedback</h3>
                            <p>Get comprehensive analysis and improvement suggestions</p>
                        </div>
                        <div className="feature-card glass">
                            <div className="feature-icon">🎯</div>
                            <h3>Role-Specific</h3>
                            <p>Questions tailored to your selected role and difficulty</p>
                        </div>
                    </div>
                </div>
            </div>
        </AIInterviewLayout>
    )
}

export default InterviewSetup
