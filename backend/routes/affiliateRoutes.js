const express = require('express');
const router = express.Router();
const {
  registerAffiliate,
  getAffiliateProfile,
  getAffiliateStats,
  trackClick,
} = require('../controllers/affiliateController');
const { protect, affiliateOnly } = require('../middleware/authMiddleware');

router.post('/register', protect, registerAffiliate);
router.get('/profile', protect, affiliateOnly, getAffiliateProfile);
router.get('/stats', protect, affiliateOnly, getAffiliateStats);
router.post('/track-click', trackClick); // public — called when affiliate link clicked

module.exports = router;