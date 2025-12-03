const express = require('express');
const router = express.Router();

// Legacy MicroScholar V1 routes
// Most functionality moved to microScholarV2Routes

router.get('/test', (req, res) => {
  res.json({ success: true, message: 'MicroScholar V1 routes - use /api/v2 for latest features' });
});

module.exports = router;
