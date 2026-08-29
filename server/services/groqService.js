import Groq from 'groq-sdk';

const PRIMARY_MODEL = 'groq/compound';
const FALLBACK_MODEL = 'groq/compound'; // Same — only this model works on current API key

// Lazily get or create Groq client
const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return null;
    }
    return new Groq({ apiKey });
};

// Remove <think> tags or unwanted formatting tags
const clean = (text = '') =>
    text.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/\r\n/g, '\n').trim();

// Compact system prompt for natural technical interview
const buildSystemPrompt = (role, difficulty, duration, resumeText) => {
    const resumeSection = resumeText
        ? `\nCANDIDATE RESUME (anchor your technical & project questions to this resume):\n${resumeText.substring(0, 1500)}`
        : '\nNo resume provided. Ask general role-based technical and problem-solving questions.';

    return `You are Alex, an expert, encouraging, and sharp senior technical interviewer conducting a mock interview for a ${role} role (${difficulty} difficulty, ${duration} minutes).

Rules:
- Ask exactly ONE clear, focused question per response. Never ask multiple questions at once.
- Keep your remarks concise (max 2-3 sentences per turn).
- Maintain a professional yet supportive conversational flow.
- Progress naturally: 
  1) Warm greeting & icebreaker/intro
  2) Core technical & domain fundamentals
  3) System design / architectural / algorithmic tradeoffs
  4) Behavioral / past project experience
  5) Brief wrap-up
- DO NOT use markdown headers, bullet lists, or label prefixes (e.g. do not prefix with "Interviewer:").
- Plain conversational text only.${resumeSection}`;
};

// Helper to execute completion with fallback model
const callGroqWithFallback = async (params) => {
    const groq = getGroqClient();
    if (!groq) {
        throw new Error('GROQ_API_KEY is not configured');
    }

    try {
        return await groq.chat.completions.create({
            model: PRIMARY_MODEL,
            ...params
        });
    } catch (primaryErr) {
        console.warn(`Groq primary model (${PRIMARY_MODEL}) failed: ${primaryErr.message}. Trying fallback model (${FALLBACK_MODEL})...`);
        return await groq.chat.completions.create({
            model: FALLBACK_MODEL,
            ...params
        });
    }
};

// Start interview — returns opening greeting + first question
const startInterview = async (role, difficulty, duration, resumeText = null) => {
    const systemPrompt = buildSystemPrompt(role, difficulty, duration, resumeText);
    
    try {
        const res = await callGroqWithFallback({
            max_tokens: 150,
            temperature: 0.7,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Please introduce yourself briefly as Alex and ask your first opening question for this ${difficulty} ${role} interview.` }
            ]
        });

        const reply = clean(res.choices[0]?.message?.content || '');
        if (reply) return reply;
    } catch (err) {
        console.error('Groq startInterview failed:', err.message);
    }

    return `Hello! I'm Alex, your interviewer today for the ${role} position (${difficulty} level). To kick things off, could you briefly introduce yourself and highlight a recent project you're proud of?`;
};

// Reply to candidate message
const getResponse = async (history, systemPrompt) => {
    // Keep last 10 turns max to control context size
    const trimmed = history.slice(-10);

    try {
        const res = await callGroqWithFallback({
            max_tokens: 150,
            temperature: 0.7,
            messages: [{ role: 'system', content: systemPrompt }, ...trimmed]
        });

        const reply = clean(res.choices[0]?.message?.content || '');
        if (reply) return reply;
    } catch (err) {
        console.error('Groq getResponse failed:', err.message);
    }

    return 'Thank you for sharing. Could you walk me through the key technical tradeoffs you made in that approach?';
};

// Final feedback — returns parsed JSON object
const generateFeedback = async (conversation, role, difficulty) => {
    const transcript = (conversation || [])
        .map(m => `${m.speaker === 'ai' ? 'INTERVIEWER' : 'CANDIDATE'}: ${m.message}`)
        .join('\n');

    const prompt = `You are a Principal Engineer and Talent Lead evaluating a mock interview.
Role: ${role}
Difficulty: ${difficulty}

Interview Transcript:
${transcript.substring(0, 4000)}

Evaluate the candidate's performance based on their responses. Output ONLY a valid JSON object matching this schema with no additional commentary:
{
  "overall": <number 0-100>,
  "scores": {
    "technical": <number 0-100>,
    "communication": <number 0-100>,
    "problemSolving": <number 0-100>,
    "confidence": <number 0-100>
  },
  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>",
    "<specific strength 3>"
  ],
  "improvements": [
    "<specific actionable improvement 1>",
    "<specific actionable improvement 2>",
    "<specific actionable improvement 3>"
  ],
  "feedback": "<2-4 sentence summary with constructive guidance>"
}`;

    try {
        const res = await callGroqWithFallback({
            max_tokens: 800,
            temperature: 0.2,
            messages: [{ role: 'user', content: prompt }]
        });

        const raw = clean(res.choices[0]?.message?.content || '{}');
        
        // Extract JSON using regex in case model wraps in \`\`\`json ... \`\`\` or adds text
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.overall !== undefined && parsed.scores && Array.isArray(parsed.strengths)) {
                return parsed;
            }
        }
    } catch (err) {
        console.error('Groq feedback generation error:', err.message);
    }

    // Heuristic fallback if API is unavailable or parse fails
    const userTurns = (conversation || []).filter(m => m.speaker === 'user').length;
    const baseScore = Math.min(88, Math.max(60, 58 + userTurns * 4));
    
    return {
        overall: baseScore,
        scores: {
            technical: Math.min(95, baseScore - 2),
            communication: Math.min(95, baseScore + 3),
            problemSolving: baseScore,
            confidence: Math.min(95, baseScore + 1)
        },
        strengths: [
            'Engaged actively throughout the interview session',
            'Communicated core technical concepts with clarity',
            'Structured problem-solving approach systematically'
        ],
        improvements: [
            'Deepen explanations of underlying architectural tradeoffs',
            'Provide more quantifiable metrics and impact in project examples',
            'Consider boundary constraints and error handling earlier in solutions'
        ],
        feedback: `Completed the ${role} interview successfully. You demonstrated good domain familiarity and structured communication. Focus on elaborating edge cases and discussing architectural tradeoffs to elevate your score to senior level.`
    };
};

export { buildSystemPrompt, startInterview, getResponse, generateFeedback };
export const generateSystemPrompt = buildSystemPrompt;
