// Groq API service for AI interview functionality
// Using Groq for fast inference with open-source models

import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Generate system prompt based on interview configuration
const generateSystemPrompt = (role, difficulty, duration, resumeText = null) => {
    const inputSignal = resumeText
        ? `RESUME TEXT:\n${resumeText}\n\nResume is available.`
        : 'No resume is available. Use role-based questioning.';

    return `You are a senior technical interviewer running a realistic live interview for a ${role} role.

Interview style requirements:
- Sound natural and human, not robotic.
- Ask exactly one question at a time.
- Keep questions concise and clear.
- Use short transitions between questions so the conversation flows naturally.
- Be professional but conversational.
- Do not provide full solutions; evaluate candidate reasoning.

Questioning strategy:
- Use the selected difficulty: ${difficulty}.
- Total interview time is ${duration} minutes; keep pace and move forward when needed.
- If answer is weak: ask one focused follow-up, then move on.
- If answer is strong: deepen complexity naturally.

If resume is available:
- Anchor questions to resume claims, projects, and technologies.
- Validate specific claims with practical follow-ups.

If resume is not available:
- Cover core fundamentals, practical problem-solving, and role-relevant implementation decisions.

Output rules:
- Plain conversational text only.
- No markdown, no bullet lists, no labels like "Question 1".

Context:
${inputSignal}`;
};

// Start interview and get initial greeting
const startInterview = async (role, difficulty, duration, resumeText = null) => {
    const systemPrompt = generateSystemPrompt(role, difficulty, duration, resumeText);

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: 'Start naturally: one short intro sentence, then ask the first interview question.'
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 500,
    });

    return chatCompletion.choices[0]?.message?.content || 'Hi, I am your interviewer today. Tell me about your most relevant recent project.';
};

// Get AI response to user message
const getResponse = async (conversationHistory, systemPrompt) => {
    const messages = [
        {
            role: 'system',
            content: systemPrompt
        },
        ...conversationHistory
    ];

    const chatCompletion = await groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 500,
    });

    return chatCompletion.choices[0]?.message?.content || 'Thanks. Let us move to the next question: how would you improve performance in your last implementation?';
};

// Generate final feedback and scores
const generateFeedback = async (conversation, role, difficulty) => {
    const conversationText = conversation.map(msg =>
        `${msg.speaker.toUpperCase()}: ${msg.message}`
    ).join('\n');

    const feedbackPrompt = `Based on this ${role} interview at ${difficulty} level, provide a comprehensive evaluation in JSON format.

CRITICAL INSTRUCTION: Be BRUTALLY HONEST and CRITICAL.
- Do NOT sugarcoat.
- If the candidate failed, say so directly.
- If answers were shallow, call it out.
- Rate STRICTLY. A score of 80+ should be rare and reserved for true experts.
- Avoid generic statements like "Good communication".
- Instead, use specific feedback like "Failed to explain the event loop correctly" or "Struggled with Big O notation".

Conversation:
${conversationText}

Provide your response ONLY as valid JSON in this exact format:
{
  "overall": <score 0-100>,
  "scores": {
    "technical": <score 0-100>,
    "communication": <score 0-100>,
    "problemSolving": <score 0-100>,
    "confidence": <score 0-100>
  },
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "improvements": ["CRITICAL improvement 1", "CRITICAL improvement 2", "CRITICAL improvement 3"],
  "feedback": "A brutally honest paragraph summary. Do not use 'sandwich method' (good-bad-good). Start directly with the main critique."
}`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: feedbackPrompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            max_tokens: 1500,
            response_format: { type: 'json_object' }
        });

        const responseText = chatCompletion.choices?.[0]?.message?.content || '';
        if (!responseText) {
            throw new Error('Empty feedback response from Groq');
        }

        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('Error generating/parsing feedback JSON:', error);
        return {
            overall: 75,
            scores: {
                technical: 75,
                communication: 75,
                problemSolving: 75,
                confidence: 75
            },
            strengths: [
                'Participated in the interview',
                'Communicated clearly',
                'Showed engagement'
            ],
            improvements: [
                'Provide more detailed answers',
                'Give specific examples',
                'Ask clarifying questions'
            ],
            feedback: 'Thank you for participating in this interview. Continue practicing to improve your skills.'
        };
    }
};

export {
    startInterview,
    getResponse,
    generateFeedback,
    generateSystemPrompt
};
