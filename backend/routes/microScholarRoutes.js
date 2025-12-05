const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// FundMeUp V1 routes - Feed and Leaderboard endpoints

// Feed endpoint - Get recent activity
router.get('/', async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    
    // Check if Supabase is configured
    if (!supabase) {
      return res.json({
        success: true,
        data: [],
        count: 0,
        message: 'Supabase not configured - returning empty feed'
      });
    }
    
    // Get recent scholarships
    let scholarships = [];
    try {
      const { data, error: scholarshipsError } = await supabase
        .from('scholarships')
        .select('id, title, description, country, field, goal, raised, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (scholarshipsError) {
        console.error('Error fetching scholarships for feed:', scholarshipsError);
      } else {
        scholarships = data || [];
      }
    } catch (err) {
      console.error('Error fetching scholarships:', err);
    }
    
    // Get recent donations
    let donations = [];
    try {
      const { data, error: donationsError } = await supabase
        .from('donations')
        .select('id, amount, created_at, scholarship_id, tx_hash')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (donationsError) {
        console.error('Error fetching donations for feed:', donationsError);
      } else {
        donations = data || [];
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
    
    // Get scholarship titles for donations
    const scholarshipIds = donations.map(d => d.scholarship_id).filter(Boolean);
    let titleMap = {};
    if (scholarshipIds.length > 0) {
      try {
        const { data: scholarshipTitles } = await supabase
          .from('scholarships')
          .select('id, title')
          .in('id', scholarshipIds);
        
        if (scholarshipTitles) {
          scholarshipTitles.forEach(s => { titleMap[s.id] = s.title; });
        }
      } catch (err) {
        console.error('Error fetching scholarship titles:', err);
      }
    }
    
    const activities = [
      ...(scholarships || []).map(s => ({
        type: 'scholarship',
        id: s.id,
        title: s.title,
        description: `New scholarship created: ${s.title}`,
        timestamp: s.created_at,
        metadata: {
          country: s.country,
          field: s.field,
          goal: s.goal
        }
      })),
      ...(donations || []).map(t => ({
        type: 'donation',
        id: t.id,
        title: `Donation of ₹${t.amount}`,
        description: `Donation made to ${titleMap[t.scholarship_id] || 'scholarship'}`,
        timestamp: t.created_at,
        metadata: {
          amount: t.amount,
          txHash: t.tx_hash
        }
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);
    
    res.json({
      success: true,
      data: activities,
      count: activities.length
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feed data',
      message: error.message
    });
  }
});

// Leaderboard stats endpoint
router.get('/stats', async (req, res) => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return res.json({
        success: true,
        data: {
          totalStudents: 0,
          totalScholarships: 0,
          totalTransactions: 0,
          totalFunded: 0,
          averageDonation: 0
        }
      });
    }
    
    // Get counts with error handling
    let totalStudents = 0;
    let totalScholarships = 0;
    let totalTransactions = 0;
    
    try {
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      totalStudents = count || 0;
    } catch (err) {
      console.error('Error counting users:', err);
    }
    
    try {
      const { count } = await supabase
        .from('scholarships')
        .select('*', { count: 'exact', head: true });
      totalScholarships = count || 0;
    } catch (err) {
      console.error('Error counting scholarships:', err);
    }
    
    try {
      const { count } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true });
      totalTransactions = count || 0;
    } catch (err) {
      console.error('Error counting donations:', err);
    }
    
    // Get total raised
    let totalFunded = 0;
    try {
      const { data: donations } = await supabase
        .from('donations')
        .select('amount');
      
      totalFunded = donations ? donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) : 0;
    } catch (err) {
      console.error('Error calculating total funded:', err);
    }
    
    res.json({
      success: true,
      data: {
        totalStudents,
        totalScholarships,
        totalTransactions,
        totalFunded,
        averageDonation: totalTransactions > 0 ? totalFunded / totalTransactions : 0
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error);
    res.json({
      success: true,
      data: {
        totalStudents: 0,
        totalScholarships: 0,
        totalTransactions: 0,
        totalFunded: 0,
        averageDonation: 0
      }
    });
  }
});

// Donors leaderboard
router.get('/donors', async (req, res) => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const { data: donations, error } = await supabase
      .from('donations')
      .select('donor_id, amount, created_at');
    
    if (error) {
      console.error('Error fetching donors:', error);
      return res.json({
        success: true,
        data: []
      });
    }
    
    // Group by donor_id
    const donorMap = {};
    (donations || []).forEach(d => {
      const donorId = d.donor_id || 'unknown';
      if (!donorMap[donorId]) {
        donorMap[donorId] = {
          donorId,
          totalDonated: 0,
          donationCount: 0,
          lastDonation: null
        };
      }
      donorMap[donorId].totalDonated += Number(d.amount) || 0;
      donorMap[donorId].donationCount += 1;
      if (!donorMap[donorId].lastDonation || new Date(d.created_at) > new Date(donorMap[donorId].lastDonation)) {
        donorMap[donorId].lastDonation = d.created_at;
      }
    });
    
    const donors = Object.values(donorMap)
      .sort((a, b) => b.totalDonated - a.totalDonated)
      .slice(0, 50)
      .map((d, index) => ({
        rank: index + 1,
        wallet: d.donorId,
        totalDonated: d.totalDonated,
        donationCount: d.donationCount,
        lastDonation: d.lastDonation
      }));
    
    res.json({
      success: true,
      data: donors
    });
  } catch (error) {
    console.error('Error fetching donors leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch donors',
      message: error.message
    });
  }
});

// Students leaderboard
router.get('/students', async (req, res) => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const { data: scholarships, error } = await supabase
      .from('scholarships')
      .select('student_id, raised, goal');
    
    if (error) {
      console.error('Error fetching students:', error);
      return res.json({
        success: true,
        data: []
      });
    }
    
    // Group by student_id
    const studentMap = {};
    (scholarships || []).forEach(s => {
      const studentId = s.student_id || 'unknown';
      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          studentId,
          totalRaised: 0,
          scholarshipCount: 0,
          totalGoal: 0
        };
      }
      studentMap[studentId].totalRaised += Number(s.raised) || 0;
      studentMap[studentId].totalGoal += Number(s.goal) || 0;
      studentMap[studentId].scholarshipCount += 1;
    });
    
    const students = Object.values(studentMap)
      .map(s => ({
        ...s,
        averageProgress: s.totalGoal > 0 ? (s.totalRaised / s.totalGoal) * 100 : 0
      }))
      .sort((a, b) => b.totalRaised - a.totalRaised)
      .slice(0, 50)
      .map((s, index) => ({
        rank: index + 1,
        studentId: s.studentId,
        totalRaised: s.totalRaised,
        scholarshipCount: s.scholarshipCount,
        averageProgress: s.averageProgress
      }));
    
    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch students',
      message: error.message
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'FundMeUp V1 routes - Feed and Leaderboard endpoints active' });
});

module.exports = router;
