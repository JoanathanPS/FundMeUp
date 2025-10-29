const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentByWallet,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

// Get all students
router.get('/', getAllStudents);

// Get student by wallet
router.get('/:wallet', getStudentByWallet);

// Create student
router.post('/', createStudent);

// Update student
router.put('/:wallet', updateStudent);

// Delete student
router.delete('/:wallet', deleteStudent);

module.exports = router;

