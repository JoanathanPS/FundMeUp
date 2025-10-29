const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');
const DonorImpact = require('../models/DonorImpact');
const Scholarship = require('../models/Scholarship');

/**
 * Analytics Routes for FundMeUp ETHIndia
 * Provides: Global stats, donor metrics, heatmap data
 */

/**
 * @route   GET /api/analytics/global
 * @desc    Get global platform statistics
 * @access  Public
 */
router.get('/global', async (req, res) => {
  try {
    const [
      totalStudents,
      verifiedStudents,
      totalTransactions,
      totalDonors
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ verificationStatus: 'verified' }),
      Transaction.countDocuments({ status: 'completed' }),
      DonorImpact.countDocuments()
    ]);

    // Calculate total funds raised
    const transactions = await Transaction.find({ status: 'completed' });
    const totalFundsRaised = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    // Calculate success rate (verified milestones vs total milestones)
    const students = await Student.find({});
    let totalMilestones = 0;
    let verifiedMilestones = 0;

    students.forEach(student => {
      if (student.milestones && Array.isArray(student.milestones)) {
        totalMilestones += student.milestones.length;
        verifiedMilestones += student.milestones.filter(m => m.status === 'verified').length;
      }
    });

    const successRate = totalMilestones > 0 ? ((verifiedMilestones / totalMilestones) * 100).toFixed(1) : 0;

    // Average funding per student
    const avgFundingPerStudent = totalStudents > 0 ? (totalFundsRaised / totalStudents).toFixed(0) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        verifiedStudents,
        totalDonors,
        totalFundsRaised, // in INR or wei
        totalTransactions,
        totalMilestones,
        verifiedMilestones,
        successRate: parseFloat(successRate),
        avgFundingPerStudent: parseFloat(avgFundingPerStudent),
        currency: 'INR',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Global Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching global analytics',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analytics/donor/:wallet
 * @desc    Get donor-specific impact metrics
 * @access  Public
 */
router.get('/donor/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    const donorWallet = wallet.toLowerCase();

    // Get donor impact record
    let donorImpact = await DonorImpact.findOne({ donorWallet });

    if (!donorImpact) {
      // Create default if not exists
      donorImpact = {
        donorWallet,
        totalDonated: 0,
        studentsSupported: 0,
        impactScore: 0,
        badges: [],
        donationHistory: []
      };
    }

    // Get donor's transactions
    const transactions = await Transaction.find({ 
      donor: donorWallet,
      status: 'completed'
    }).populate('student', 'name field institution');

    // Get students funded by this donor
    const studentWallets = [...new Set(transactions.map(tx => tx.student))];
    const studentsFunded = await Student.find({
      walletAddress: { $in: studentWallets }
    }).select('name field institution milestones fundsRaised');

    // Calculate impact metrics
    const totalMilestones = studentsFunded.reduce((sum, s) => 
      sum + (s.milestones?.length || 0), 0
    );
    
    const completedMilestones = studentsFunded.reduce((sum, s) => 
      sum + (s.milestones?.filter(m => m.status === 'verified').length || 0), 0
    );

    res.status(200).json({
      success: true,
      data: {
        donorWallet,
        donorName: donorImpact.donorName || 'Anonymous Donor',
        totalDonated: donorImpact.totalDonated || 0,
        studentsSupported: studentsFunded.length,
        impactScore: donorImpact.impactScore || 0,
        badges: donorImpact.badges || [],
        studentsFunded: studentsFunded.map(s => ({
          name: s.name,
          field: s.field,
          institution: s.institution,
          milestonesCompleted: s.milestones?.filter(m => m.status === 'verified').length || 0,
          totalMilestones: s.milestones?.length || 0,
          fundsRaised: s.fundsRaised || 0
        })),
        totalMilestones,
        completedMilestones,
        successRate: totalMilestones > 0 ? ((completedMilestones / totalMilestones) * 100).toFixed(1) : 0,
        recentTransactions: transactions.slice(0, 5).map(tx => ({
          student: tx.student?.name || 'Unknown',
          amount: tx.amount,
          timestamp: tx.timestamp,
          txHash: tx.txHash
        }))
      }
    });

  } catch (error) {
    console.error('Donor Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching donor analytics',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analytics/heatmap
 * @desc    Get geographic distribution of funding (mock data for demo)
 * @access  Public
 */
router.get('/heatmap', async (req, res) => {
  try {
    const students = await Student.find({}).select('country institution fundsRaised verificationStatus');

    // Group by country
    const countryData = students.reduce((acc, student) => {
      const country = student.country || 'Unknown';
      if (!acc[country]) {
        acc[country] = {
          country,
          students: 0,
          verified: 0,
          totalFunds: 0,
          institutions: new Set()
        };
      }
      acc[country].students++;
      if (student.verificationStatus === 'verified') acc[country].verified++;
      acc[country].totalFunds += student.fundsRaised || 0;
      if (student.institution) acc[country].institutions.add(student.institution);
      return acc;
    }, {});

    // Convert to array and add coordinates (mock for demo)
    const indianStates = {
      'India': { lat: 20.5937, lng: 78.9629, cities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'] }
    };

    const heatmapData = Object.values(countryData).map(data => ({
      country: data.country,
      students: data.students,
      verified: data.verified,
      totalFunds: data.totalFunds,
      institutions: data.institutions.size,
      coordinates: indianStates[data.country] || { lat: 0, lng: 0 }
    }));

    res.status(200).json({
      success: true,
      data: heatmapData,
      total: heatmapData.length
    });

  } catch (error) {
    console.error('Heatmap Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating heatmap data',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analytics/trends
 * @desc    Get funding and verification trends over time
 * @access  Public
 */
router.get('/trends', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const transactions = await Transaction.find({
      timestamp: { $gte: startDate },
      status: 'completed'
    }).sort({ timestamp: 1 });

    // Group by day
    const dailyData = transactions.reduce((acc, tx) => {
      const date = tx.timestamp.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, amount: 0, count: 0 };
      }
      acc[date].amount += tx.amount || 0;
      acc[date].count++;
      return acc;
    }, {});

    const trendData = Object.values(dailyData).map(day => ({
      date: day.date,
      totalFunded: day.amount,
      transactions: day.count
    }));

    res.status(200).json({
      success: true,
      period: `${daysAgo} days`,
      data: trendData
    });

  } catch (error) {
    console.error('Trends Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trends',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analytics/leaderboard
 * @desc    Get top donors and top students
 * @access  Public
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'donors', limit = 10 } = req.query;

    if (type === 'donors') {
      const topDonors = await DonorImpact.find({})
        .sort({ totalDonated: -1 })
        .limit(parseInt(limit));

      res.status(200).json({
        success: true,
        type: 'donors',
        data: topDonors.map((donor, index) => ({
          rank: index + 1,
          wallet: donor.donorWallet,
          name: donor.donorName || 'Anonymous',
          totalDonated: donor.totalDonated,
          studentsSupported: donor.studentsSupported,
          impactScore: donor.impactScore,
          badges: donor.badges
        }))
      });
    } else if (type === 'students') {
      const students = await Student.find({})
        .select('name field institution milestones fundsRaised verificationStatus')
        .lean();

      // Calculate completion rate for each
      const studentsWithScore = students.map(s => {
        const totalMilestones = s.milestones?.length || 0;
        const completed = s.milestones?.filter(m => m.status === 'verified').length || 0;
        const completionRate = totalMilestones > 0 ? (completed / totalMilestones) * 100 : 0;
        
        return {
          ...s,
          completionRate,
          impactScore: (completionRate * 0.6) + ((s.fundsRaised || 0) / 1000 * 0.4)
        };
      });

      const topStudents = studentsWithScore
        .sort((a, b) => b.impactScore - a.impactScore)
        .slice(0, parseInt(limit));

      res.status(200).json({
        success: true,
        type: 'students',
        data: topStudents.map((student, index) => ({
          rank: index + 1,
          name: student.name,
          field: student.field,
          institution: student.institution,
          milestonesCompleted: student.milestones?.filter(m => m.status === 'verified').length || 0,
          totalMilestones: student.milestones?.length || 0,
          completionRate: student.completionRate.toFixed(1),
          fundsRaised: student.fundsRaised,
          verified: student.verificationStatus === 'verified'
        }))
      });
    }

  } catch (error) {
    console.error('Leaderboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

module.exports = router;

