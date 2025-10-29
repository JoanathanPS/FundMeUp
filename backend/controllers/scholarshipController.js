const Scholarship = require('../models/Scholarship');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');

/**
 * Get all scholarships
 * GET /scholarships
 */
const getAllScholarships = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;

    const scholarships = await Scholarship.findAll(filters);
    res.status(200).json({ success: true, data: scholarships });
  } catch (error) {
    console.error('Error getting scholarships:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get scholarship by ID
 * GET /scholarships/:id
 */
const getScholarshipById = async (req, res) => {
  try {
    const { id } = req.params;
    const scholarship = await Scholarship.findById(id);

    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    console.error('Error getting scholarship:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new scholarship
 * POST /scholarships
 */
const createScholarship = async (req, res) => {
  try {
    const scholarshipData = {
      title: req.body.title,
      description: req.body.description,
      amount: req.body.amount,
      studentWallet: req.body.studentWallet,
      createdBy: req.body.createdBy || 'system'
    };

    // Verify student exists
    const student = await Student.findByWallet(scholarshipData.studentWallet);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const scholarship = await Scholarship.create(scholarshipData);
    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Fund a scholarship
 * POST /scholarships/:id/fund
 */
const fundScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    const { donorWallet, amount, txHash } = req.body;

    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    // Add to funded amount
    await Scholarship.addFundedAmount(id, amount);

    // Create transaction record
    if (txHash) {
      await Transaction.create({
        scholarshipId: id,
        donorWallet,
        amount,
        txHash,
        status: 'pending'
      });
    }

    // Update scholarship
    const updatedScholarship = await Scholarship.findById(id);
    res.status(200).json({ success: true, data: updatedScholarship });
  } catch (error) {
    console.error('Error funding scholarship:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get scholarships by student wallet
 * GET /scholarships/student/:wallet
 */
const getScholarshipsByStudent = async (req, res) => {
  try {
    const { wallet } = req.params;
    const scholarships = await Scholarship.findByStudentWallet(wallet.toLowerCase());
    res.status(200).json({ success: true, data: scholarships });
  } catch (error) {
    console.error('Error getting student scholarships:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  fundScholarship,
  getScholarshipsByStudent
};

