import { useEffect, useRef } from 'react'
import './VideoPanel.css'

const VideoPanel = ({ stream }) => {
    const videoRef = useRef(null)

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream
        }
    }, [stream])

    return (
        <div className="video-panel">
            {stream ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="video-feed"
                />
            ) : (
                <div className="video-placeholder">
                    <div className="placeholder-icon">📹</div>
                    <p>Camera not active</p>
                </div>
            )}
        </div>
    )
}

export default VideoPanel
