const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

/**
 * Vercel Serverless Function for Chat API
 * POST /api/chat
 */
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { message, context, userType } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Build context-aware system prompt
    const systemPrompt = `You are FundMeUp's AI assistant, an intelligent chatbot helping students and donors on a Web3 scholarship platform.

PLATFORM CONTEXT:
- FundMeUp is a blockchain-based scholarship platform
- Students apply for micro-scholarships with milestone-based funding
- Donors support students and receive NFT badges for donations
- All transactions are transparent on the blockchain (Ethereum)
- AI verifies student submissions and milestone completions

${userType === 'student' ? `
STUDENT ASSISTANT MODE:
Help students with:
- Applying for scholarships
- Writing compelling bios
- Creating effective milestones
- Email verification process
- Submitting proof documents
- Understanding the funding process
- Troubleshooting application issues
` : userType === 'donor' ? `
DONOR ASSISTANT MODE:
Help donors with:
- Finding students to support
- Understanding donation process
- Claiming NFT badges
- Tracking their impact
- Tax benefits and deductions
- Platform statistics and trends
- Crypto payment information
` : `
GENERAL ASSISTANT MODE:
Help anyone with:
- Understanding FundMeUp platform
- How to get started
- Platform features and benefits
- Technical support
`}

INSTRUCTIONS:
- Be friendly, helpful, and concise (keep responses under 150 words when possible)
- Use emojis sparingly but effectively (🎓 📧 💰 🎯 ✨)
- Provide actionable, specific advice
- If you don't know something, admit it and guide them to the right resource
- Always stay on topic about FundMeUp and education/scholarships
- Avoid repeating the same information in one response
- Answer naturally and conversationally, like a helpful friend

Respond naturally as if you're a knowledgeable friend helping them navigate the platform.`;

    let response;
    
    if (genAI) {
      try {
        // Use Gemini API
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Combine system prompt with user message
        const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;
        
        const result = await model.generateContent(fullPrompt);
        const geminiResponse = await result.response;
        response = geminiResponse.text();
        
        // If response is empty or too short, try chat approach
        if (!response || response.trim().length < 10) {
          const chat = model.startChat({
            history: [
              {
                role: 'user',
                parts: [{ text: systemPrompt }]
              },
              {
                role: 'model',
                parts: [{ text: 'I understand. I\'m FundMeUp\'s AI assistant ready to help students and donors.' }]
              }
            ]
          });
          
          const chatResult = await chat.sendMessage(message);
          const chatResponse = await chatResult.response;
          response = chatResponse.text() || response || "I'm here to help! Could you tell me more about what you need?";
        }
      } catch (geminiError) {
        console.error('Gemini API Error:', geminiError);
        throw new Error(`Gemini API error: ${geminiError.message}`);
      }
    } else {
      throw new Error('GEMINI_API_KEY not configured. Please set it in Vercel environment variables.');
    }

    res.status(200).json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat Error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate response',
      message: error.message || 'An error occurred while processing your request',
      timestamp: new Date().toISOString()
    });
  }
};

