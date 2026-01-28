import api from '../api';

export const progressService = {
    // Get user's progress
    async getProgress() {
        try {
            const response = await api.get('/progress');
            return response.data;
        } catch (error) {
            console.error('Get progress error:', error);
            throw error;
        }
    },

    // Toggle solved
    async toggleSolved(questionId) {
        try {
            const response = await api.post('/progress/toggle-solved', { questionId });
            return response.data;
        } catch (error) {
            console.error('Toggle solved error:', error);
            throw error;
        }
    },

    // Toggle starred
    async toggleStarred(questionId) {
        try {
            const response = await api.post('/progress/toggle-starred', { questionId });
            return response.data;
        } catch (error) {
            console.error('Toggle starred error:', error);
            throw error;
        }
    },

    // Save note
    async saveNote(questionId, content) {
        try {
            const response = await api.post('/progress/save-note', {
                questionId,
                content
            });
            return response.data;
        } catch (error) {
            console.error('Save note error:', error);
            throw error;
        }
    },

    // Delete note
    async deleteNote(questionId) {
        try {
            const response = await api.delete('/progress/delete-note', {
                data: { questionId }
            });
            return response.data;
        } catch (error) {
            console.error('Delete note error:', error);
            throw error;
        }
    }
};