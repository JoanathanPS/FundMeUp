const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;

    let query = require('../config/supabase').from('transactions').select('*');
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get transactions by student
router.get('/student/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    
    // Get transactions for scholarships owned by student
    const scholarship = require('../models/Scholarship');
    const scholarships = await scholarship.findByStudentWallet(wallet);
    const scholarshipIds = scholarships.map(s => s.id);

    if (scholarshipIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const supabase = require('../config/supabase');
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .in('scholarship_id', scholarshipIds)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error getting student transactions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get transactions by wallet
router.get('/wallet/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    const transactions = await Transaction.findByDonorWallet(wallet.toLowerCase());
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error getting wallet transactions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

