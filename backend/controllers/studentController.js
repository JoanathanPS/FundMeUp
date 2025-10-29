const Student = require('../models/Student');

/**
 * Get all students
 * GET /students
 */
const getAllStudents = async (req, res) => {
  try {
    const filters = {};
    if (req.query.field) filters.field = req.query.field;
    if (req.query.country) filters.country = req.query.country;
    if (req.query.verified !== undefined) filters.verifiedByInstitution = req.query.verified === 'true';

    const students = await Student.findAll(filters);
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    console.error('Error getting students:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get student by wallet address
 * GET /students/:wallet
 */
const getStudentByWallet = async (req, res) => {
  try {
    const { wallet } = req.params;
    const student = await Student.findByWallet(wallet.toLowerCase());

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error('Error getting student:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new student
 * POST /students
 */
const createStudent = async (req, res) => {
  try {
    const studentData = {
      walletAddress: req.body.walletAddress,
      name: req.body.name,
      email: req.body.email,
      institution: req.body.institution,
      course: req.body.course,
      yearOfStudy: req.body.yearOfStudy,
      gpa: req.body.gpa,
      bio: req.body.bio,
      dream: req.body.dream,
      field: req.body.field,
      country: req.body.country,
      introVideoCID: req.body.introVideoCID,
      verifiedByInstitution: req.body.verifiedByInstitution,
      institutionName: req.body.institutionName,
      profileImageCID: req.body.profileImageCID
    };

    const student = await Student.create(studentData);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update student
 * PUT /students/:wallet
 */
const updateStudent = async (req, res) => {
  try {
    const { wallet } = req.params;
    const student = await Student.findByWallet(wallet.toLowerCase());

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const updatedStudent = await Student.update(student.id, req.body);
    res.status(200).json({ success: true, data: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete student
 * DELETE /students/:wallet
 */
const deleteStudent = async (req, res) => {
  try {
    const { wallet } = req.params;
    const student = await Student.findByWallet(wallet.toLowerCase());

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await Student.delete(student.id);
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentByWallet,
  createStudent,
  updateStudent,
  deleteStudent
};

