const express = require('express');
const router = express.Router();
const {
  getAllProofs,
  getProofById,
  submitProof,
  verifyProof,
  getProofsByStudent
} = require('../controllers/proofController');

// Get all proofs
router.get('/', getAllProofs);

// Get proofs by student
router.get('/student/:wallet', getProofsByStudent);

// Get proof by ID
router.get('/:id', getProofById);

// Submit proof
router.post('/', submitProof);

// Verify proof
router.post('/:id/verify', verifyProof);

module.exports = router;

