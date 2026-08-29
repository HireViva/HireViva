import InterviewSession from '../models/InterviewSession.js';
import * as groqService from '../services/groqService.js';
import mongoose from 'mongoose';
import { recordUserActivity } from '../services/progressService.js';

// In-memory session context store (sessionId → { systemPrompt, messages[] })
const activeConversations = new Map();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ── Fallback helpers ────────────────────────────────────────────────────────
const FALLBACK_QUESTIONS = [
    'Can you walk me through a challenging project you recently worked on?',
    'How do you approach debugging a difficult production issue?',
    'Describe a time you had to learn a new technology quickly. How did you handle it?',
    'What tradeoffs did you make in your last major technical decision?'
];
let fallbackIdx = 0;
const nextFallback = () => FALLBACK_QUESTIONS[fallbackIdx++ % FALLBACK_QUESTIONS.length];

const fallbackFeedback = (session) => {
    const turns = (session.conversation || []).filter(m => m.speaker === 'user').length;
    const score = Math.min(85, 55 + turns * 3);
    return {
        overall: score,
        scores: { technical: score - 2, communication: score + 2, problemSolving: score, confidence: score },
        strengths: ['Completed the interview', 'Communicated intent clearly', 'Stayed engaged'],
        improvements: ['Add implementation detail', 'Use concrete examples', 'Structure answers: context → action → result'],
        feedback: 'Interview ended. Practice deeper technical explanations with measurable outcomes.'
    };
};

// ── POST /api/interview/start ───────────────────────────────────────────────
const startInterview = async (req, res) => {
    try {
        const { role, difficulty, duration, resumeText } = req.body;
        const userId = req.userId;

        if (!role || !difficulty || !duration) {
            return res.status(400).json({ error: 'role, difficulty and duration are required' });
        }

        // Persist session to DB
        const session = new InterviewSession({
            userId, role, difficulty, duration,
            conversation: [], status: 'active'
        });
        await session.save();

        // Build & cache conversation context
        const systemPrompt = groqService.generateSystemPrompt(role, difficulty, duration, resumeText);
        activeConversations.set(session._id.toString(), {
            systemPrompt,
            messages: [],   // chat history (user/assistant turns only)
        });

        // Get AI greeting
        let greeting;
        try {
            greeting = await groqService.startInterview(role, difficulty, duration, resumeText);
        } catch (err) {
            console.error('Groq start failed:', err.message);
            greeting = `Hello! I'm Alex, your interviewer for this ${difficulty} ${role} session. Let's start — please tell me about yourself.`;
        }

        // Save greeting to DB + in-memory history
        session.conversation.push({ speaker: 'ai', message: greeting, timestamp: new Date() });
        await session.save();

        const ctx = activeConversations.get(session._id.toString());
        ctx.messages.push({ role: 'assistant', content: greeting });

        return res.json({ sessionId: session._id, greeting });
    } catch (err) {
        console.error('startInterview error:', err);
        return res.status(500).json({ error: 'Failed to start interview' });
    }
};

// ── POST /api/interview/message ─────────────────────────────────────────────
const sendMessage = async (req, res) => {
    try {
        const { sessionId, message } = req.body;

        if (!sessionId || !isValidId(sessionId)) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }
        if (!message?.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const session = await InterviewSession.findById(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        if (session.userId?.toString() !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Restore context if server was restarted
        let ctx = activeConversations.get(sessionId);
        if (!ctx) {
            console.log('Restoring context for session:', sessionId);
            const systemPrompt = groqService.generateSystemPrompt(
                session.role, session.difficulty, session.duration
            );
            // Build history from DB — map speaker → role
            const messages = session.conversation.map(m => ({
                role: m.speaker === 'ai' ? 'assistant' : 'user',
                content: m.message
            }));
            ctx = { systemPrompt, messages };
            activeConversations.set(sessionId, ctx);
        }

        // Add user turn to in-memory + DB
        ctx.messages.push({ role: 'user', content: message.trim() });
        session.conversation.push({ speaker: 'user', message: message.trim(), timestamp: new Date() });

        // Get AI reply
        let aiReply;
        try {
            aiReply = await groqService.getResponse(ctx.messages, ctx.systemPrompt);
        } catch (err) {
            console.error('Groq getResponse failed:', err.message);
            aiReply = nextFallback();
        }

        // Add AI turn
        ctx.messages.push({ role: 'assistant', content: aiReply });
        session.conversation.push({ speaker: 'ai', message: aiReply, timestamp: new Date() });
        await session.save();

        return res.json({ message: aiReply });
    } catch (err) {
        console.error('sendMessage error:', err);
        return res.status(500).json({ error: 'Failed to process message' });
    }
};

// ── POST /api/interview/end ─────────────────────────────────────────────────
const endInterview = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId || !isValidId(sessionId)) {
            return res.status(400).json({ error: 'Invalid session ID' });
        }

        const session = await InterviewSession.findById(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        if (session.userId?.toString() !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        let feedback;
        try {
            feedback = await groqService.generateFeedback(session.conversation, session.role, session.difficulty);
        } catch (err) {
            console.error('Groq feedback failed:', err.message);
            feedback = fallbackFeedback(session);
        }

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

        try { await session.save(); } catch (e) {
            console.error('Session save error:', e.message);
        }

        try {
            await recordUserActivity(session.userId || req.userId, 'ai_interview');
        } catch (e) {
            console.error('Activity record error:', e.message);
        }

        activeConversations.delete(sessionId);

        return res.json({ sessionId: session._id, ...feedback });
    } catch (err) {
        console.error('endInterview error:', err);
        return res.status(500).json({ error: 'Failed to end interview' });
    }
};

// ── GET /api/interview/:id ──────────────────────────────────────────────────
const getInterview = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !isValidId(id)) return res.status(400).json({ error: 'Invalid ID' });

        const session = await InterviewSession.findById(id);
        if (!session) return res.status(404).json({ error: 'Session not found' });
        if (session.userId?.toString() !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        return res.json({
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
    } catch (err) {
        console.error('getInterview error:', err);
        return res.status(500).json({ error: 'Failed to fetch interview' });
    }
};

export { startInterview, sendMessage, endInterview, getInterview };
