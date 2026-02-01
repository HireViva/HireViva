import { useState, useEffect, useRef } from 'react'

export const useSpeechRecognition = (onResult, isActive = false) => {
    const [isListening, setIsListening] = useState(false)
    const [error, setError] = useState(null)
    const [isSupported, setIsSupported] = useState(false)
    const recognitionRef = useRef(null)

    const shouldListenRef = useRef(isActive)

    useEffect(() => {
        shouldListenRef.current = isActive
    }, [isActive])

    useEffect(() => {
        // Check if browser supports Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
            setIsSupported(false)
            return
        }

        setIsSupported(true)

        // Initialize Speech Recognition
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onstart = () => {
            setIsListening(true)
            setError(null)
        }

        recognition.onresult = (event) => {
            let interimTranscript = ''
            let finalTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' '
                } else {
                    interimTranscript += transcript
                }
            }

            if (finalTranscript && onResult) {
                onResult(finalTranscript.trim())
            }
        }

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error)
            if (event.error !== 'no-speech') {
                setError(`Speech recognition error: ${event.error}`)
            }
        }

        recognition.onend = () => {
            setIsListening(false)
            // Restart if still active
            if (shouldListenRef.current && recognitionRef.current) {
                try {
                    recognition.start()
                } catch (err) {
                    console.error('Error restarting recognition:', err)
                }
            }
        }

        recognitionRef.current = recognition

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [onResult])

    useEffect(() => {
        if (!recognitionRef.current || !isSupported) return

        if (isActive && !isListening) {
            try {
                recognitionRef.current.start()
            } catch (err) {
                console.error('Error starting recognition:', err)
            }
        } else if (!isActive && isListening) {
            recognitionRef.current.stop()
        }
    }, [isActive, isSupported])

    const startListening = () => {
        if (recognitionRef.current && isSupported) {
            try {
                recognitionRef.current.start()
            } catch (err) {
                console.error('Error starting recognition:', err)
            }
        }
    }

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
    }

    return {
        isListening,
        error,
        isSupported,
        startListening,
        stopListening
    }
}
