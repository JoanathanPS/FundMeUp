const express = require('express');
const router = express.Router();

// This is a placeholder for the original verification routes
// Most verification has been moved to verificationRoutesV2 and V3

router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Verification routes V1 endpoint' });
});

module.exports = router;
