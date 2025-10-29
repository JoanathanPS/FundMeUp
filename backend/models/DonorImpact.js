const supabase = require('../config/supabase');

/**
 * Donor Impact Model - Supabase Operations
 */
class DonorImpactModel {
  /**
   * Create or update donor impact
   */
  static async upsert(walletAddress, impactData) {
    try {
      const { data, error } = await supabase
        .from('donor_impacts')
        .upsert({
          donor_wallet: walletAddress,
          total_donated: impactData.totalDonated || 0,
          scholarships_funded: impactData.scholarshipsFunded || 0,
          students_helped: impactData.studentsHelped || 0,
          impact_score: impactData.impactScore || 0,
          last_donation_at: impactData.lastDonationAt,
          updated_at: new Date().toISOString()
        }, { onConflict: 'donor_wallet' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upserting donor impact:', error);
      throw error;
    }
  }

  /**
   * Get donor impact by wallet
   */
  static async findByWallet(walletAddress) {
    try {
      const { data, error } = await supabase
        .from('donor_impacts')
        .select('*')
        .eq('donor_wallet', walletAddress)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error finding donor impact:', error);
      throw error;
    }
  }

  /**
   * Get top donors by impact score
   */
  static async getTopDonors(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('donor_impacts')
        .select('*')
        .order('impact_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding top donors:', error);
      throw error;
    }
  }
}

module.exports = DonorImpactModel;

