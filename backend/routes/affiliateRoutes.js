const express = require('express');
const router  = express.Router();
const {
  registerAffiliate,
  getAffiliateProfile,
  getAffiliateStats,
  trackClick,
  updatePayoutDetails,
} = require('../controllers/affiliateController');
const { protect, affiliateOnly } = require('../middleware/authMiddleware');

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/track-click', trackClick);           // called when ref link clicked

// ── Authenticated (any logged-in user) ───────────────────────────────────────
router.post('/register', protect, registerAffiliate);

// ── Affiliate only ────────────────────────────────────────────────────────────
router.get('/profile',         protect, affiliateOnly, getAffiliateProfile);
router.get('/stats',           protect, affiliateOnly, getAffiliateStats);
router.put('/payout-details',  protect, affiliateOnly, updatePayoutDetails);

module.exports = router;