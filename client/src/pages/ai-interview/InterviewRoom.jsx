import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import VideoPanel from '../../components/ai-interview/VideoPanel'
import AIAvatar from '../../components/ai-interview/AIAvatar'
import Timer from '../../components/ai-interview/Timer'
import interviewService from '../../services/interviewService'
import { Mic, MicOff, StopCircle, Radio, BrainCircuit, Activity, AlertCircle } from 'lucide-react'
import AIInterviewLayout from './AIInterviewLayout'
import { motion, AnimatePresence } from 'framer-motion'

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
    const selectedVoiceRef = useRef(null)

    // Handle speech recognition
    const handleSpeechResult = useCallback(async (transcript) => {
        if (!transcript || isProcessing || !sessionId || !canUserSpeak || aiSpeaking) return

        console.log('User said:', transcript)
        setCanUserSpeak(false)
        setStatusMessage('Processing your answer...')

        const userMessage = { speaker: 'user', text: transcript, timestamp: new Date().toISOString() }
        setMessages(prev => [...prev, userMessage])
        setIsProcessing(true)

        try {
            const response = await interviewService.sendMessage(sessionId, transcript, 'user')
            const aiMessage = { speaker: 'ai', text: response.message, timestamp: new Date().toISOString() }
            setMessages(prev => [...prev, aiMessage])
            
            setStatusMessage('AI is responding...')
            await speakText(aiMessage.text)
            
            setCanUserSpeak(true)
            setStatusMessage('Your turn to speak')
        } catch (error) {
            console.error('Error sending message:', error)
            const mockResponses = [
                "That's interesting. Can you elaborate on that?",
                "Good point. How would you handle edge cases?",
                "I see. What about performance considerations?"
            ]
            const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
            const aiMessage = { speaker: 'ai', text: mockResponse, timestamp: new Date().toISOString() }
            
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

    useEffect(() => {
        if (!('speechSynthesis' in window)) return
        const pickVoice = () => {
            if (selectedVoiceRef.current) return
            const voices = window.speechSynthesis.getVoices()
            if (!voices.length) return
            const preferred = voices.find(v => v.lang?.startsWith('en') && (v.name.includes('Microsoft Zira') || v.name.includes('Google US English') || v.name.includes('Samantha'))) || voices.find(v => v.lang?.startsWith('en')) || voices[0]
            selectedVoiceRef.current = preferred
        }
        pickVoice()
        window.speechSynthesis.onvoiceschanged = pickVoice
        return () => { window.speechSynthesis.onvoiceschanged = null }
    }, [])

    const speakText = (text) => {
        return new Promise((resolve) => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel()
                setAiSpeaking(true)
                const utterance = new SpeechSynthesisUtterance(text)
                utterance.rate = 0.95
                if (selectedVoiceRef.current) utterance.voice = selectedVoiceRef.current
                utterance.onend = () => { setAiSpeaking(false); resolve() }
                utterance.onerror = () => { setAiSpeaking(false); resolve() }
                window.speechSynthesis.speak(utterance)
            } else {
                setAiSpeaking(false)
                resolve()
            }
        })
    }

    useEffect(() => {
        const initInterview = async () => {
            if (!config) return navigate('/ai-interview')
            setStatusMessage('Setting up interview...')
            await requestPermissions()

            try {
                const response = await interviewService.startInterview(config)
                setSessionId(response.sessionId)
                const greeting = {
                    speaker: 'ai',
                    text: response.greeting || `Hello! I'm Alex, your AI interviewer for today's ${config.role} interview. Let's begin when you're ready. Tell me about yourself.`,
                    timestamp: new Date().toISOString()
                }
                setMessages([greeting])
                setStatusMessage('AI is introducing...')
                await speakText(greeting.text)
                setCanUserSpeak(true)
                setStatusMessage('Your turn to speak')
            } catch (error) {
                console.error('Error starting interview:', error)
                const mockSessionId = 'mock-' + Date.now()
                setSessionId(mockSessionId)
                const greeting = {
                    speaker: 'ai',
                    text: `Hello! I'm Alex, your AI interviewer for today's ${config.role} interview. Tell me about yourself.`,
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
            if (String(sessionId).startsWith('mock-')) return navigate(`/ai-interview/results/${sessionId}`)
            try {
                await interviewService.endInterview(sessionId)
                navigate(`/ai-interview/results/${sessionId}`)
            } catch (error) {
                navigate(`/ai-interview/results/${sessionId}`)
            }
        }
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
        if (stream) {
            stream.getAudioTracks().forEach(track => { track.enabled = isMuted })
        }
    }

    if (!config) return null

    return (
        <AIInterviewLayout>
            <div className="flex flex-col h-full w-full relative bg-background overflow-hidden">
                
                {/* Header Overlay */}
                <header className="absolute top-0 left-0 right-0 z-50 flex items-center px-6 py-4 bg-gradient-to-b from-background/90 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger/20 text-danger text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                            </span>
                            Live Interview
                        </div>
                        <div className="px-4 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white text-sm font-semibold border border-white/10">
                            {config.role}
                        </div>
                    </div>

                    {/* Perfectly centered timer */}
                    <div className="absolute left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 shadow-lg px-6 py-2 rounded-2xl flex items-center justify-center">
                        <Timer duration={config.duration} onTimeUp={handleEndInterview} />
                    </div>
                </header>

                {mediaError && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-danger text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-bold">
                        <AlertCircle size={18} /> {mediaError}
                    </div>
                )}

                {/* Main Content Area - Full Screen Layout */}
                <main className="relative w-full h-full flex flex-col justify-center items-center p-4">
                    
                    {/* User Video Feed (Main Large Screen) */}
                    <div className="absolute inset-4 rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10">
                        {/* We use an absolute full-size video panel */}
                        <div className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover opacity-80">
                            <VideoPanel stream={stream} />
                        </div>
                        
                        {/* Status Overlay */}
                        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center z-30">
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={statusMessage}
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                    className="bg-black/60 backdrop-blur-xl border border-white/20 shadow-2xl px-6 py-2.5 rounded-full text-sm font-medium text-white tracking-wide whitespace-nowrap"
                                >
                                    {statusMessage}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        
                        <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-20">
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm font-medium">
                                <span className={`w-2.5 h-2.5 rounded-full ${canUserSpeak && !aiSpeaking && !isProcessing ? 'bg-success animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-white/40'}`}></span>
                                You
                            </div>
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm font-medium">
                                {isMuted ? <MicOff size={16} className="text-danger" /> : <Mic size={16} className="text-success" />}
                                {isMuted ? 'Muted' : 'Mic Active'}
                            </div>
                        </div>
                    </div>

                    {/* AI Video Feed (PIP small window) */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        className={`absolute top-24 right-8 z-40 w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 transition-all duration-300 bg-card flex flex-col items-center justify-center ${aiSpeaking ? 'border-primary shadow-[0_0_30px_rgba(99,102,241,0.5)] scale-105' : 'border-white/20'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                        <div className="transform scale-75">
                            <AIAvatar isSpeaking={aiSpeaking} />
                        </div>
                        
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-semibold">
                            <span className={`w-2 h-2 rounded-full ${aiSpeaking ? 'bg-primary animate-pulse' : 'bg-white/40'}`}></span>
                            AI Interviewer
                        </div>

                        {/* State Indicators */}
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                            <AnimatePresence mode="wait">
                                {isProcessing && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-warning bg-black/70 p-1.5 rounded-lg backdrop-blur-md">
                                        <BrainCircuit size={14} className="animate-pulse" />
                                    </motion.div>
                                )}
                                {!isProcessing && aiSpeaking && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-primary bg-black/70 p-1.5 rounded-lg backdrop-blur-md">
                                        <Activity size={14} className="animate-pulse" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                </main>

                {/* Bottom Control Bar */}
                <footer className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl">
                    <button
                        onClick={toggleMute}
                        className={`flex items-center justify-center w-14 h-14 rounded-full transition-all border ${isMuted ? 'bg-danger/20 border-danger text-danger hover:bg-danger/30' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <div className="w-px h-8 bg-white/20 mx-2" />

                    <button
                        onClick={handleEndInterview}
                        className="flex items-center gap-2 bg-danger hover:bg-danger/90 text-white px-8 py-4 h-14 rounded-full font-bold text-base shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105"
                    >
                        <StopCircle size={22} />
                        End Interview
                    </button>
                </footer>
            </div>
        </AIInterviewLayout>
    )
}

export default InterviewRoom
