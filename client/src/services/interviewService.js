import api from '../api'

export const interviewService = {
    // Start a new interview session
    startInterview: async (config) => {
        try {
            const response = await api.post('/interview/start', config)
            return response.data
        } catch (error) {
            console.error('Error starting interview:', error)
            throw error
        }
    },

    // Send a message during the interview
    sendMessage: async (sessionId, message, speaker = 'user') => {
        try {
            const response = await api.post('/interview/message', {
                sessionId,
                message,
                speaker
            })
            return response.data
        } catch (error) {
            console.error('Error sending message:', error)
            throw error
        }
    },

    // End the interview and get results
    endInterview: async (sessionId) => {
        try {
            const response = await api.post('/interview/end', { sessionId })
            return response.data
        } catch (error) {
            console.error('Error ending interview:', error)
            throw error
        }
    },

    // Get interview details
    getInterview: async (sessionId) => {
        try {
            const response = await api.get(`/interview/${sessionId}`)
            return response.data
        } catch (error) {
            console.error('Error fetching interview:', error)
            throw error
        }
    }
}

export default interviewService
