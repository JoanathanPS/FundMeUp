const express = require('express');
const router = express.Router();

// Legacy AI routes - moved to aiRoutesV2
// Keeping this for backward compatibility

router.get('/test', (req, res) => {
  res.json({ success: true, message: 'AI routes V1 endpoint - use /api/ai/v2 for latest features' });
});

module.exports = router;
