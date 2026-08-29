import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaDevices } from '../hooks/useMediaDevices'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import VideoPanel from '../components/VideoPanel'
import AIAvatar from '../components/AIAvatar'
import Timer from '../components/Timer'
import interviewService from '../services/interviewService'
import { Mic, MicOff, StopCircle, Radio } from 'lucide-react'
import './InterviewRoom.css'

const InterviewRoom = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const config = location.state

    const { stream, requestPermissions, error: mediaError } = useMediaDevices()
    const [sessionId, setSessionId] = useState(null)
    const [messages, setMessages] = useState([])
    const [isRecording, setIsRecording] = useState(true)
    const [isMuted, setIsMuted] = useState(false)
    const [aiSpeaking, setAiSpeaking] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [canUserSpeak, setCanUserSpeak] = useState(false)
    const [statusMessage, setStatusMessage] = useState('Initializing...')

    // Handle speech recognition - only process when user is allowed to speak
    const handleSpeechResult = useCallback(async (transcript) => {
        if (!transcript || isProcessing || !sessionId || !canUserSpeak || aiSpeaking) return

        console.log('User said:', transcript)

        // Immediately disable user speaking
        setCanUserSpeak(false)
        setStatusMessage('Processing your answer...')

        const userMessage = {
            speaker: 'user',
            text: transcript,
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, userMessage])
        setIsProcessing(true)

        try {
            // Send message to backend and get AI response
            const response = await interviewService.sendMessage(sessionId, transcript, 'user')

            const aiMessage = {
                speaker: 'ai',
                text: response.message,
                timestamp: new Date().toISOString()
            }

            setMessages(prev => [...prev, aiMessage])

            // Speak the AI response
            setStatusMessage('AI is responding...')
            await speakText(aiMessage.text)

            // After AI finishes speaking, allow user to speak again
            setCanUserSpeak(true)
            setStatusMessage('Your turn to speak')
        } catch (error) {
            console.error('Error sending message:', error)

            // Fallback: Generate mock AI response for demo
            const mockResponses = [
                "That's interesting. Can you elaborate on that?",
                "Good point. How would you handle edge cases?",
                "I see. What about performance considerations?",
                "Excellent. Let's move to the next question. Tell me about your experience with...",
                "That makes sense. Can you give me a specific example?"
            ]

            const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]

            const aiMessage = {
                speaker: 'ai',
                text: mockResponse,
                timestamp: new Date().toISOString()
            }

            setMessages(prev => [...prev, aiMessage])
            await speakText(mockResponse)

            setCanUserSpeak(true)
            setStatusMessage('Your turn to speak')
        } finally {
            setIsProcessing(false)
        }
    }, [sessionId, isProcessing, canUserSpeak, aiSpeaking])

    const { isListening, error: speechError } = useSpeechRecognition(
        handleSpeechResult,
        isRecording && !isMuted && canUserSpeak && !aiSpeaking
    )

    // Text-to-speech for AI responses
    const speakText = (text) => {
        return new Promise((resolve) => {
            if ('speechSynthesis' in window) {
                // Cancel any ongoing speech
                window.speechSynthesis.cancel()

                setAiSpeaking(true)

                const utterance = new SpeechSynthesisUtterance(text)
                utterance.rate = 0.95
                utterance.pitch = 1.0
                utterance.volume = 1.0

                // Prioritize natural-sounding female voices
                const voices = window.speechSynthesis.getVoices()
                const preferredVoice = voices.find(voice =>
                    (voice.name.includes('Female') ||
                        voice.name.includes('Google US English') ||
                        voice.name.includes('Microsoft Zira') ||
                        voice.name.includes('Samantha')) &&
                    voice.lang.startsWith('en')
                )
                if (preferredVoice) {
                    utterance.voice = preferredVoice
                }

                utterance.onend = () => {
                    setAiSpeaking(false)
                    resolve()
                }

                utterance.onerror = () => {
                    setAiSpeaking(false)
                    resolve()
                }

                window.speechSynthesis.speak(utterance)
            } else {
                setAiSpeaking(false)
                resolve()
            }
        })
    }

    // Initialize interview session
    useEffect(() => {
        const initInterview = async () => {
            if (!config) {
                navigate('/')
                return
            }

            setStatusMessage('Setting up interview...')

            // Request camera/mic if not already granted
            await requestPermissions()

            try {
                // Start interview session
                const response = await interviewService.startInterview(config)
                setSessionId(response.sessionId)

                // STEP 1: AI Introduction
                const greeting = {
                    speaker: 'ai',
                    text: response.greeting || `Hello! I'm Alex, your AI interviewer for today's ${config.role} interview. This will be a ${config.difficulty} level interview lasting ${config.duration} minutes. I'll ask you a series of questions, and please take your time to answer. Let's begin when you're ready. Tell me about yourself and your experience.`,
                    timestamp: new Date().toISOString()
                }

                setMessages([greeting])
                setStatusMessage('AI is introducing...')

                // Speak the greeting
                await speakText(greeting.text)

                // After greeting, allow user to speak
                setCanUserSpeak(true)
                setStatusMessage('Your turn to speak')

            } catch (error) {
                console.error('Error starting interview:', error)

                // Continue with mock session for demo
                const mockSessionId = 'mock-' + Date.now()
                setSessionId(mockSessionId)

                const greeting = {
                    speaker: 'ai',
                    text: `Hello! I'm Alex, your AI interviewer for today's ${config.role} interview. This will be a ${config.difficulty} level interview lasting ${config.duration} minutes. I'll ask you a series of questions about your technical skills and experience. Please answer naturally and take your time. Let's begin! Tell me about yourself and why you're interested in this ${config.role} position.`,
                    timestamp: new Date().toISOString()
                }

                setMessages([greeting])
                setStatusMessage('AI is introducing...')
                await speakText(greeting.text)

                setCanUserSpeak(true)
                setStatusMessage('Your turn to speak')
            }
        }

        initInterview()
    }, [config, navigate])

    const handleEndInterview = async () => {
        setIsRecording(false)
        setCanUserSpeak(false)
        window.speechSynthesis.cancel()
        setStatusMessage('Ending interview...')

        if (sessionId) {
            try {
                await interviewService.endInterview(sessionId)
                navigate(`/results/${sessionId}`)
            } catch (error) {
                console.error('Error ending interview:', error)
                navigate(`/results/${sessionId}`)
            }
        }
    }

    const handleTimeUp = () => {
        handleEndInterview()
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = isMuted
            })
        }
    }

    if (!config) {
        return null
    }

    return (
        <div className="interview-room">
            {/* Status Bar */}
            <div className="status-bar glass">
                <div className="status-left">
                    <div className="recording-indicator">
                        <Radio size={20} className="pulse-icon" />
                        <span>Recording</span>
                    </div>
                    <div className="role-badge">{config.role}</div>
                </div>

                <Timer duration={config.duration} onTimeUp={handleTimeUp} />

                <div className="status-right">
                    {isProcessing && (
                        <div className="thinking-indicator">
                            <div className="thinking-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span>AI is thinking...</span>
                        </div>
                    )}
                    {!isProcessing && canUserSpeak && !aiSpeaking && !isMuted && (
                        <div className="listening-indicator">
                            <div className="listening-dot"></div>
                            <span>Listening...</span>
                        </div>
                    )}
                    {aiSpeaking && (
                        <div className="speaking-indicator">
                            <div className="speaking-dot"></div>
                            <span>AI is speaking...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="interview-content">
                {/* Status overlay - Centered */}
                <div className={`status-badge floating ${canUserSpeak && !aiSpeaking ? 'active' : ''}`}>
                    {statusMessage}
                </div>

                {mediaError && (
                    <div className="error-banner">
                        <span className="error-icon">⚠️</span>
                        {mediaError}
                    </div>
                )}

                {/* Video Grid */}
                <div className="video-grid">
                    {/* User Feed */}
                    <div className="video-card user-feed">
                        <VideoPanel stream={stream} />
                        <div className="video-label">
                            <span className="dot"></span> You
                        </div>

                        {/* Mic Status inside video card */}
                        <div className="mic-status-overlay">
                            {isMuted ? <MicOff size={16} className="text-danger" /> : <Mic size={16} className="text-success" />}
                        </div>
                    </div>

                    {/* AI Feed */}
                    <div className="video-card ai-feed">
                        <AIAvatar isSpeaking={aiSpeaking} />
                        <div className="video-label">
                            <span className="dot ai"></span> AI Interviewer
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="control-bar glass">
                <button
                    className={`control-btn ${isMuted ? 'muted' : ''}`}
                    onClick={toggleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button
                    className="control-btn end-btn"
                    onClick={handleEndInterview}
                >
                    <StopCircle size={24} />
                    <span>End Interview</span>
                </button>
            </div>
        </div>
    )
}

export default InterviewRoom
