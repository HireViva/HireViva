import { useState, useEffect } from 'react'
import './Timer.css'

const Timer = ({ duration, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(duration * 60) // Convert minutes to seconds

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp && onTimeUp()
            return
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLeft, onTimeUp])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const percentage = (timeLeft / (duration * 60)) * 100
    const isLowTime = timeLeft < 60

    return (
        <div className={`timer ${isLowTime ? 'low-time' : ''}`}>
            <div className="timer-icon">⏱️</div>
            <div className="timer-display">
                <div className="timer-text">{formatTime(timeLeft)}</div>
                <div className="timer-bar">
                    <div
                        className="timer-progress"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Timer
