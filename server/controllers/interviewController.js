// Placeholder for interview controller
// This handles all interview-related API endpoints

import InterviewSession from '../models/InterviewSession.js';
import * as groqService from '../services/groqService.js';
import mongoose from 'mongoose';

// Store active conversations in memory (use Redis in production)
const activeConversations = new Map();

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/interview/start
const startInterview = async (req, res) => {
    try {
        const { role, difficulty, duration, resumeText } = req.body;

        // Create new interview session
        const session = new InterviewSession({
            role,
            difficulty,
            duration,
            conversation: [],
            status: 'active'
        });

        await session.save();

        // Get initial greeting from Groq
        const greeting = await groqService.startInterview(role, difficulty, duration, resumeText);

        // Store conversation context
        // If resumeText is present, we should likely store it in the context as well if needed for future, 
        // but it's mainly baked into the system prompt.
        const systemPrompt = groqService.generateSystemPrompt(role, difficulty, duration, resumeText);
        activeConversations.set(session._id.toString(), {
            systemPrompt,
            messages: []
        });

        // Add greeting to conversation
        session.conversation.push({
            speaker: 'ai',
            message: greeting,
            timestamp: new Date()
        });

        await session.save();

        res.json({
            sessionId: session._id,
            greeting
        });
    } catch (error) {
        console.error('Error starting interview:', error);
        res.status(500).json({ error: 'Failed to start interview' });
    }
};

// POST /api/interview/message
const sendMessage = async (req, res) => {
    try {
        const { sessionId, message, speaker } = req.body;

        if (!sessionId || !isValidId(sessionId)) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }

        const session = await InterviewSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Add user message to conversation
        session.conversation.push({
            speaker,
            message,
            timestamp: new Date()
        });

        // Get conversation context
        let currentContext = activeConversations.get(sessionId);

        if (!currentContext) {
            console.log('Context missing, reconstructing from DB for session:', sessionId);
            const systemPrompt = groqService.generateSystemPrompt(session.role, session.difficulty, session.duration);

            // Reconstruct messages from stored conversation
            const history = session.conversation.map(msg => ({
                role: msg.speaker === 'ai' ? 'assistant' : 'user',
                content: msg.message
            }));

            currentContext = {
                systemPrompt,
                messages: history
            };

            activeConversations.set(sessionId, currentContext);
        }

        // Build message history for Groq
        currentContext.messages.push({
            role: 'user',
            content: message
        });

        // Get AI response
        const aiResponse = await groqService.getResponse(currentContext.messages, currentContext.systemPrompt);

        // Add AI response to conversation
        currentContext.messages.push({
            role: 'assistant',
            content: aiResponse
        });

        session.conversation.push({
            speaker: 'ai',
            message: aiResponse,
            timestamp: new Date()
        });

        await session.save();

        res.json({
            message: aiResponse
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// POST /api/interview/end
const endInterview = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId || !isValidId(sessionId)) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }

        const session = await InterviewSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Generate feedback using Groq
        const feedback = await groqService.generateFeedback(
            session.conversation,
            session.role,
            session.difficulty
        );

        // Update session with scores and feedback
        session.scores = {
            overall: feedback.overall,
            technical: feedback.scores.technical,
            communication: feedback.scores.communication,
            problemSolving: feedback.scores.problemSolving,
            confidence: feedback.scores.confidence
        };

        session.feedback = {
            strengths: feedback.strengths,
            improvements: feedback.improvements,
            detailed: feedback.feedback
        };

        session.status = 'completed';
        await session.save();

        // Clean up conversation context
        activeConversations.delete(sessionId);

        res.json({
            sessionId: session._id,
            ...feedback
        });
    } catch (error) {
        console.error('Error ending interview:', error);
        res.status(500).json({ error: 'Failed to end interview' });
    }
};

// GET /api/interview/:id
const getInterview = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !isValidId(id)) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }

        const session = await InterviewSession.findById(id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json({
            overall: session.scores?.overall || 0,
            scores: {
                technical: session.scores?.technical || 0,
                communication: session.scores?.communication || 0,
                problemSolving: session.scores?.problemSolving || 0,
                confidence: session.scores?.confidence || 0
            },
            strengths: session.feedback?.strengths || [],
            improvements: session.feedback?.improvements || [],
            feedback: session.feedback?.detailed || '',
            role: session.role,
            difficulty: session.difficulty,
            duration: session.duration
        });
    } catch (error) {
        console.error('Error fetching interview:', error);
        res.status(500).json({ error: 'Failed to fetch interview' });
    }
};

export {
    startInterview,
    sendMessage,
    endInterview,
    getInterview
};
