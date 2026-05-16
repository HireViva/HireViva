import express from 'express';
import {
    getUserProgress,
    getDashboard,
    getMetrics,
    getScores,
    getCharts,
    getModuleBreakdown,
    getWeeklyPerformance,
    getDayStreak,
    getAIMentorSuggestion,
    toggleSolved,
    toggleStarred,
    saveNote,
    deleteNote,
    bulkUpdateProgress
} from '../controllers/progressController.js';
import userAuth from '../middleware/userAuth.js';

const progressRouter = express.Router();

// All routes require authentication
progressRouter.use(userAuth);

// Get user's progress
progressRouter.get('/', getUserProgress);

// Get dashboard metrics
progressRouter.get('/dashboard', getDashboard);

// Dedicated dashboard datasets
progressRouter.get('/metrics', getMetrics);
progressRouter.get('/scores', getScores);
progressRouter.get('/charts', getCharts);

// Get module-wise breakdown
progressRouter.get('/module-breakdown', getModuleBreakdown);

// Get weekly performance
progressRouter.get('/weekly-performance', getWeeklyPerformance);

// Get day streak
progressRouter.get('/day-streak', getDayStreak);

// AI mentor suggestion (Claude-powered when configured)
progressRouter.post('/mentor-suggestion', getAIMentorSuggestion);

// Toggle solved status
progressRouter.post('/toggle-solved', toggleSolved);

// Toggle starred status
progressRouter.post('/toggle-starred', toggleStarred);

// Save note
progressRouter.post('/save-note', saveNote);

// Delete note
progressRouter.delete('/delete-note', deleteNote);

// Bulk update (optional)
progressRouter.put('/bulk-update', bulkUpdateProgress);

export default progressRouter;
