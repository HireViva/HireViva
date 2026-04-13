// Placeholder for interview controller
// This handles all interview-related API endpoints

import InterviewSession from '../models/InterviewSession.js';
import * as groqService from '../services/groqService.js';
import mongoose from 'mongoose';

// Store active conversations in memory (use Redis in production)
const activeConversations = new Map();

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildFallbackPrompt = (role, difficulty) => {
    const prompts = [
        `Let's continue with ${role}. Explain one project where you made a technical tradeoff and why.`,
        `At ${difficulty} level, how would you approach debugging a production issue end-to-end?`,
        `Describe a recent challenge and the concrete steps you took to solve it.`,
        `What metrics would you track to evaluate the success of your implementation?`
    ];

    return prompts[Math.floor(Math.random() * prompts.length)];
};

const buildFallbackFeedback = (session) => {
    const turns = (session.conversation || []).filter((m) => m.speaker === 'user').length;
    const base = Math.max(55, Math.min(82, 60 + turns * 2));

    return {
        overall: base,
        scores: {
            technical: Math.max(50, base - 2),
            communication: Math.max(50, base + 2),
            problemSolving: Math.max(50, base - 1),
            confidence: Math.max(50, base)
        },
        strengths: [
            'Stayed engaged through the interview',
            'Provided answers with clear intent',
            'Attempted role-relevant technical discussion'
        ],
        improvements: [
            'Add deeper implementation details to each answer',
            'Use concrete examples with measurable outcomes',
            'Structure answers as context, approach, and tradeoffs'
        ],
        feedback: 'Interview ended with partial evidence of technical depth. Continue practicing concise, structured answers with more concrete implementation detail.'
    };
};

// POST /api/interview/start
const startInterview = async (req, res) => {
    try {
        const { role, difficulty, duration, resumeText } = req.body;

        if (!role || !difficulty || !duration) {
            return res.status(400).json({ error: 'role, difficulty and duration are required' });
        }

        // Create new interview session
        const session = new InterviewSession({
            role,
            difficulty,
            duration,
            conversation: [],
            status: 'active'
        });

        await session.save();

        let greeting;
        let aiAvailable = true;
        try {
            // Get initial greeting from Groq
            greeting = await groqService.startInterview(role, difficulty, duration, resumeText);
        } catch (aiError) {
            aiAvailable = false;
            console.error('Groq start interview failed, using fallback greeting:', aiError.message);
            greeting = `Hello. I am your AI interviewer for this ${difficulty} ${role} interview. Let's begin with your introduction and then move to technical questions.`;
        }

        // Store conversation context
        // If resumeText is present, we should likely store it in the context as well if needed for future, 
        // but it's mainly baked into the system prompt.
        const systemPrompt = groqService.generateSystemPrompt(role, difficulty, duration, resumeText);
        activeConversations.set(session._id.toString(), {
            systemPrompt,
            messages: [],
            aiAvailable,
            role,
            difficulty
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
        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
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
                messages: history,
                aiAvailable: true,
                role: session.role,
                difficulty: session.difficulty
            };

            activeConversations.set(sessionId, currentContext);
        }

        // Build message history for Groq
        currentContext.messages.push({
            role: 'user',
            content: message
        });

        let aiResponse;
        if (currentContext.aiAvailable === false) {
            aiResponse = buildFallbackPrompt(currentContext.role || session.role, currentContext.difficulty || session.difficulty);
        } else {
            try {
                // Get AI response
                aiResponse = await groqService.getResponse(currentContext.messages, currentContext.systemPrompt);
            } catch (aiError) {
                console.error('Groq message failed, using fallback response:', aiError.message);
                currentContext.aiAvailable = false;
                aiResponse = buildFallbackPrompt(currentContext.role || session.role, currentContext.difficulty || session.difficulty);
            }
        }

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

        let feedback;
        try {
            // Generate feedback using Groq
            feedback = await groqService.generateFeedback(
                session.conversation,
                session.role,
                session.difficulty
            );
        } catch (aiError) {
            console.error('Groq feedback failed, using fallback feedback:', aiError.message);
            feedback = buildFallbackFeedback(session);
        }

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
        try {
            await session.save();
        } catch (saveError) {
            console.error('Failed to persist interview end state, returning computed feedback:', saveError.message);
        }

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
