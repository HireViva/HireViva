import userProgressModel from '../models/userProgressModel.js';

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
            const solvedIndex = progress.solved.indexOf(questionId);

            if (solvedIndex > -1) {
                // Remove from solved
                progress.solved.splice(solvedIndex, 1);
            } else {
                // Add to solved
                progress.solved.push(questionId);
            }

            await progress.save();
        }

        res.json({
            success: true,
            solved: progress.solved
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