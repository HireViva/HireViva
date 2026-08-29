// Interview routes
import express from 'express';
const router = express.Router();
import * as interviewController from '../controllers/interviewController.js';
import userAuth from '../middleware/userAuth.js';
import { checkAIInterviewAccess, incrementAIInterviewUsage } from '../middleware/subscriptionMiddleware.js';
import Groq from 'groq-sdk';

// ── PUBLIC test endpoint — open in browser to verify LLM works ──────────────
// GET http://localhost:5000/api/interview/test
router.get('/test', async (req, res) => {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const result = await groq.chat.completions.create({
            model: 'groq/compound',
            max_tokens: 80,
            messages: [
                { role: 'system', content: 'You are an interviewer. Be brief.' },
                { role: 'user', content: 'Ask me one short interview question.' }
            ]
        });
        const reply = result.choices[0]?.message?.content?.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        res.json({
            status: '✅ LLM is WORKING',
            model: 'groq/compound',
            apiKeyUsed: process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 8)}...` : 'NOT SET',
            response: reply
        });
    } catch (err) {
        res.status(500).json({
            status: '❌ LLM FAILED',
            error: err.message,
            apiKeyUsed: process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 8)}...` : 'NOT SET'
        });
    }
});

router.post('/start', userAuth, checkAIInterviewAccess, interviewController.startInterview);
router.post('/message', userAuth, interviewController.sendMessage);
router.post('/end', userAuth, incrementAIInterviewUsage, interviewController.endInterview);
router.get('/:id', userAuth, interviewController.getInterview);

export default router;
