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

    // Get dashboard metrics
    async getDashboard() {
        try {
            const response = await api.get('/progress/dashboard');
            return response.data;
        } catch (error) {
            console.error('Get dashboard error:', error);
            throw error;
        }
    },

    // Get top-level KPI metrics
    async getMetrics() {
        try {
            const response = await api.get('/progress/metrics');
            return response.data;
        } catch (error) {
            console.error('Get metrics error:', error);
            throw error;
        }
    },

    // Get score breakdown data
    async getScores() {
        try {
            const response = await api.get('/progress/scores');
            return response.data;
        } catch (error) {
            console.error('Get scores error:', error);
            throw error;
        }
    },

    // Get all chart data
    async getCharts() {
        try {
            const response = await api.get('/progress/charts');
            return response.data;
        } catch (error) {
            console.error('Get charts error:', error);
            throw error;
        }
    },

    async getModuleBreakdown() {
        try {
            const response = await api.get('/progress/module-breakdown');
            return response.data;
        } catch (error) {
            console.error('Get module breakdown error:', error);
            throw error;
        }
    },

    async getWeeklyPerformance() {
        try {
            const response = await api.get('/progress/weekly-performance');
            return response.data;
        } catch (error) {
            console.error('Get weekly performance error:', error);
            throw error;
        }
    },

    async getMentorSuggestion(focusArea = 'general') {
        try {
            const response = await api.post('/progress/mentor-suggestion', { focusArea });
            return response.data;
        } catch (error) {
            console.error('Get mentor suggestion error:', error);
            throw error;
        }
    },

    // Get day streak data
    async getDayStreak() {
        try {
            const response = await api.get('/progress/day-streak');
            return response.data;
        } catch (error) {
            console.error('Get day streak error:', error);
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
