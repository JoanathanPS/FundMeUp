const supabase = require('../config/supabase');

/**
 * Student Model - Supabase Operations
 */
class StudentModel {
  /**
   * Create a new student
   */
  static async create(studentData) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          wallet_address: studentData.walletAddress,
          name: studentData.name,
          email: studentData.email,
          institution: studentData.institution,
          course: studentData.course,
          year_of_study: studentData.yearOfStudy,
          gpa: studentData.gpa,
          bio: studentData.bio,
          dream: studentData.dream,
          field: studentData.field,
          country: studentData.country,
          intro_video_cid: studentData.introVideoCID,
          verified_by_institution: studentData.verifiedByInstitution || false,
          institution_name: studentData.institutionName,
          profile_image_cid: studentData.profileImageCID,
          is_email_verified: studentData.isEmailVerified || false,
          email_verification_date: studentData.emailVerificationDate
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  /**
   * Get student by wallet address
   */
  static async findByWallet(walletAddress) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      console.error('Error finding student by wallet:', error);
      throw error;
    }
  }

  /**
   * Get student by ID
   */
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error finding student by ID:', error);
      throw error;
    }
  }

  /**
   * Get student by email
   */
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error finding student by email:', error);
      throw error;
    }
  }

  /**
   * Get all students with optional filters
   */
  static async findAll(filters = {}) {
    try {
      let query = supabase.from('students').select('*');

      if (filters.field) {
        query = query.eq('field', filters.field);
      }
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      if (filters.verifiedByInstitution !== undefined) {
        query = query.eq('verified_by_institution', filters.verifiedByInstitution);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding students:', error);
      throw error;
    }
  }

  /**
   * Update student
   */
  static async update(id, updateData) {
    try {
      const updateObj = {};
      
      if (updateData.name) updateObj.name = updateData.name;
      if (updateData.email) updateObj.email = updateData.email;
      if (updateData.institution) updateObj.institution = updateData.institution;
      if (updateData.course) updateObj.course = updateData.course;
      if (updateData.yearOfStudy) updateObj.year_of_study = updateData.yearOfStudy;
      if (updateData.gpa) updateObj.gpa = updateData.gpa;
      if (updateData.bio) updateObj.bio = updateData.bio;
      if (updateData.dream) updateObj.dream = updateData.dream;
      if (updateData.field) updateObj.field = updateData.field;
      if (updateData.country) updateObj.country = updateData.country;
      if (updateData.introVideoCID) updateObj.intro_video_cid = updateData.introVideoCID;
      if (updateData.verifiedByInstitution !== undefined) updateObj.verified_by_institution = updateData.verifiedByInstitution;
      if (updateData.institutionName) updateObj.institution_name = updateData.institutionName;
      if (updateData.profileImageCID) updateObj.profile_image_cid = updateData.profileImageCID;
      if (updateData.isEmailVerified !== undefined) updateObj.is_email_verified = updateData.isEmailVerified;
      if (updateData.emailVerificationDate) updateObj.email_verification_date = updateData.emailVerificationDate;

      updateObj.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('students')
        .update(updateObj)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  /**
   * Delete student
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }
}

module.exports = StudentModel;

