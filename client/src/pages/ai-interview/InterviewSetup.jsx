import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import { Briefcase, Clock, Target, Video, Mic, CheckCircle2, AlertCircle, ArrowLeft, Settings2 } from 'lucide-react'
import AIInterviewLayout from './AIInterviewLayout'
import UpgradePrompt from '../../components/UpgradePrompt'
import { useSubscription } from '../../hooks/useSubscription'
import { motion } from 'framer-motion'

const InterviewSetup = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const resumeText = state?.resumeText || null

    const { hasPermission, isLoading, error, requestPermissions } = useMediaDevices()
    const { subscription, canAccessAIInterview, loading: subLoading } = useSubscription()
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
    const [config, setConfig] = useState({
        role: 'Software Engineer',
        duration: 15,
        difficulty: 'Medium'
    })

    useEffect(() => {
        if (!subLoading && !canAccessAIInterview()) {
            setShowUpgradePrompt(true)
        }
    }, [subLoading, canAccessAIInterview])

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
        if (!canAccessAIInterview()) {
            setShowUpgradePrompt(true)
            return
        }

        let permitted = hasPermission
        if (!permitted) {
            const stream = await requestPermissions()
            permitted = !!stream
        }

        if (permitted) {
            navigate('/ai-interview/room', {
                state: {
                    ...config,
                    resumeText 
                }
            })
        }
    }

    return (
        <AIInterviewLayout>
            <div className="flex flex-col h-full overflow-hidden relative p-2 sm:p-4 md:p-6">
                {showUpgradePrompt && (
                    <UpgradePrompt
                        currentTier={subscription?.tier || 'free'}
                        requiredTier="pro"
                        feature="AI Interview"
                        onClose={() => setShowUpgradePrompt(false)}
                    />
                )}

                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px]" />
                </div>

                <div className="w-full max-w-4xl mx-auto flex flex-col h-full relative z-10">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-8 shrink-0">
                        <button
                            onClick={() => navigate('/ai-interview')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/50 hover:bg-muted/80 text-sm text-muted-foreground transition-all group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                            <Settings2 size={14} className="text-primary" />
                            <span className="text-xs font-medium text-primary uppercase tracking-wider">Interview Setup</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-h-0">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
                            
                            <div className="p-6 sm:p-8 relative z-10 flex flex-col lg:flex-row gap-8">
                                
                                {/* Left Side: Configuration */}
                                <div className="flex-1 flex flex-col gap-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground mb-1">Configure Parameters</h2>
                                        <p className="text-sm text-muted-foreground">Adjust the settings to match your desired interview experience.</p>
                                    </div>

                                    {/* Role Selector */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                            <Briefcase size={16} className="text-primary" />
                                            Target Role
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={config.role}
                                                onChange={(e) => setConfig({ ...config, role: e.target.value })}
                                                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                                            >
                                                {roles.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Duration Selector */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                            <Clock size={16} className="text-primary" />
                                            Interview Duration
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {durations.map(duration => (
                                                <button
                                                    key={duration}
                                                    onClick={() => setConfig({ ...config, duration })}
                                                    className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                                                        config.duration === duration 
                                                        ? 'bg-primary/20 border-primary text-primary' 
                                                        : 'bg-background border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-background/80'
                                                    }`}
                                                >
                                                    {duration} min
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Difficulty Selector */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                            <Target size={16} className="text-primary" />
                                            Difficulty Level
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {difficulties.map(difficulty => (
                                                <button
                                                    key={difficulty}
                                                    onClick={() => setConfig({ ...config, difficulty })}
                                                    className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                                                        config.difficulty === difficulty 
                                                        ? 'bg-secondary/20 border-secondary text-secondary' 
                                                        : 'bg-background border-border/50 text-muted-foreground hover:border-secondary/50 hover:bg-background/80'
                                                    }`}
                                                >
                                                    {difficulty}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Permissions & Action */}
                                <div className="flex-1 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border/50 pt-6 lg:pt-0 lg:pl-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground mb-1">System Check</h3>
                                            <p className="text-sm text-muted-foreground">We need access to your camera and microphone to conduct the interview.</p>
                                        </div>

                                        <div className={`p-4 rounded-xl border ${hasPermission ? 'bg-success/5 border-success/30' : 'bg-warning/5 border-warning/30'}`}>
                                            <div className="flex items-start gap-3">
                                                {hasPermission ? (
                                                    <CheckCircle2 size={20} className="text-success mt-0.5" />
                                                ) : (
                                                    <AlertCircle size={20} className="text-warning mt-0.5" />
                                                )}
                                                <div>
                                                    <p className={`text-sm font-medium ${hasPermission ? 'text-success' : 'text-warning'}`}>
                                                        {hasPermission ? 'Permissions Granted' : 'Permissions Required'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {hasPermission 
                                                            ? 'Your camera and microphone are ready.' 
                                                            : 'Click the button below to allow access to your camera and microphone.'}
                                                    </p>
                                                </div>
                                            </div>
                                            {!hasPermission && (
                                                <div className="flex gap-4 mt-4 ml-8 opacity-70">
                                                    <Video size={16} />
                                                    <Mic size={16} />
                                                </div>
                                            )}
                                            {error && (
                                                <div className="mt-3 text-xs text-danger bg-danger/10 p-2 rounded px-3">
                                                    {error}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-col gap-3">
                                        <button
                                            onClick={handleStartInterview}
                                            disabled={isLoading || subLoading}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                                                    Requesting Access...
                                                </span>
                                            ) : hasPermission ? (
                                                'Enter Interview Room'
                                            ) : (
                                                'Grant Access & Continue'
                                            )}
                                        </button>
                                        
                                        {/* Status Text for free tier */}
                                        {subscription && subscription.aiInterviews && subscription.aiInterviews.remaining !== 'unlimited' && (
                                            <p className="text-center text-xs text-muted-foreground mt-1">
                                                This will consume <span className="font-semibold text-primary">1</span> of your <span className="font-semibold text-primary">{subscription.aiInterviews.remaining}</span> remaining free interviews.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AIInterviewLayout>
    )
}

export default InterviewSetup
