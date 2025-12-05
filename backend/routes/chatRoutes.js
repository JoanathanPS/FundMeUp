const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Load training dataset
const trainingDataset = require('../data/chatTrainingDataset.json');

/**
 * Chat completion endpoint for AI Assistant
 * POST /api/chat
 */
router.post('/', async (req, res) => {
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

TRAINING DATA: You've been trained on ${trainingDataset.length} domain-specific Q&A pairs about scholarships, education funding, blockchain, and FundMeUp platform features.

Respond naturally as if you're a knowledgeable friend helping them navigate the platform.`;

    let response;
    
    if (genAI) {
      try {
        // Use Gemini API
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Build conversation history with system prompt
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
        
        const result = await chat.sendMessage(message);
        const geminiResponse = await result.response;
        response = geminiResponse.text() || "I'm here to help! Could you tell me more about what you need?";
      } catch (geminiError) {
        console.error('Gemini API Error:', geminiError);
        // Fallback to simple generation if chat fails
        try {
          const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
          const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;
          const result = await model.generateContent(fullPrompt);
          const geminiResponse = await result.response;
          response = geminiResponse.text() || "I'm here to help! Could you tell me more about what you need?";
        } catch (fallbackError) {
          console.error('Gemini Fallback Error:', fallbackError);
          throw fallbackError;
        }
      }
    } else {
      // Fallback if Gemini API key not configured
      response = "I'm here to help! Could you tell me more about what you need?";
    }

    res.status(200).json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat Error:', error);
    
    // Fallback response
    const fallbackResponses = {
      student: "I'm here to help with your scholarship application! What would you like assistance with?",
      donor: "I can help you find students to support and understand the donation process. What would you like to know?",
      default: "I'm FundMeUp's AI assistant. How can I help you today?"
    };

    res.status(200).json({
      success: true,
      response: fallbackResponses[userType] || fallbackResponses.default,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

/**
 * Get chat statistics
 * GET /api/chat/stats
 */
router.get('/stats', (req, res) => {
  res.status(200).json({
    success: true,
      data: {
        trainingSamples: trainingDataset.length,
        model: 'gemini-pro',
        provider: genAI ? 'Google Gemini' : 'Not configured',
        features: [
          'Context-aware responses',
          'Domain-specific training',
          'Multi-user type support',
          'Fallback handling'
        ]
      }
  });
});

module.exports = router;

