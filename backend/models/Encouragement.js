const supabase = require('../config/supabase');

/**
 * Encouragement Model - Supabase Operations
 */
class EncouragementModel {
  /**
   * Create a new encouragement message
   */
  static async create(encouragementData) {
    try {
      const { data, error } = await supabase
        .from('encouragements')
        .insert([{
          student_wallet: encouragementData.studentWallet,
          donor_wallet: encouragementData.donorWallet,
          message: encouragementData.message,
          scholarship_id: encouragementData.scholarshipId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating encouragement:', error);
      throw error;
    }
  }

  /**
   * Get encouragements by student wallet
   */
  static async findByStudentWallet(walletAddress) {
    try {
      const { data, error } = await supabase
        .from('encouragements')
        .select('*')
        .eq('student_wallet', walletAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding encouragements by student:', error);
      throw error;
    }
  }

  /**
   * Get encouragements by donor wallet
   */
  static async findByDonorWallet(walletAddress) {
    try {
      const { data, error } = await supabase
        .from('encouragements')
        .select('*')
        .eq('donor_wallet', walletAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding encouragements by donor:', error);
      throw error;
    }
  }

  /**
   * Get all encouragements
   */
  static async findAll() {
    try {
      const { data, error } = await supabase
        .from('encouragements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding encouragements:', error);
      throw error;
    }
  }
}

module.exports = EncouragementModel;

