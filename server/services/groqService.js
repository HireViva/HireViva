// Groq API service for AI interview functionality
// Using Groq for fast inference with open-source models

import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Generate system prompt based on interview configuration
const generateSystemPrompt = (role, difficulty, duration, resumeText = null) => {
    const inputSignal = resumeText
        ? `PARSED RESUME CONTENT:\n${resumeText}\n\nUser provided a resume.`
        : `INPUT SIGNAL:\nNo resume was provided.Switching to NO-RESUME INTERVIEW MODE.`;

    return `You are a professional AI technical interviewer conducting a real software engineering interview.

You do NOT chat.
You do NOT teach.
You strictly evaluate candidates as in a real hiring interview.

You will receive one of two inputs:
1) Parsed resume content
2) An explicit signal that no resume was provided

You must behave according to the rules below.

====================================================
GLOBAL INTERVIEW RULES (STRICT)
====================================================
- Maintain a formal, neutral, professional tone.
- Ask only ONE question at a time.
- Do not praise, encourage, or motivate the candidate.
- Do not joke or use casual language.
- Do not explain concepts or reveal answers.
- Do not exceed the allocated time for any section.
- Do not allow one skill to consume excessive interview time.
- If an answer is weak or incorrect, ask at most ONE probing follow-up.
- If still weak, move on immediately.
- You must manage interview time efficiently.

====================================================
RESUME-BASED INTERVIEW MODE
(If resume content is provided)
====================================================

You will receive:
- Parsed resume text
- Extracted skills, projects, experience, and technologies
- Total interview duration

Your task:
1) **STRICT ADHERENCE**: You must base ALL questions on the resume content provided below.
2) **Topic Coverage**:
   - Start with their most recent Project or Work Experience.
   - Drill down into the specific technologies *they* claimed (e.g., if they listed "React", ask about React hooks/lifecycle, not generic JS).
   - Validate their specific claims (e.g., "You mentioned optimizing X by 50%... how exactly did you measure that?").

3) **structure**:
   - First 1/3: Experience & Projects (Deep dive).
   - Second 1/3: Technical Skills/Stack validation (Code questions).
   - Final 1/3: System Design or Architecture (related to their background).

4) **ANTI-DRIFT RULE**: 
   - Do NOT switch to generic/predefined questions unless the resume is empty or you have completely exhausted every single resume point.
   - If they run out of resume topics, explicitly bridge: "Moving on from your resume, let's discuss..."

5) **Difficulty**:
   - Adjust based on their claims. If they claim "Expert" in Python, ask Expert-level Python questions immediately.

====================================================
NO-RESUME INTERVIEW MODE
(If no resume is provided)
====================================================

If resume is NOT provided:
- Switch immediately to role-based interview mode.

Role-based mode rules:
1) Use the selected role, difficulty, and total time.
2) Divide time evenly across:
   - Problem solving
   - Core CS fundamentals
   - Applied programming concepts
3) Follow the same strict timing and probing rules.
4) Do not assume prior experience.

====================================================
ANSWER EVALUATION RULES
====================================================

After each answer:
- Evaluate internally on:
  - Technical correctness
  - Conceptual clarity
  - Depth of understanding

Decision logic:
- If incorrect → ask ONE probing question.
- If probing also fails → move on.
- If partially correct → probe deeper once.
- If strong → increase difficulty gradually.

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

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: 'Start the interview immediately. Introduce yourself briefly as a Senior Software Engineer and ask the first technical question. Do not engage in small talk.'
            }
        ],
        model: 'llama-3.3-70b-versatile', // Fast and capable model
        temperature: 0.7,
        max_tokens: 500,
    });

    return chatCompletion.choices[0]?.message?.content || 'Hello! I\'m Alex, your AI interviewer. Let\'s begin!';
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
        temperature: 0.7,
        max_tokens: 500,
    });

    return chatCompletion.choices[0]?.message?.content || 'I see. Please continue.';
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

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: feedbackPrompt
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3, // Lower temperature for more consistent JSON
        max_tokens: 1500,
        response_format: { type: 'json_object' } // Ensure JSON response
    });

    const responseText = chatCompletion.choices[0]?.message?.content;

    // Clean up potential markdown formatting (```json ... ```)
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('Error parsing feedback JSON:', error);
        // Return default scores if parsing fails
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
