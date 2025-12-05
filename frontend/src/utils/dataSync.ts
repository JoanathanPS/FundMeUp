/**
 * Data Sync Utility
 * Syncs localStorage data to Supabase on actions
 */

import { scholarshipStorage } from './scholarshipStorage'
import { donationStorage } from './donationStorage'
import { proofStorage } from './proofStorage'
import { scholarshipAPI, proofAPI } from '@/services/api'

/**
 * Sync all local data to Supabase
 */
export async function syncAllToSupabase() {
  try {
    // Sync scholarships
    const scholarships = scholarshipStorage.getAllScholarships()
    for (const scholarship of scholarships) {
      if (scholarship.isDemo) {
        try {
          await scholarshipAPI.create({
            ...scholarship,
            is_demo: true
          })
        } catch (error) {
          console.warn('Failed to sync scholarship:', scholarship.id, error)
        }
      }
    }

    // Sync proofs
    const proofs = proofStorage.getAllProofs()
    for (const proof of proofs) {
      if (proof.isDemo) {
        try {
          await proofAPI.submit({
            scholarshipId: proof.scholarshipId,
            milestoneId: proof.milestoneId,
            milestoneTitle: proof.milestoneTitle,
            proofText: proof.description || '',
            mediaCID: proof.cid,
            is_demo: true
          })
        } catch (error) {
          console.warn('Failed to sync proof:', proof.id, error)
        }
      }
    }

    // Donations are synced individually when created
    console.log('✅ Data sync completed')
  } catch (error) {
    console.error('Error syncing data:', error)
  }
}

/**
 * Batch sync donations for a scholarship
 */
export async function syncDonationsToSupabase(scholarshipId: string) {
  try {
    const donations = donationStorage.getDonationsByStudent(scholarshipId)
    for (const donation of donations) {
      try {
        await scholarshipAPI.fund(scholarshipId, {
          amount: donation.amount,
          transactionHash: donation.transactionHash,
          is_demo: true
        })
      } catch (error) {
        console.warn('Failed to sync donation:', donation.id, error)
      }
    }
  } catch (error) {
    console.error('Error syncing donations:', error)
  }
}

