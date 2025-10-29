const supabase = require('../config/supabase');

/**
 * Proof Model - Supabase Operations
 */
class ProofModel {
  /**
   * Create a new proof
   */
  static async create(proofData) {
    try {
      const { data, error } = await supabase
        .from('proofs')
        .insert([{
          student_wallet: proofData.studentWallet,
          scholarship_id: proofData.scholarshipId,
          milestone_id: proofData.milestoneId,
          proof_text: proofData.proofText,
          media_cid: proofData.mediaCID,
          ai_risk_score: proofData.aiRiskScore,
          ai_confidence: proofData.aiConfidence,
          ai_reasoning: proofData.aiReasoning,
          status: proofData.status || 'pending',
          verified_by: proofData.verifiedBy,
          verified_at: proofData.verifiedAt
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating proof:', error);
      throw error;
    }
  }

  /**
   * Get proof by ID
   */
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('proofs')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error finding proof by ID:', error);
      throw error;
    }
  }

  /**
   * Get proofs by student wallet
   */
  static async findByStudentWallet(walletAddress) {
    try {
      const { data, error } = await supabase
        .from('proofs')
        .select('*')
        .eq('student_wallet', walletAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding proofs by student:', error);
      throw error;
    }
  }

  /**
   * Get proofs by scholarship ID
   */
  static async findByScholarshipId(scholarshipId) {
    try {
      const { data, error } = await supabase
        .from('proofs')
        .select('*')
        .eq('scholarship_id', scholarshipId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding proofs by scholarship:', error);
      throw error;
    }
  }

  /**
   * Get all proofs
   */
  static async findAll(filters = {}) {
    try {
      let query = supabase.from('proofs').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding proofs:', error);
      throw error;
    }
  }

  /**
   * Update proof
   */
  static async update(id, updateData) {
    try {
      const updateObj = {};

      if (updateData.proofText) updateObj.proof_text = updateData.proofText;
      if (updateData.mediaCID) updateObj.media_cid = updateData.mediaCID;
      if (updateData.aiRiskScore !== undefined) updateObj.ai_risk_score = updateData.aiRiskScore;
      if (updateData.aiConfidence !== undefined) updateObj.ai_confidence = updateData.aiConfidence;
      if (updateData.aiReasoning) updateObj.ai_reasoning = updateData.aiReasoning;
      if (updateData.status) updateObj.status = updateData.status;
      if (updateData.verifiedBy) updateObj.verified_by = updateData.verifiedBy;
      if (updateData.verifiedAt) updateObj.verified_at = updateData.verifiedAt;

      updateObj.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('proofs')
        .update(updateObj)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating proof:', error);
      throw error;
    }
  }

  /**
   * Delete proof
   */
  static async delete(id) {
    try {
      const { error } = await supabase
        .from('proofs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting proof:', error);
      throw error;
    }
  }
}

module.exports = ProofModel;

