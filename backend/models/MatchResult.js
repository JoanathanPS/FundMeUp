const supabase = require('../config/supabase');

/**
 * Match Result Model - Supabase Operations
 */
class MatchResultModel {
  /**
   * Create a new match result
   */
  static async create(matchData) {
    try {
      const { data, error } = await supabase
        .from('match_results')
        .insert([{
          student_wallet: matchData.studentWallet,
          scholarship_id: matchData.scholarshipId,
          match_score: matchData.matchScore,
          reasoning: matchData.reasoning,
          criteria_met: matchData.criteriaMet
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating match result:', error);
      throw error;
    }
  }

  /**
   * Get match results by student wallet
   */
  static async findByStudentWallet(walletAddress) {
    try {
      const { data, error } = await supabase
        .from('match_results')
        .select('*')
        .eq('student_wallet', walletAddress)
        .order('match_score', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding match results by student:', error);
      throw error;
    }
  }

  /**
   * Get match results by scholarship ID
   */
  static async findByScholarshipId(scholarshipId) {
    try {
      const { data, error } = await supabase
        .from('match_results')
        .select('*')
        .eq('scholarship_id', scholarshipId)
        .order('match_score', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding match results by scholarship:', error);
      throw error;
    }
  }
}

module.exports = MatchResultModel;

