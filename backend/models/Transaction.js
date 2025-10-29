const supabase = require('../config/supabase');

/**
 * Transaction Model - Supabase Operations
 */
class TransactionModel {
  /**
   * Create a new transaction
   */
  static async create(transactionData) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          scholarship_id: transactionData.scholarshipId,
          donor_wallet: transactionData.donorWallet,
          amount: transactionData.amount,
          tx_hash: transactionData.txHash,
          status: transactionData.status || 'pending',
          block_number: transactionData.blockNumber,
          confirmed_at: transactionData.confirmedAt
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction by ID
   */
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error finding transaction by ID:', error);
      throw error;
    }
  }

  /**
   * Get transaction by tx hash
   */
  static async findByTxHash(txHash) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('tx_hash', txHash)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error finding transaction by hash:', error);
      throw error;
    }
  }

  /**
   * Get transactions by donor wallet
   */
  static async findByDonorWallet(walletAddress) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('donor_wallet', walletAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding transactions by donor:', error);
      throw error;
    }
  }

  /**
   * Get transactions by scholarship ID
   */
  static async findByScholarshipId(scholarshipId) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('scholarship_id', scholarshipId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding transactions by scholarship:', error);
      throw error;
    }
  }

  /**
   * Update transaction status
   */
  static async updateStatus(id, status, blockNumber = null) {
    try {
      const updateObj = { status, updated_at: new Date().toISOString() };
      
      if (blockNumber) {
        updateObj.block_number = blockNumber;
        updateObj.confirmed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('transactions')
        .update(updateObj)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }
}

module.exports = TransactionModel;

