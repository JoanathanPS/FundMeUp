const Proof = require('../models/Proof');
const Scholarship = require('../models/Scholarship');
const supabase = require('../config/supabase');

/**
 * Get all proofs
 * GET /proofs
 */
const getAllProofs = async (req, res) => {
  try {
    // Try Supabase first if configured
    if (supabase) {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return res.status(200).json({ success: true, data });
      }
    }

    // Fallback to MongoDB
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    const proofs = await Proof.findAll(filters);
    res.status(200).json({ success: true, data: proofs });
  } catch (error) {
    console.error('Error getting proofs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get proof by ID
 * GET /proofs/:id
 */
const getProofById = async (req, res) => {
  try {
    const { id } = req.params;
    const proof = await Proof.findById(id);

    if (!proof) {
      return res.status(404).json({ success: false, message: 'Proof not found' });
    }

    res.status(200).json({ success: true, data: proof });
  } catch (error) {
    console.error('Error getting proof:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Submit a new proof
 * POST /proofs
 */
const submitProof = async (req, res) => {
  try {
    const isDemo = req.body.is_demo || req.body.isDemo || false;
    const riskScore = req.body.riskScore || Math.floor(Math.random() * 30) + 10;
    const aiConfidence = req.body.aiConfidence || Math.floor(Math.random() * 20) + 80;
    const verificationStatus = req.body.verificationStatus || (riskScore < 30 ? 'verified' : 'pending');

    // Save to Supabase if configured
    if (supabase) {
      // Find the milestone in the scholarship
      const { data: scholarship, error: scholarshipError } = await supabase
        .from('scholarships')
        .select('milestones')
        .eq('id', req.body.scholarshipId)
        .single();

      if (!scholarshipError && scholarship) {
        const milestones = Array.isArray(scholarship.milestones) ? scholarship.milestones : [];
        const milestoneIndex = milestones.findIndex((m: any) => m.id === req.body.milestoneId);
        
        if (milestoneIndex !== -1) {
          milestones[milestoneIndex] = {
            ...milestones[milestoneIndex],
            status: verificationStatus,
            evidence_url: req.body.mediaCID,
            achieved: verificationStatus === 'verified'
          };

          // Update scholarship milestones
          await supabase
            .from('scholarships')
            .update({ milestones: JSON.stringify(milestones) })
            .eq('id', req.body.scholarshipId);

          // Create milestone record
          const { data: milestone, error: milestoneError } = await supabase
            .from('milestones')
            .insert([{
              scholarship_id: req.body.scholarshipId,
              title: req.body.milestoneTitle || milestones[milestoneIndex].title,
              description: req.body.proofText,
              sequence: milestoneIndex + 1,
              achieved: verificationStatus === 'verified',
              evidence_url: req.body.mediaCID,
              is_demo: isDemo,
              created_at: new Date().toISOString()
            }])
            .select()
            .single();

          if (!milestoneError) {
            return res.status(201).json({ 
              success: true, 
              data: {
                ...milestone,
                riskScore,
                aiConfidence,
                verificationStatus
              }
            });
          }
        }
      }
    }

    // Fallback to MongoDB
    const proofData = {
      studentWallet: req.body.studentWallet,
      scholarshipId: req.body.scholarshipId,
      milestoneId: req.body.milestoneId,
      proofText: req.body.proofText,
      mediaCID: req.body.mediaCID,
      status: verificationStatus
    };

    const proof = await Proof.create(proofData);
    res.status(201).json({ success: true, data: proof });
  } catch (error) {
    console.error('Error submitting proof:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Verify a proof
 * POST /proofs/:id/verify
 */
const verifyProof = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verifiedBy, aiRiskScore, aiConfidence, aiReasoning } = req.body;

    const updateData = {
      status: status || 'verified',
      verifiedBy,
      verifiedAt: new Date().toISOString()
    };

    if (aiRiskScore !== undefined) updateData.aiRiskScore = aiRiskScore;
    if (aiConfidence !== undefined) updateData.aiConfidence = aiConfidence;
    if (aiReasoning) updateData.aiReasoning = aiReasoning;

    const proof = await Proof.update(id, updateData);
    res.status(200).json({ success: true, data: proof });
  } catch (error) {
    console.error('Error verifying proof:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get proofs by student
 * GET /proofs/student/:wallet
 */
const getProofsByStudent = async (req, res) => {
  try {
    const { wallet } = req.params;
    const proofs = await Proof.findByStudentWallet(wallet.toLowerCase());
    res.status(200).json({ success: true, data: proofs });
  } catch (error) {
    console.error('Error getting student proofs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProofs,
  getProofById,
  submitProof,
  verifyProof,
  getProofsByStudent
};
