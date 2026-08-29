import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaDevices } from '../../hooks/useMediaDevices'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import VideoPanel from '../../components/ai-interview/VideoPanel'
import AIAvatar from '../../components/ai-interview/AIAvatar'
import Timer from '../../components/ai-interview/Timer'
import interviewService from '../../services/interviewService'
import { Mic, MicOff, StopCircle, BrainCircuit, Activity, AlertCircle, Send, Volume2, Sparkles, Loader2 } from 'lucide-react'
import AIInterviewLayout from './AIInterviewLayout'
import { motion, AnimatePresence } from 'framer-motion'

const InterviewRoom = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const config = location.state

    const { stream, requestPermissions, error: mediaError } = useMediaDevices()

    // Core state
    const [sessionId, setSessionId] = useState(null)
    const [messages, setMessages] = useState([])
    const [isMuted, setIsMuted] = useState(false)
    const [aiSpeaking, setAiSpeaking] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [canUserSpeak, setCanUserSpeak] = useState(false)
    const [statusMessage, setStatusMessage] = useState('Initializing interview session...')
    const [isEnded, setIsEnded] = useState(false)
    const [isEvaluating, setIsEvaluating] = useState(false)
    const [textInput, setTextInput] = useState('')

    // Refs to avoid stale closures in async callbacks
    const sessionIdRef = useRef(null)
    const isProcessingRef = useRef(false)
    const canUserSpeakRef = useRef(false)
    const aiSpeakingRef = useRef(false)
    const isEndedRef = useRef(false)
    const selectedVoiceRef = useRef(null)
    const currentUtteranceRef = useRef(null)

    // Keep refs in sync with state
    useEffect(() => { sessionIdRef.current = sessionId }, [sessionId])
    useEffect(() => { isProcessingRef.current = isProcessing }, [isProcessing])
    useEffect(() => { canUserSpeakRef.current = canUserSpeak }, [canUserSpeak])
    useEffect(() => { aiSpeakingRef.current = aiSpeaking }, [aiSpeaking])
    useEffect(() => { isEndedRef.current = isEnded }, [isEnded])

    // ─── Voice selection ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!('speechSynthesis' in window)) return
        const pickVoice = () => {
            if (selectedVoiceRef.current) return
            const voices = window.speechSynthesis.getVoices()
            if (!voices.length) return
            // Prefer a clear natural English voice
            const preferred =
                voices.find(v => v.lang?.startsWith('en') && (
                    v.name.includes('Google US English') ||
                    v.name.includes('Natural') ||
                    v.name.includes('Microsoft Zira') ||
                    v.name.includes('Samantha') ||
                    v.name.includes('Karen') ||
                    v.name.includes('Jenny')
                )) ||
                voices.find(v => v.lang?.startsWith('en')) ||
                voices[0]
            selectedVoiceRef.current = preferred
        }
        pickVoice()
        window.speechSynthesis.onvoiceschanged = pickVoice
        return () => { window.speechSynthesis.onvoiceschanged = null }
    }, [])

    // ─── Text-to-speech with GC protection ──────────────────────────────────────
    const speakText = (text) => new Promise((resolve) => {
        if (!('speechSynthesis' in window) || !text) {
            resolve()
            return
        }

        try {
            window.speechSynthesis.cancel()
        } catch (e) {}

        setAiSpeaking(true)

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.95
        utterance.pitch = 1.0
        if (selectedVoiceRef.current) {
            utterance.voice = selectedVoiceRef.current
        }

        // Store reference on window to prevent Chrome garbage collector bug
        currentUtteranceRef.current = utterance

        const timeoutMs = Math.min(60000, Math.max(7000, text.length * 20))
        const timeoutId = setTimeout(() => {
            try { window.speechSynthesis.cancel() } catch (e) {}
            currentUtteranceRef.current = null
            setAiSpeaking(false)
            resolve()
        }, timeoutMs)

        utterance.onend = () => {
            clearTimeout(timeoutId)
            currentUtteranceRef.current = null
            setAiSpeaking(false)
            resolve()
        }

        utterance.onerror = () => {
            clearTimeout(timeoutId)
            currentUtteranceRef.current = null
            setAiSpeaking(false)
            resolve()
        }

        window.speechSynthesis.speak(utterance)
    })

    // ─── Core message handler ──────────────────────────────────────────────────
    const handleUserAnswer = async (candidateText) => {
        const text = (candidateText || '').trim()
        if (!text) return
        if (isProcessingRef.current || !canUserSpeakRef.current || aiSpeakingRef.current || isEndedRef.current) return

        const sid = sessionIdRef.current
        if (!sid) return

        setCanUserSpeak(false)
        setIsProcessing(true)
        setStatusMessage('AI is thinking & analyzing...')
        setTextInput('')

        const userMessage = { speaker: 'user', text, timestamp: new Date().toISOString() }
        setMessages(prev => [...prev, userMessage])

        try {
            let aiResponseText
            if (String(sid).startsWith('mock-')) {
                const mockResponses = [
                    "That makes sense. Can you dive deeper into the architectural tradeoffs of that approach?",
                    "Great explanation. How would you handle potential edge cases or failure modes?",
                    "Understood. If scalability were a major requirement, what changes would you introduce?",
                    "Interesting! Could you describe a time when you had to troubleshoot a challenging bug related to this?"
                ]
                aiResponseText = mockResponses[Math.floor(Math.random() * mockResponses.length)]
            } else {
                const response = await interviewService.sendMessage(sid, text, 'user')
                aiResponseText = response.message
            }

            const aiMessage = { speaker: 'ai', text: aiResponseText, timestamp: new Date().toISOString() }
            setMessages(prev => [...prev, aiMessage])
            setStatusMessage('Alex is asking...')
            await speakText(aiResponseText)
        } catch (error) {
            console.error('Error sending message:', error)
            const fallback = "That is a thoughtful answer. Let's move on: could you discuss a complex project you developed and the main challenges you overcame?"
            const aiMessage = { speaker: 'ai', text: fallback, timestamp: new Date().toISOString() }
            setMessages(prev => [...prev, aiMessage])
            await speakText(fallback)
        } finally {
            if (!isEndedRef.current) {
                setIsProcessing(false)
                setCanUserSpeak(true)
                setStatusMessage('Your turn: speak or type your answer')
            }
        }
    }

    // ─── Speech Recognition ────────────────────────────────────────────────────
    const micActive = canUserSpeak && !aiSpeaking && !isProcessing && !isMuted && !isEnded
    const { isListening, transcript, error: speechError, submitAnswer } = useSpeechRecognition(
        handleUserAnswer,
        micActive,
        2500 // 2.5s silence debounce
    )

    // Sync spoken transcript to input box for easy review / edit
    useEffect(() => {
        if (transcript) {
            setTextInput(transcript)
        }
    }, [transcript])

    // ─── Initialize interview ───────────────────────────────────────────────────
    useEffect(() => {
        if (!config) {
            navigate('/ai-interview')
            return
        }

        const initInterview = async () => {
            setStatusMessage('Connecting with AI Interviewer...')
            await requestPermissions()

            let sid
            let greetingText

            try {
                const response = await interviewService.startInterview(config)
                sid = response.sessionId
                greetingText = response.greeting
            } catch (err) {
                console.warn('Backend interview session init failed, starting resilient mode:', err)
                sid = 'mock-' + Date.now()
                greetingText = `Hello! I'm Alex, your AI technical interviewer for today's ${config.difficulty} ${config.role} interview. We have ${config.duration} minutes. Let's begin — could you please tell me about yourself and your primary technical stack?`
            }

            setSessionId(sid)
            const greeting = { speaker: 'ai', text: greetingText, timestamp: new Date().toISOString() }
            setMessages([greeting])
            setStatusMessage('Alex is introducing...')
            await speakText(greetingText)
            setCanUserSpeak(true)
            setStatusMessage('Your turn: speak or type your answer')
        }

        initInterview()

        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel()
            }
        }
    }, [])

    // ─── Repeat last AI question ────────────────────────────────────────────────
    const handleRepeatQuestion = async () => {
        if (aiSpeaking || isProcessing) return
        const lastAiMsg = [...messages].reverse().find(m => m.speaker === 'ai')
        if (lastAiMsg?.text) {
            setStatusMessage('Repeating question...')
            await speakText(lastAiMsg.text)
            setStatusMessage('Your turn: speak or type your answer')
        }
    }

    // ─── End interview ──────────────────────────────────────────────────────────
    const handleEndInterview = async () => {
        if (isEndedRef.current) return
        setIsEnded(true)
        setCanUserSpeak(false)
        setIsEvaluating(true)

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()
        }
        setStatusMessage('Evaluating your interview performance...')

        const sid = sessionIdRef.current
        if (!sid) {
            navigate('/ai-interview')
            return
        }

        if (String(sid).startsWith('mock-')) {
            setTimeout(() => {
                navigate(`/ai-interview/results/${sid}`)
            }, 1200)
            return
        }

        try {
            await interviewService.endInterview(sid)
        } catch (e) {
            console.error('End interview evaluation error:', e)
        }

        navigate(`/ai-interview/results/${sid}`)
    }

    // ─── Mute toggle ────────────────────────────────────────────────────────────
    const toggleMute = () => {
        setIsMuted(prev => {
            if (stream) {
                stream.getAudioTracks().forEach(t => { t.enabled = prev })
            }
            return !prev
        })
    }

    // ─── Text input submit ──────────────────────────────────────────────────────
    const handleTextSubmit = (e) => {
        e?.preventDefault()
        const trimmed = textInput.trim()
        if (!trimmed) return
        handleUserAnswer(trimmed)
    }

    if (!config) return null

    return (
        <AIInterviewLayout>
            <div className="flex flex-col h-full w-full relative bg-background overflow-hidden">

                {/* Evaluating Overlay */}
                <AnimatePresence>
                    {isEvaluating && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-pulse">
                                <Sparkles size={32} className="text-primary animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Generating Performance Evaluation</h2>
                            <p className="text-muted-foreground text-sm max-w-md mb-6">
                                Alex is evaluating your technical depth, problem solving, communication clarity, and confidence...
                            </p>
                            <div className="flex items-center gap-2 text-primary text-sm font-medium">
                                <Loader2 size={18} className="animate-spin" />
                                Analyzing conversation transcript...
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-background/95 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Live Session
                        </div>
                        <div className="px-3.5 py-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                            {config.role} • {config.difficulty}
                        </div>
                    </div>

                    <div className="bg-black/70 backdrop-blur-md border border-white/10 shadow-lg px-6 py-1.5 rounded-2xl flex items-center justify-center">
                        <Timer duration={config.duration} onTimeUp={handleEndInterview} />
                    </div>

                    <button
                        onClick={handleRepeatQuestion}
                        disabled={aiSpeaking || isProcessing}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 border border-white/10 text-white text-xs font-medium transition-all"
                        title="Repeat current question"
                    >
                        <Volume2 size={14} />
                        Repeat Question
                    </button>
                </header>

                {/* Error banners */}
                {mediaError && (
                    <div className="absolute top-18 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-danger text-white px-5 py-2.5 rounded-xl shadow-xl text-xs font-semibold">
                        <AlertCircle size={16} /> {mediaError}
                    </div>
                )}
                {speechError && (
                    <div className="absolute top-18 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-amber-500 text-black px-5 py-2 rounded-xl shadow-xl text-xs font-semibold max-w-md text-center">
                        <AlertCircle size={16} /> {speechError}
                    </div>
                )}

                {/* Main area */}
                <main className="relative w-full h-full flex flex-col justify-center items-center p-4">

                    {/* User video background container */}
                    <div className="absolute inset-4 rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10">
                        <div className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover opacity-85">
                            <VideoPanel stream={stream} />
                        </div>

                        {/* Status bubble */}
                        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center z-30">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={statusMessage}
                                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                    className="bg-black/75 backdrop-blur-xl border border-white/20 shadow-2xl px-5 py-2 rounded-full text-xs font-medium text-white tracking-wide whitespace-nowrap"
                                >
                                    {statusMessage}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Candidate status tag */}
                        <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-20">
                            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white text-xs font-medium border border-white/10">
                                <span className={`w-2 h-2 rounded-full ${micActive && isListening ? 'bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]' : 'bg-white/40'}`}></span>
                                Candidate {isListening ? '(listening...)' : ''}
                            </div>
                        </div>

                        {/* Text & Speech Input Bar */}
                        <AnimatePresence>
                            {canUserSpeak && !aiSpeaking && !isProcessing && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-30"
                                >
                                    <form
                                        onSubmit={handleTextSubmit}
                                        className="flex items-center bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl p-1.5 gap-2"
                                    >
                                        <div className="flex items-center pl-3 text-green-400">
                                            <Mic size={18} className={isListening ? 'animate-pulse' : 'opacity-40'} />
                                        </div>
                                        <input
                                            type="text"
                                            value={textInput}
                                            onChange={e => setTextInput(e.target.value)}
                                            placeholder="Speak or type your answer here..."
                                            className="w-full bg-transparent text-white px-2 py-2.5 focus:outline-none placeholder:text-white/40 text-sm"
                                            autoComplete="off"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!textInput.trim()}
                                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0 shadow-md hover:scale-102"
                                        >
                                            <Send size={14} /> Send Answer
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* AI Avatar PIP Window */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        className={`absolute top-20 right-8 z-30 w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-300 bg-card/90 backdrop-blur-md flex flex-col items-center justify-center ${aiSpeaking ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] scale-102' : 'border-white/15'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-purple-900/30" />
                        <div className="transform scale-80">
                            <AIAvatar isSpeaking={aiSpeaking} />
                        </div>

                        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-semibold border border-white/10">
                            <span className={`w-2 h-2 rounded-full ${aiSpeaking ? 'bg-indigo-400 animate-pulse' : 'bg-white/40'}`}></span>
                            Alex — AI Interviewer
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-2">
                            <AnimatePresence mode="wait">
                                {isProcessing && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-amber-400 bg-black/70 p-1.5 rounded-lg backdrop-blur-md">
                                        <BrainCircuit size={14} className="animate-pulse" />
                                    </motion.div>
                                )}
                                {!isProcessing && aiSpeaking && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-indigo-400 bg-black/70 p-1.5 rounded-lg backdrop-blur-md">
                                        <Activity size={14} className="animate-pulse" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Conversation Transcript Stream (Right side) */}
                    <div className="absolute right-8 top-64 bottom-28 w-64 z-20 overflow-y-auto flex flex-col gap-2.5 scrollbar-thin">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`text-xs rounded-xl px-3.5 py-2.5 max-w-full backdrop-blur-md shadow-md leading-relaxed ${msg.speaker === 'ai'
                                    ? 'bg-indigo-950/80 border border-indigo-500/40 text-indigo-100 self-start'
                                    : 'bg-black/80 border border-white/15 text-white/90 self-end text-right'
                                    }`}
                            >
                                <div className="font-bold text-[11px] mb-1 opacity-70 flex items-center gap-1">
                                    {msg.speaker === 'ai' ? '🤖 Alex' : '👤 You'}
                                </div>
                                {msg.text}
                            </motion.div>
                        ))}
                    </div>

                </main>

                {/* Bottom Control Bar */}
                <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-black/80 backdrop-blur-2xl border border-white/15 px-6 py-3 rounded-full shadow-2xl">
                    <button
                        onClick={toggleMute}
                        className={`flex items-center justify-center w-12 h-12 rounded-full transition-all border ${isMuted ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <div className="w-px h-6 bg-white/20" />

                    <button
                        onClick={handleEndInterview}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105"
                    >
                        <StopCircle size={18} />
                        End Interview
                    </button>
                </footer>
            </div>
        </AIInterviewLayout>
    )
}

export default InterviewRoom
