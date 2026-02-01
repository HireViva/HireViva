import AptitudeQuestion from "../models/AptitudeQuestion.js";
import AptitudeTestAttempt from "../models/AptitudeTestAttempt.js";
import userModel from "../models/userModel.js";

/* START TEST */
export const startTest = async (req, res) => {
    // req.userId comes from auth middleware
    const userId = req.userId;
    const { testId } = req.body; // testId passed from frontend, maps to testSet

    console.log(`Starting aptitude test for user ${userId}, testSet: ${testId}`);

    try {
        const attempt = await AptitudeTestAttempt.create({
            userId,
            testSet: testId || 1, // Default to 1 if not provided
            startTime: new Date(),
            endTime: new Date(Date.now() + 30 * 60 * 1000), // 30 min
            answers: {}
        });

        res.json({
            attemptId: attempt._id,
            endTime: attempt.endTime
        });
    } catch (error) {
        console.error("Error in startTest:", error);
        res.status(500).json({ message: "Failed to start test", error: error.message });
    }
};

/* GET QUESTIONS */
export const getQuestions = async (req, res) => {
    try {
        // Optionally filter by testSet if passed in query
        const { testSet } = req.query;
        const query = testSet ? { testSet } : {};

        const questions = await AptitudeQuestion.find(query).select("-correctAnswer");
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch questions", error: error.message });
    }
};

/* SAVE ANSWER */
export const saveAnswer = async (req, res) => {
    const { attemptId, questionId, selectedOption } = req.body;

    try {
        await AptitudeTestAttempt.findByIdAndUpdate(attemptId, {
            $set: {
                [`answers.${questionId}`]: selectedOption
            }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Failed to save answer", error: error.message });
    }
};

/* SUBMIT TEST */
export const submitTest = async (req, res) => {
    const { attemptId } = req.body;
    const userId = req.userId;

    if (!attemptId) {
        return res.status(400).json({ message: "attemptId is required" });
    }

    try {
        const attempt = await AptitudeTestAttempt.findById(attemptId);

        if (!attempt) {
            return res.status(404).json({ message: "Test attempt not found" });
        }

        // 🔒 Prevent double submission
        if (attempt.isSubmitted) {
            return res.status(400).json({ message: "Test already submitted" });
        }

        // Calculate time taken in seconds
        const timeTaken = Math.floor((new Date() - new Date(attempt.startTime)) / 1000);

        // Fetch questions for this test set
        const questions = await AptitudeQuestion.find({ testSet: attempt.testSet });
        let score = 0;
        let correctAnswers = 0;

        questions.forEach(q => {
            const selected = attempt.answers?.get(q._id.toString());
            if (selected === q.correctAnswer) {
                score += q.marks;
                correctAnswers++;
            }
        });

        const totalQuestions = questions.length;
        const incorrectAnswers = totalQuestions - correctAnswers;
        const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        // Get attempt number for this user and test set
        const previousAttempts = await AptitudeTestAttempt.countDocuments({
            userId,
            testSet: attempt.testSet,
            isSubmitted: true
        });

        // Update attempt with all calculated values
        attempt.score = score;
        attempt.correctAnswers = correctAnswers;
        attempt.incorrectAnswers = incorrectAnswers;
        attempt.totalQuestions = totalQuestions;
        attempt.timeTaken = timeTaken;
        attempt.percentage = percentage;
        attempt.attemptNumber = previousAttempts + 1;
        attempt.isSubmitted = true;

        await attempt.save();

        // Update user aptitude quiz statistics
        await updateUserAptitudeQuizStats(userId, score, timeTaken);

        res.json({
            score,
            totalQuestions,
            correctAnswers,
            incorrectAnswers,
            percentage,
            timeTaken
        });
    } catch (error) {
        console.error("Error submitting test:", error);
        res.status(500).json({ message: "Failed to submit test", error: error.message });
    }
};

/* Helper function to update user aptitude quiz statistics */
async function updateUserAptitudeQuizStats(userId, score, timeTaken) {
    try {
        const user = await userModel.findById(userId);

        if (!user) return;

        // Initialize aptitudeQuizStats if it doesn't exist (for existing users)
        if (!user.aptitudeQuizStats) {
            user.aptitudeQuizStats = {
                totalAttempts: 0,
                totalCompleted: 0,
                averageScore: 0,
                bestScore: 0,
                totalTimeSpent: 0,
                lastAttemptDate: null
            };
        }

        // Update basic stats
        user.aptitudeQuizStats.totalAttempts += 1;
        user.aptitudeQuizStats.totalCompleted += 1;
        user.aptitudeQuizStats.totalTimeSpent += Math.floor(timeTaken / 30); // convert to minutes
        user.aptitudeQuizStats.lastAttemptDate = new Date();

        // Update best score
        if (score > user.aptitudeQuizStats.bestScore) {
            user.aptitudeQuizStats.bestScore = score;
        }

        // Recalculate average score from all completed attempts
        const allAttempts = await AptitudeTestAttempt.find({
            userId,
            isSubmitted: true
        });

        if (allAttempts.length > 0) {
            const totalScore = allAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
            user.aptitudeQuizStats.averageScore = Math.round((totalScore / allAttempts.length) * 10) / 10; // Round to 1 decimal
        }

        await user.save();
    } catch (error) {
        console.error("Error updating user aptitude quiz stats:", error);
    }
}

/* GET USER QUIZ HISTORY */
export const getUserQuizHistory = async (req, res) => {
    const userId = req.userId;
    const { testSet, limit = 10, page = 1 } = req.query;

    try {
        const query = {
            userId,
            isSubmitted: true
        };

        if (testSet) {
            query.testSet = parseInt(testSet);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const attempts = await AptitudeTestAttempt.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .select('-answers'); // Don't send answers in history

        const total = await AptitudeTestAttempt.countDocuments(query);

        res.json({
            success: true,
            attempts,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch quiz history", error: error.message });
    }
};

/* GET USER QUIZ STATISTICS */
export const getUserQuizStats = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get breakdown by test set
        const attempts = await AptitudeTestAttempt.find({
            userId,
            isSubmitted: true
        });

        const byTestSet = {};

        attempts.forEach(attempt => {
            const testSet = attempt.testSet;
            if (!byTestSet[testSet]) {
                byTestSet[testSet] = {
                    attempts: 0,
                    totalScore: 0,
                    bestScore: 0
                };
            }

            byTestSet[testSet].attempts += 1;
            byTestSet[testSet].totalScore += attempt.score || 0;

            if ((attempt.score || 0) > byTestSet[testSet].bestScore) {
                byTestSet[testSet].bestScore = attempt.score || 0;
            }
        });

        // Calculate average for each test set
        Object.keys(byTestSet).forEach(testSet => {
            const data = byTestSet[testSet];
            data.avgScore = Math.round((data.totalScore / data.attempts) * 10) / 10;
            delete data.totalScore; // Remove intermediate calculation
        });

        res.json({
            success: true,
            stats: user.aptitudeQuizStats,
            byTestSet
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch quiz stats", error: error.message });
    }
};
