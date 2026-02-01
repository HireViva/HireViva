import { useState, useEffect, useRef } from 'react'

export const useMediaDevices = () => {
    const [stream, setStream] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasPermission, setHasPermission] = useState(false)
    const streamRef = useRef(null)

    const requestPermissions = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            })

            setStream(mediaStream)
            streamRef.current = mediaStream
            setHasPermission(true)
            setIsLoading(false)
            return mediaStream
        } catch (err) {
            console.error('Error accessing media devices:', err)
            setError(err.message)
            setIsLoading(false)
            setHasPermission(false)
            return null
        }
    }

    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        setStream(null)
        setHasPermission(false)
    }

    useEffect(() => {
        return () => {
            stopStream()
        }
    }, [])

    return {
        stream,
        error,
        isLoading,
        hasPermission,
        requestPermissions,
        stopStream
    }
}
