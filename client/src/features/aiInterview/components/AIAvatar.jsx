import { useState, useEffect } from 'react'
import './AIAvatar.css'

const AIAvatar = ({ isSpeaking }) => {
    const [waveform, setWaveform] = useState([0, 0, 0, 0, 0])

    useEffect(() => {
        if (!isSpeaking) {
            setWaveform([0, 0, 0, 0, 0])
            return
        }

        const interval = setInterval(() => {
            setWaveform(prev => prev.map(() => Math.random() * 100))
        }, 100)

        return () => clearInterval(interval)
    }, [isSpeaking])

    return (
        <div className="ai-avatar">
            <div className="avatar-circle">
                <div className="avatar-icon">🤖</div>
            </div>
            {isSpeaking && (
                <div className="waveform-container">
                    <div className="waveform">
                        {waveform.map((height, index) => (
                            <div
                                key={index}
                                className="wave-bar"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AIAvatar
