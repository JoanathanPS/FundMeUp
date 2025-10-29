const supabase = require('../config/supabase');

/**
 * Scholarship Model - Supabase Operations
 */
class ScholarshipModel {
  /**
   * Create a new scholarship
   */
  static async create(scholarshipData) {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .insert([{
          title: scholarshipData.title,
          description: scholarshipData.description,
          amount: scholarshipData.amount,
          funded_amount: scholarshipData.fundedAmount || 0,
          student_wallet: scholarshipData.studentWallet,
          status: scholarshipData.status || 'active',
          created_by: scholarshipData.createdBy
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating scholarship:', error);
      throw error;
    }
  }

  /**
   * Get scholarship by ID
   */
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error finding scholarship by ID:', error);
      throw error;
    }
  }

  /**
   * Get scholarships by student wallet
   */
  static async findByStudentWallet(walletAddress) {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('student_wallet', walletAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding scholarships by student:', error);
      throw error;
    }
  }

  /**
   * Get all scholarships
   */
  static async findAll(filters = {}) {
    try {
      let query = supabase.from('scholarships').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding scholarships:', error);
      throw error;
    }
  }

  /**
   * Update scholarship
   */
  static async update(id, updateData) {
    try {
      const updateObj = {};

      if (updateData.title) updateObj.title = updateData.title;
      if (updateData.description) updateObj.description = updateData.description;
      if (updateData.amount) updateObj.amount = updateData.amount;
      if (updateData.fundedAmount !== undefined) updateObj.funded_amount = updateData.fundedAmount;
      if (updateData.status) updateObj.status = updateData.status;

      updateObj.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('scholarships')
        .update(updateObj)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating scholarship:', error);
      throw error;
    }
  }

  /**
   * Add to funded amount
   */
  static async addFundedAmount(id, amount) {
    try {
      // First get current amount
      const { data: current, error: fetchError } = await supabase
        .from('scholarships')
        .select('funded_amount')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const newAmount = parseFloat(current.funded_amount) + parseFloat(amount);

      const { data, error } = await supabase
        .from('scholarships')
        .update({ funded_amount: newAmount, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding funded amount:', error);
      throw error;
    }
  }

  /**
   * Delete scholarship
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('scholarships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting scholarship:', error);
      throw error;
    }
  }
}

module.exports = ScholarshipModel;

