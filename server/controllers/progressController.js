import userProgressModel from '../models/userProgressModel.js';
import {
    getDashboardMetrics,
    addProblemSolved,
    recalculateUserProgress,
    updateDayStreak
} from '../services/progressService.js';

// Get user's progress
export const getUserProgress = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware

        let progress = await userProgressModel.findOne({ userId });

        // If user has no progress, create initial empty progress
        if (!progress) {
            progress = await userProgressModel.create({
                userId,
                solved: [],
                starred: [],
                notes: {}
            });
        }

        res.json({
            success: true,
            progress: {
                solved: progress.solved,
                starred: progress.starred,
                notes: Object.fromEntries(progress.notes) // Convert Map to Object
            }
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progress'
        });
    }
};

// Get dashboard metrics
export const getDashboard = async (req, res) => {
    try {
        const userId = req.userId;
        const metrics = await getDashboardMetrics(userId);

        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard metrics'
        });
    }
};

// Get module-wise breakdown
export const getModuleBreakdown = async (req, res) => {
    try {
        const userId = req.userId;
        const progress = await recalculateUserProgress(userId);

        const breakdown = {
            aiInterview: {
                name: 'AI Interview',
                score: progress.moduleProgress.aiInterview.score || 0,
                attempts: progress.moduleProgress.aiInterview.attempts || 0,
                completed: progress.moduleProgress.aiInterview.completed || 0
            },
            coding: {
                name: 'Coding',
                score: progress.moduleProgress.coding.score || 0,
                attempts: progress.moduleProgress.coding.attempts || 0,
                completed: progress.moduleProgress.coding.completed || 0
            },
            aptitude: {
                name: 'Aptitude',
                score: progress.moduleProgress.aptitude.score || 0,
                attempts: progress.moduleProgress.aptitude.attempts || 0,
                completed: progress.moduleProgress.aptitude.completed || 0
            },
            communication: {
                name: 'Communication',
                score: progress.moduleProgress.communication.score || 0,
                attempts: progress.moduleProgress.communication.attempts || 0,
                completed: progress.moduleProgress.communication.completed || 0
            },
            coreSubjects: {
                name: 'Core Subjects',
                score: progress.moduleProgress.coreSubjects.score || 0,
                attempts: progress.moduleProgress.coreSubjects.attempts || 0,
                completed: progress.moduleProgress.coreSubjects.completed || 0
            }
        };

        res.json({
            success: true,
            data: breakdown
        });
    } catch (error) {
        console.error('Get module breakdown error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch module breakdown'
        });
    }
};

// Get weekly performance data
export const getWeeklyPerformance = async (req, res) => {
    try {
        const userId = req.userId;
        const progress = await recalculateUserProgress(userId);

        res.json({
            success: true,
            data: progress.weeklyPerformance.slice(-8) || []
        });
    } catch (error) {
        console.error('Get weekly performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weekly performance'
        });
    }
};

// Get day streak and activity
export const getDayStreak = async (req, res) => {
    try {
        const userId = req.userId;
        const progress = await recalculateUserProgress(userId);

        res.json({
            success: true,
            data: progress.dayStreak
        });
    } catch (error) {
        console.error('Get day streak error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch day streak'
        });
    }
};

// Toggle solved status
export const toggleSolved = async (req, res) => {
    try {
        const userId = req.userId;
        const { questionId } = req.body;

        if (typeof questionId !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Invalid question ID'
            });
        }

        let progress = await userProgressModel.findOne({ userId });

        if (!progress) {
            progress = await userProgressModel.create({
                userId,
                solved: [questionId],
                starred: [],
                notes: {}
            });
        } else {
            const solvedIndex = progress.solved.findIndex(s => 
                (typeof s === 'number' ? s : s.questionId) === questionId
            );

            if (solvedIndex > -1) {
                // Remove from solved
                progress.solved.splice(solvedIndex, 1);
            } else {
                // Add to solved
                progress.solved.push({
                    questionId,
                    solvedDate: new Date()
                });
            }

            updateDayStreak(progress);
            await progress.save();
        }

        res.json({
            success: true,
            solved: progress.solved,
            totalSolved: progress.solved.length
        });
    } catch (error) {
        console.error('Toggle solved error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update progress'
        });
    }
};

// Toggle starred status
export const toggleStarred = async (req, res) => {
    try {
        const userId = req.userId;
        const { questionId } = req.body;

        if (typeof questionId !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Invalid question ID'
            });
        }

        let progress = await userProgressModel.findOne({ userId });

        if (!progress) {
            progress = await userProgressModel.create({
                userId,
                solved: [],
                starred: [questionId],
                notes: {}
            });
        } else {
            const starredIndex = progress.starred.indexOf(questionId);

            if (starredIndex > -1) {
                // Remove from starred
                progress.starred.splice(starredIndex, 1);
            } else {
                // Add to starred
                progress.starred.push(questionId);
            }

            await progress.save();
        }

        res.json({
            success: true,
            starred: progress.starred
        });
    } catch (error) {
        console.error('Toggle starred error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update starred'
        });
    }
};

// Save or update note
export const saveNote = async (req, res) => {
    try {
        const userId = req.userId;
        const { questionId, content } = req.body;

        if (typeof questionId !== 'number' || typeof content !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid data'
            });
        }

        let progress = await userProgressModel.findOne({ userId });

        if (!progress) {
            progress = await userProgressModel.create({
                userId,
                solved: [],
                starred: [],
                notes: new Map([[String(questionId), {
                    content,
                    lastUpdated: new Date()
                }]])
            });
        } else {
            progress.notes.set(String(questionId), {
                content,
                lastUpdated: new Date()
            });
            await progress.save();
        }

        res.json({
            success: true,
            message: 'Note saved successfully'
        });
    } catch (error) {
        console.error('Save note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save note'
        });
    }
};

// Delete note
export const deleteNote = async (req, res) => {
    try {
        const userId = req.userId;
        const { questionId } = req.body;

        if (typeof questionId !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Invalid question ID'
            });
        }

        let progress = await userProgressModel.findOne({ userId });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress not found'
            });
        }

        progress.notes.delete(String(questionId));
        await progress.save();

        res.json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete note'
        });
    }
};

// Bulk update progress
export const bulkUpdateProgress = async (req, res) => {
    try {
        const userId = req.userId;
        const { solved, starred, notes } = req.body;

        let progress = await userProgressModel.findOne({ userId });

        if (!progress) {
            progress = await userProgressModel.create({
                userId,
                solved: solved || [],
                starred: starred || [],
                notes: notes ? new Map(Object.entries(notes)) : new Map()
            });
        } else {
            if (Array.isArray(solved)) {
                progress.solved = solved;
            }
            if (Array.isArray(starred)) {
                progress.starred = starred;
            }
            if (notes && typeof notes === 'object') {
                progress.notes = new Map(Object.entries(notes));
            }
            await progress.save();
        }

        res.json({
            success: true,
            message: 'Progress updated successfully',
            progress
        });
    } catch (error) {
        console.error('Bulk update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update progress'
        });
    }
};
export const saveNote = async (req, res) => {
    try {
        const userId = req.userId;
        const { questionId, content } = req.body;

        if (typeof questionId !== 'number' || typeof content !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid data'
            });
        }

        let progress = await userProgressModel.findOne({ userId });

        if (!progress) {
            progress = await userProgressModel.create({
                userId,
                solved: [],
                starred: [],
                notes: new Map()
            });
        }

        // Update note
        progress.notes.set(questionId.toString(), {
            content: content.trim(),
            lastUpdated: new Date()
        });

        await progress.save();

        res.json({
            success: true,
            note: {
                content: content.trim(),
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Save note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save note'
        });
    }
};

// Delete note
export const deleteNote = async (req, res) => {
    try {
        const userId = req.userId;
        const { questionId } = req.body;

        if (typeof questionId !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Invalid question ID'
            });
        }

        const progress = await userProgressModel.findOne({ userId });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress not found'
            });
        }

        progress.notes.delete(questionId.toString());
        await progress.save();

        res.json({
            success: true,
            message: 'Note deleted'
        });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete note'
        });
    }
};

// Bulk update progress (optional - for efficiency)
export const bulkUpdateProgress = async (req, res) => {
    try {
        const userId = req.userId;
        const { solved, starred } = req.body;

        const progress = await userProgressModel.findOneAndUpdate(
            { userId },
            {
                $set: {
                    solved: solved || [],
                    starred: starred || []
                }
            },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            progress: {
                solved: progress.solved,
                starred: progress.starred
            }
        });
    } catch (error) {
        console.error('Bulk update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update progress'
        });
    }
};