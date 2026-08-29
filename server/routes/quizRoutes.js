import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
    startTest,
    getQuestions,
    saveAnswer,
    submitTest,
    getUserQuizHistory,
    getUserQuizStats,
    getUserTestAttempts,
    getAttemptDetails
} from '../controllers/quizController.js';
import { checkMockTestAccess, incrementMockTestUsage } from '../middleware/subscriptionMiddleware.js';
import Question from '../models/Question.js'; // Keep for tests list

const router = express.Router();

router.post("/start", userAuth, checkMockTestAccess, startTest);
router.get("/questions", userAuth, getQuestions);
router.post("/save-answer", userAuth, saveAnswer);
router.post("/submit", userAuth, incrementMockTestUsage, submitTest);

// Quiz history and statistics
router.get("/history", userAuth, getUserQuizHistory);
router.get("/stats", userAuth, getUserQuizStats);

// User attempts for dashboard display
router.get("/user-attempts", userAuth, getUserTestAttempts);
router.get("/attempt/:attemptId/details", userAuth, getAttemptDetails);

// Keep the route to list available tests for the dashboard
router.get('/tests', userAuth, async (req, res) => {
    try {
        const testSets = await Question.distinct('testSet');
        const tests = testSets.map(set => ({
            id: set,
            title: `Mock Test ${set}`,
            description: `Comprehensive assessment for Mock Test ${set}`
        }));
        res.json({ success: true, tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;

