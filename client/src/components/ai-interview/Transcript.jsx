import { useEffect, useRef } from 'react'
import './Transcript.css'

const Transcript = ({ messages }) => {
    const transcriptRef = useRef(null)

    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div className="transcript" ref={transcriptRef}>
            <div className="transcript-header">
                <span className="transcript-icon">💬</span>
                <span>Conversation</span>
            </div>
            <div className="transcript-messages">
                {messages.length === 0 ? (
                    <div className="transcript-empty">
                        <p>Conversation will appear here...</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.speaker}`}
                        >
                            <div className="message-speaker">
                                {msg.speaker === 'ai' ? '🤖 AI' : '👤 You'}
                            </div>
                            <div className="message-text">{msg.text}</div>
                            <div className="message-time">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Transcript
