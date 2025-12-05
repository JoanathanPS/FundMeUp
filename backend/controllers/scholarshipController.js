const Scholarship = require('../models/Scholarship');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');
const supabase = require('../config/supabase');

/**
 * Get all scholarships
 * GET /scholarships
 */
const getAllScholarships = async (req, res) => {
  try {
    // Try Supabase first if configured
    if (supabase) {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return res.status(200).json({ success: true, data });
      }
    }

    // Fallback to MongoDB if Supabase fails
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
    const isDemo = req.body.is_demo || req.body.isDemo || false;
    const scholarshipData = {
      title: req.body.title,
      description: req.body.description,
      goal: req.body.goal || req.body.targetAmount || req.body.amount || 0,
      raised: req.body.raised || 0,
      field: req.body.field || 'General',
      country: req.body.country || 'Global',
      year: req.body.year || 1,
      student_wallet: req.body.studentWallet || req.body.student_wallet || '0xDemoStudent',
      institution_name: req.body.institutionName || req.body.institution_name || '',
      milestones: req.body.milestones || [],
      verified: req.body.verified || false,
      is_demo: isDemo,
      transaction_hash: req.body.transactionHash || req.body.transaction_hash
    };

    // Save to Supabase if configured
    if (supabase) {
      const { data, error } = await supabase
        .from('scholarships')
        .insert([scholarshipData])
        .select()
        .single();

      if (!error && data) {
        return res.status(201).json({ success: true, data });
      } else if (error) {
        console.error('Supabase error:', error);
        // Continue to fallback
      }
    }

    // Fallback to MongoDB
    const mongoData = {
      title: scholarshipData.title,
      description: scholarshipData.description,
      amount: scholarshipData.goal,
      studentWallet: scholarshipData.student_wallet,
      createdBy: 'system'
    };

    const student = await Student.findByWallet(mongoData.studentWallet);
    if (!student && !isDemo) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const scholarship = await Scholarship.create(mongoData);
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
    const { donorWallet, donorAddress, amount, txHash, transactionHash, is_demo, isDemo } = req.body;
    const isDemoMode = is_demo || isDemo || false;
    const donationAmount = parseFloat(amount) || 0;
    const txHashValue = txHash || transactionHash;

    // Update Supabase if configured
    if (supabase) {
      // Get current scholarship
      const { data: scholarship, error: fetchError } = await supabase
        .from('scholarships')
        .select('raised, goal')
        .eq('id', id)
        .single();

      if (!fetchError && scholarship) {
        const newRaised = (parseFloat(scholarship.raised) || 0) + donationAmount;

        // Update scholarship raised amount
        const { error: updateError } = await supabase
          .from('scholarships')
          .update({ raised: newRaised })
          .eq('id', id);

        if (!updateError) {
          // Create donation record
          const { data: donation, error: donationError } = await supabase
            .from('donations')
            .insert([{
              scholarship_id: id,
              amount: donationAmount,
              tx_hash: txHashValue,
              network: 'ethereum',
              is_demo: isDemoMode,
              created_at: new Date().toISOString()
            }])
            .select()
            .single();

          if (!donationError) {
            // Get updated scholarship
            const { data: updatedScholarship } = await supabase
              .from('scholarships')
              .select('*')
              .eq('id', id)
              .single();

            return res.status(200).json({ 
              success: true, 
              data: updatedScholarship,
              donation: donation
            });
          }
        }
      }
    }

    // Fallback to MongoDB
    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    await Scholarship.addFundedAmount(id, donationAmount);

    if (txHashValue) {
      await Transaction.create({
        scholarshipId: id,
        donorWallet: donorWallet || donorAddress,
        amount: donationAmount,
        txHash: txHashValue,
        status: 'pending'
      });
    }

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

