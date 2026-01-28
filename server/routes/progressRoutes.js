import express from 'express';
import {
    getUserProgress,
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