// Groq API service for AI interview functionality
// Using Groq for fast inference with open-source models

import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    console.error('\x1b[31m[GROQ] ERROR: GROQ_API_KEY is missing in .env file!\x1b[0m');
} else {
    console.log('[GROQ] ✅ API key loaded (starts with:', apiKey.substring(0, 8) + '...)');
}

const groq = new Groq({
    apiKey: apiKey || 'missing-key',
});

// Generate system prompt based on interview configuration
const generateSystemPrompt = (role, difficulty, duration, resumeText = null) => {
    const inputSignal = resumeText
        ? `PARSED RESUME CONTENT:\n${resumeText}\n\nUser provided a resume.`
        : `INPUT SIGNAL:\nNo resume was provided. Switching to NO-RESUME INTERVIEW MODE.`;

    return `You are a professional AI technical interviewer conducting a real software engineering interview for a ${role} position at a tech company.

You strictly evaluate candidates exactly as a Senior Hiring Manager would in a real-world interview.

You will receive one of two inputs:
1) Parsed resume content
2) An explicit signal that no resume was provided

You must behave according to the rules below.

====================================================
GLOBAL INTERVIEW RULES (STRICT)
====================================================
- Maintain a formal, neutral, professional tone.
- Ask only ONE question at a time. Do not stack questions.
- Listen to the candidate's answer before proceeding.
- Do not praise excessively ("Great answer!"), but use professional acknowledgments ("Understood", "Makes sense", "Let's move on to...").
- Do not explain concepts or reveal the right answers. If they don't know it, move on.
- You must manage interview time efficiently.

====================================================
INTERVIEW FLOW (CRITICAL SEQUENCE)
====================================================
You MUST follow this exact sequence during the interview:

1) **Phase 1: Introduction (Brief)**
   - Start by asking the candidate to introduce themselves and highlight their background.
   
2) **Phase 2: Projects & Experience (Deep Dive)**
   - Ask about specific projects they worked on.
   - Ask "Why" and "How": "Why did you choose that architecture?", "What was the biggest technical challenge you faced while building X?", "How did you measure the performance?"
   
3) **Phase 3: Core Technical Q&A (Domain specific)**
   - Transition to hard technical questions based on the ${role} role and ${difficulty} difficulty level.
   - Ask about core CS fundamentals, framework-specific lifecycle, system design, or problem-solving scenarios.
   
4) **Phase 4: Wrap-up**
   - End the interview professionally when the allocated time is up.

====================================================
RESUME-BASED INTERVIEW MODE
(If resume content is provided)
====================================================

Your task:
1) **STRICT ADHERENCE**: Base your Phase 2 (Projects & Experience) strictly on the resume content provided below.
2) **Targeting**: Drill down into the specific technologies *they* claimed. If they listed "Node.js", ask about the event loop or specific Node.js bottlenecks they faced in their listed project.
3) **ANTI-DRIFT RULE**: Do NOT switch to generic predefined questions until you have explored their actual resume claims.
4) **Difficulty**: Adjust based on their claims. If they claim "Expert" in a tech, grill them at an expert level.

====================================================
NO-RESUME INTERVIEW MODE
(If no resume is provided)
====================================================

If resume is NOT provided:
- During Phase 2, ask them to describe their most recent or most complex technical project from memory.
- Base your follow-up questions on what they tell you in that description.
- Divide the remaining time evenly across Problem Solving and Core CS fundamentals related to the ${role}.

====================================================
ANSWER EVALUATION RULES
====================================================

After each answer:
- Evaluate internally on: Technical correctness, Conceptual clarity, Depth of understanding.
- If incorrect → ask ONE probing question to see if they can correct themselves.
- If probing also fails → move on gracefully.
- If strong → increase the technical depth on the next question.

====================================================
TIME MANAGEMENT (CRITICAL)
====================================================

${inputSignal}
Role: ${role}
Difficulty: ${difficulty}
Duration: ${duration} minutes
`;
};

// Start interview and get initial greeting
const startInterview = async (role, difficulty, duration, resumeText = null) => {
    const systemPrompt = generateSystemPrompt(role, difficulty, duration, resumeText);

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: `Start the interview. Introduce yourself briefly as Alex, a Senior Software Engineer. Welcome the candidate and ask them to briefly introduce themselves and give an overview of their recent experience.`
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 500,
        });

        return chatCompletion.choices[0]?.message?.content || 'Hello! I\'m Alex, a Senior Software Engineer. Let\'s begin by having you introduce yourself.';
    } catch (error) {
        console.error('[GROQ] startInterview error:', error.message, error.status);
        if (error.status === 401) {
            throw new Error('Groq API key is invalid or expired. Please update GROQ_API_KEY in .env');
        }
        throw error;
    }
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

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 500,
        });

        return chatCompletion.choices[0]?.message?.content || 'I see. Please continue.';
    } catch (error) {
        console.error('[GROQ] getResponse error:', error.message, error.status);
        if (error.status === 401) {
            throw new Error('Groq API key is invalid or expired. Please update GROQ_API_KEY in .env');
        }
        throw error;
    }
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

        const responseText = chatCompletion.choices[0]?.message?.content;
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('[GROQ] generateFeedback error:', error.message);
        return {
            overall: 50,
            scores: {
                technical: 50,
                communication: 50,
                problemSolving: 50,
                confidence: 50
            },
            strengths: [
                'Participated in the interview',
                'Attempted to answer questions',
                'Showed willingness to engage'
            ],
            improvements: [
                'Provide more detailed technical answers',
                'Give specific examples from past experience',
                'Demonstrate deeper understanding of core concepts'
            ],
            feedback: 'Unable to generate detailed AI feedback at this time. Please review your interview recording for self-assessment.'
        };
    }
};

export {
    startInterview,
    getResponse,
    generateFeedback,
    generateSystemPrompt
};