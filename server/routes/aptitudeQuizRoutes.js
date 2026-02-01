import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
    startTest,
    getQuestions,
    saveAnswer,
    submitTest,
    getUserQuizHistory,
    getUserQuizStats
} from '../controllers/aptitudeQuizController.js';
import AptitudeQuestion from '../models/AptitudeQuestion.js'; // Keep for tests list

const router = express.Router();

router.post("/start", userAuth, startTest);
router.get("/questions", userAuth, getQuestions);
router.post("/save-answer", userAuth, saveAnswer);
router.post("/submit", userAuth, submitTest);

// Quiz history and statistics
router.get("/history", userAuth, getUserQuizHistory);
router.get("/stats", userAuth, getUserQuizStats);

// Keep the route to list available tests for the dashboard
router.get('/tests', userAuth, async (req, res) => {
    try {
        const testSets = await AptitudeQuestion.distinct('testSet');
        const tests = testSets.map(set => ({
            id: set,
            title: `Aptitude Mock Test ${set}`,
            description: `Comprehensive aptitude assessment for Mock Test ${set}`
        }));
        res.json({ success: true, tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
