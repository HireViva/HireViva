import { useState, useEffect, useRef, useCallback } from 'react'

export const useSpeechRecognition = (onResult, isActive = false, silenceDelay = 2500) => {
    const [isListening, setIsListening] = useState(false)
    const [error, setError] = useState(null)
    const [isSupported, setIsSupported] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [interimTranscript, setInterimTranscript] = useState('')

    const recognitionRef = useRef(null)
    const isActiveRef = useRef(isActive)
    const onResultRef = useRef(onResult)
    const silenceTimerRef = useRef(null)
    const accumulatedFinalRef = useRef('')

    useEffect(() => { onResultRef.current = onResult }, [onResult])
    useEffect(() => { isActiveRef.current = isActive }, [isActive])

    const submitAnswer = useCallback(() => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current)
            silenceTimerRef.current = null
        }

        const textToSubmit = accumulatedFinalRef.current.trim()
        if (textToSubmit && onResultRef.current) {
            accumulatedFinalRef.current = ''
            setTranscript('')
            setInterimTranscript('')
            onResultRef.current(textToSubmit)
        }
    }, [])

    const clearTranscript = useCallback(() => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current)
            silenceTimerRef.current = null
        }
        accumulatedFinalRef.current = ''
        setTranscript('')
        setInterimTranscript('')
    }, [])

    // Initialize Web Speech API
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            setError('Speech recognition not supported in this browser. Please use Chrome/Edge or type your answers.')
            setIsSupported(false)
            return
        }
        setIsSupported(true)

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
            setIsListening(true)
            setError(null)
        }

        recognition.onresult = (event) => {
            let interim = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const text = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    accumulatedFinalRef.current += (accumulatedFinalRef.current ? ' ' : '') + text.trim()
                } else {
                    interim += text
                }
            }

            setInterimTranscript(interim)
            const fullText = (accumulatedFinalRef.current + (interim ? ' ' + interim : '')).trim()
            setTranscript(fullText)

            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current)
                silenceTimerRef.current = null
            }

            if (fullText.length > 2 && onResultRef.current && isActiveRef.current) {
                silenceTimerRef.current = setTimeout(() => {
                    if (isActiveRef.current && fullText.trim()) {
                        accumulatedFinalRef.current = ''
                        setTranscript('')
                        setInterimTranscript('')
                        onResultRef.current(fullText.trim())
                    }
                }, silenceDelay)
            }
        }

        recognition.onerror = (event) => {
            if (event.error === 'not-allowed') {
                setError('Microphone access denied. Please allow microphone permissions or type your responses.')
            } else if (event.error === 'network') {
                setError('Speech recognition network issue. You can continue typing.')
            }
        }

        recognition.onend = () => {
            setIsListening(false)
            if (isActiveRef.current) {
                try {
                    setTimeout(() => {
                        if (isActiveRef.current && recognitionRef.current) {
                            recognitionRef.current.start()
                        }
                    }, 200)
                } catch (err) {
                    // Ignore restart conflicts
                }
            }
        }

        recognitionRef.current = recognition

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
            try { recognition.stop() } catch (e) {}
        }
    }, [silenceDelay])

    useEffect(() => {
        if (!recognitionRef.current || !isSupported) return

        if (isActive) {
            try {
                recognitionRef.current.start()
            } catch (err) {
                // Already started
            }
        } else {
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current)
                silenceTimerRef.current = null
            }
            setInterimTranscript('')
            try {
                recognitionRef.current.stop()
            } catch (err) {
                // Already stopped
            }
        }
    }, [isActive, isSupported])

    return {
        isListening,
        transcript,
        interimTranscript,
        error,
        isSupported,
        submitAnswer,
        clearTranscript
    }
}

