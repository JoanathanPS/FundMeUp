const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

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

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "I'm here to help! Could you tell me more about what you need?";

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
      model: 'llama-3.1-70b-versatile',
      provider: 'Groq',
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

