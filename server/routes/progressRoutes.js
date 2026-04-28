import express from 'express';
import {
    getUserProgress,
    getDashboard,
    getModuleBreakdown,
    getWeeklyPerformance,
    getDayStreak,
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

// Get module-wise breakdown
progressRouter.get('/module-breakdown', getModuleBreakdown);

// Get weekly performance
progressRouter.get('/weekly-performance', getWeeklyPerformance);

// Get day streak
progressRouter.get('/day-streak', getDayStreak);

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