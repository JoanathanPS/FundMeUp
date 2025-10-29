const Groq = require('groq-sdk');

/**
 * Enhanced AI Service with Multi-Provider Support
 * Providers: Groq (Llama), Google Gemini, OpenAI
 * Focus: Detailed verification analysis with reasoning
 */

class AIServiceV2 {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'groq'; // Default to Groq
    this.groqClient = null;
    this.initialized = false;
  }

  /**
   * Initialize AI service based on provider
   */
  async initialize() {
    try {
      if (this.provider === 'groq') {
        if (!process.env.GROQ_API_KEY) {
          console.warn('⚠️  Groq API key not configured. Using fallback responses.');
          return;
        }
        
        this.groqClient = new Groq({
          apiKey: process.env.GROQ_API_KEY
        });
        
        this.initialized = true;
        console.log('✅ AI Service V2 initialized with Groq (Llama 3.1)');
      }
      // Add other providers here if needed
    } catch (error) {
      console.error('⚠️  AI Service V2 initialization failed:', error.message);
    }
  }

  /**
   * Analyze proof document with detailed verification
   * @param {Object} proofData - Proof submission data
   * @returns {Promise<Object>} Detailed analysis with reasoning
   */
  async analyzeProof(proofData) {
    try {
      const { extractedText, metadata, fileType, studentInfo, milestoneInfo } = proofData;

      if (!this.initialized) {
        return this._fallbackProofAnalysis(proofData);
      }

      const prompt = `You are an expert document verification AI for an education scholarship platform. Analyze this milestone proof submission:

STUDENT INFORMATION:
- Name: ${studentInfo?.name || 'Unknown'}
- Field: ${studentInfo?.field || 'Unknown'}
- Institution: ${studentInfo?.institution || 'Unknown'}

MILESTONE:
- Title: ${milestoneInfo?.title || 'Unknown'}
- Description: ${milestoneInfo?.description || 'N/A'}

DOCUMENT DETAILS:
- Type: ${fileType}
- Metadata: ${JSON.stringify(metadata || {})}
- Extracted Text (first 800 chars): ${extractedText?.substring(0, 800) || 'No text extracted'}

TASK:
Analyze authenticity and provide:
1. Risk Score (0-100, where 0 is legitimate, 100 is fraudulent)
2. Confidence Level (0-100%)
3. Detailed Reasoning (2-3 sentences explaining your assessment)
4. Specific Flags (list any suspicious elements)
5. Recommendations (what action should be taken)
6. Document Quality Assessment

Respond ONLY with valid JSON in this exact format:
{
  "riskScore": <number 0-100>,
  "confidence": <number 0-100>,
  "reasoning": "<detailed explanation>",
  "flags": ["<flag1>", "<flag2>"],
  "recommendations": ["<action1>", "<action2>"],
  "documentAnalysis": {
    "quality": "<high/medium/low>",
    "authenticity": "<verified/suspicious/unclear>",
    "completeness": "<complete/partial/insufficient>"
  },
  "verdict": "<approve/review/reject>"
}`;

      const completion = await this.groqClient.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a document verification expert. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-70b-versatile', // High-quality model
        temperature: 0.3, // Lower temperature for consistent analysis
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content;
      
      if (!responseText) {
        throw new Error('No response from AI');
      }

      const analysis = JSON.parse(responseText);
      
      // Add metadata
      analysis.aiModel = 'llama-3.1-70b';
      analysis.provider = 'groq';
      analysis.analyzedAt = new Date().toISOString();
      
      return analysis;
      
    } catch (error) {
      console.error('AI Proof Analysis Error:', error);
      return this._fallbackProofAnalysis(proofData);
    }
  }

  /**
   * Verify student eligibility with detailed assessment
   * @param {Object} studentProfile - Student profile data
   * @returns {Promise<Object>} Eligibility assessment
   */
  async verifyEligibility(studentProfile) {
    try {
      const { name, dream, field, year, institution, grades, country, walletAddress } = studentProfile;

      if (!this.initialized) {
        return this._fallbackEligibilityCheck(studentProfile);
      }

      const prompt = `You are an education eligibility verification AI. Assess this student's eligibility for micro-scholarships:

STUDENT PROFILE:
- Name: ${name}
- Dream/Goal: ${dream}
- Field of Study: ${field}
- Academic Year: ${year}
- Institution: ${institution || 'Not provided'}
- Academic Performance: ${grades || 'Not provided'}
- Country: ${country}

ASSESSMENT CRITERIA:
1. Clarity and feasibility of dream/goal
2. Alignment between field and goal
3. Academic standing
4. Potential for impact
5. Need for funding

Respond ONLY with valid JSON in this exact format:
{
  "eligible": <true/false>,
  "eligibilityScore": <number 0-100>,
  "reasoning": "<detailed explanation>",
  "strengths": ["<strength1>", "<strength2>"],
  "concerns": ["<concern1>", "<concern2>"],
  "recommendations": ["<recommendation1>"],
  "suggestedAmount": <number in INR>,
  "verdict": "<approve/review/reject>"
}`;

      const completion = await this.groqClient.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an education funding expert. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.4,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content;
      const analysis = JSON.parse(responseText);
      
      analysis.aiModel = 'llama-3.1-70b';
      analysis.provider = 'groq';
      analysis.assessedAt = new Date().toISOString();
      
      return analysis;
      
    } catch (error) {
      console.error('AI Eligibility Verification Error:', error);
      return this._fallbackEligibilityCheck(studentProfile);
    }
  }

  /**
   * Generate personalized encouragement message
   * @param {Object} context - Message context
   * @returns {Promise<Object>} Generated message
   */
  async generateEncouragementMessage(context) {
    try {
      const { studentName, donorName, milestoneTitle, studentField } = context;

      if (!this.initialized) {
        return this._fallbackMessageGeneration(context);
      }

      const prompt = `Generate a warm, encouraging message from donor "${donorName}" to student "${studentName}" who is studying ${studentField}. The student just completed milestone: "${milestoneTitle}".

Requirements:
- Keep it personal and genuine
- Maximum 100 words
- Include motivation and support
- Acknowledge their specific achievement

Respond with JSON:
{
  "message": "<the encouraging message>",
  "tone": "<warm/supportive/celebratory>"
}`;

      const completion = await this.groqClient.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a supportive mentor crafting encouraging messages for students.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.7, // Higher for creative messages
        max_tokens: 300,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content;
      const result = JSON.parse(responseText);
      
      return {
        success: true,
        message: result.message,
        tone: result.tone,
        generatedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('AI Message Generation Error:', error);
      return this._fallbackMessageGeneration(context);
    }
  }

  /**
   * Analyze regional data for verification
   * @param {Object} data - Regional verification data
   * @returns {Promise<Object>} Regional analysis
   */
  async analyzeRegionalData(data) {
    try {
      const { studentInfo, institutionInfo, location } = data;

      if (!this.initialized) {
        return this._fallbackRegionalAnalysis(data);
      }

      const prompt = `Verify institutional and regional data:

STUDENT: ${studentInfo?.name} from ${location}
INSTITUTION: ${institutionInfo?.name}
TYPE: ${institutionInfo?.type}

Assess credibility and provide verification confidence.

Respond with JSON:
{
  "verified": <true/false>,
  "confidence": <0-100>,
  "reasoning": "<explanation>",
  "flags": []
}`;

      const completion = await this.groqClient.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a regional verification expert.' },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.2,
        max_tokens: 400,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content;
      return JSON.parse(responseText);
      
    } catch (error) {
      console.error('Regional Analysis Error:', error);
      return this._fallbackRegionalAnalysis(data);
    }
  }

  // ========== FALLBACK METHODS ==========

  _fallbackProofAnalysis(proofData) {
    const { extractedText, fileType } = proofData;
    
    let riskScore = 15;
    const flags = [];
    const recommendations = [];

    if (!extractedText || extractedText.length < 100) {
      riskScore += 25;
      flags.push('Insufficient text content in document');
      recommendations.push('Request clearer documentation');
    }

    if (!['pdf', 'image/jpeg', 'image/png'].includes(fileType?.toLowerCase())) {
      riskScore += 10;
      flags.push('Unusual file format');
    }

    const verdict = riskScore < 30 ? 'approve' : riskScore < 60 ? 'review' : 'reject';

    return {
      riskScore,
      confidence: 70,
      reasoning: 'Automated analysis using fallback heuristics. Manual review recommended for final decision.',
      flags: flags.length > 0 ? flags : ['No major red flags detected'],
      recommendations: recommendations.length > 0 ? recommendations : ['Document appears acceptable', 'Proceed with verification'],
      documentAnalysis: {
        quality: riskScore < 30 ? 'high' : 'medium',
        authenticity: riskScore < 30 ? 'verified' : 'unclear',
        completeness: extractedText?.length > 100 ? 'complete' : 'partial'
      },
      verdict,
      fallback: true,
      aiModel: 'rule-based-fallback',
      analyzedAt: new Date().toISOString()
    };
  }

  _fallbackEligibilityCheck(studentProfile) {
    const { dream, field, year, grades } = studentProfile;
    
    let score = 50; // Base score
    const strengths = [];
    const concerns = [];

    if (dream && dream.length > 50) {
      score += 15;
      strengths.push('Clear and detailed educational goal');
    }

    if (field && ['STEM', 'Engineering', 'Medicine', 'Computer Science'].some(f => field.includes(f))) {
      score += 10;
      strengths.push('High-demand field of study');
    }

    if (year && year >= 2) {
      score += 10;
      strengths.push('Progressed beyond first year');
    } else {
      concerns.push('Early in academic journey');
    }

    const eligible = score >= 60;
    const verdict = score >= 75 ? 'approve' : score >= 60 ? 'review' : 'reject';

    return {
      eligible,
      eligibilityScore: score,
      reasoning: `Based on profile analysis: ${strengths.join(', ')}. ${concerns.length > 0 ? 'Areas of concern: ' + concerns.join(', ') : 'Strong candidate overall.'}`,
      strengths: strengths.length > 0 ? strengths : ['Candidate shows potential'],
      concerns: concerns.length > 0 ? concerns : ['No major concerns identified'],
      recommendations: eligible ? ['Approve for funding', 'Set milestone-based disbursement'] : ['Request additional information', 'Consider reapplication later'],
      suggestedAmount: eligible ? Math.min(50000, 10000 + (score * 500)) : 0,
      verdict,
      fallback: true,
      aiModel: 'rule-based-fallback',
      assessedAt: new Date().toISOString()
    };
  }

  _fallbackMessageGeneration(context) {
    const { studentName, donorName, milestoneTitle } = context;
    
    const messages = [
      `Congratulations ${studentName}! Your completion of "${milestoneTitle}" is inspiring. Keep pushing forward - your dedication is making a real difference. We're proud to support your journey! - ${donorName}`,
      `${studentName}, your achievement in "${milestoneTitle}" shows true commitment. Your hard work is paving the way for a brighter future. Keep going strong! - ${donorName}`,
      `Well done ${studentName}! Completing "${milestoneTitle}" is a significant milestone. Your perseverance is remarkable. Wishing you continued success! - ${donorName}`
    ];

    return {
      success: true,
      message: messages[Math.floor(Math.random() * messages.length)],
      tone: 'supportive',
      fallback: true,
      generatedAt: new Date().toISOString()
    };
  }

  _fallbackRegionalAnalysis(data) {
    return {
      verified: true,
      confidence: 65,
      reasoning: 'Fallback verification - manual review recommended',
      flags: [],
      fallback: true
    };
  }
}

// Export singleton
const aiServiceV2 = new AIServiceV2();
module.exports = aiServiceV2;

