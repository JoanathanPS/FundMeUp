const Proof = require('../models/Proof');
const Scholarship = require('../models/Scholarship');

/**
 * Get all proofs
 * GET /proofs
 */
const getAllProofs = async (req, res) => {
  try {
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
    const proofData = {
      studentWallet: req.body.studentWallet,
      scholarshipId: req.body.scholarshipId,
      milestoneId: req.body.milestoneId,
      proofText: req.body.proofText,
      mediaCID: req.body.mediaCID,
      status: 'pending'
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
