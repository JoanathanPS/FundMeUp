const express = require('express');
const router = express.Router();
const {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  fundScholarship,
  getScholarshipsByStudent
} = require('../controllers/scholarshipController');

// Get all scholarships
router.get('/', getAllScholarships);

// Get scholarship by ID
router.get('/:id', getScholarshipById);

// Get scholarships by student
router.get('/student/:wallet', getScholarshipsByStudent);

// Create scholarship
router.post('/', createScholarship);

// Fund scholarship
router.post('/:id/fund', fundScholarship);

module.exports = router;

