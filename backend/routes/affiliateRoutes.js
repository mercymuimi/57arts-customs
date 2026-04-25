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
// Note: protect only (not affiliateOnly) so pending affiliates can reach
// these routes and see their status screen instead of a 403 error.
router.get('/profile',         protect, getAffiliateProfile);
router.get('/stats',           protect, getAffiliateStats);
router.put('/payout-details',  protect, affiliateOnly, updatePayoutDetails);

module.exports = router;