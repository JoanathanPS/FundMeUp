const express = require('express');
const router = express.Router();
const Encouragement = require('../models/Encouragement');

/**
 * Encouragement Routes
 * Community engagement messages from donors to students
 */

// Get encouragements for a student
router.get('/:studentWallet', async (req, res) => {
  try {
    const { studentWallet } = req.params;
    const encouragements = await Encouragement.getAll();
    
    const filtered = encouragements.filter(e => 
      e.studentWallet && e.studentWallet.toLowerCase() === studentWallet.toLowerCase()
    );
    
    res.json({ success: true, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send encouragement
router.post('/', async (req, res) => {
  try {
    const encouragement = await Encouragement.create(req.body);
    res.json({ success: true, data: encouragement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
