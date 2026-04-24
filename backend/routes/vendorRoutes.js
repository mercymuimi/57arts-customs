const express = require('express');
const router  = express.Router();
const {
  registerVendor,
  getVendorProfile,
  updateVendorProfile,
  getVendorStats,
  getAllVendors,
} = require('../controllers/vendorController');
const { protect, vendorOnly, adminOnly } = require('../middleware/authMiddleware');

// POST /register — only needs protect (user may still have role:buyer in JWT
// right after email verification, before refreshUser() updates the token)
router.post('/register', protect, registerVendor);

// GET /profile & /stats — protect only, no vendorOnly.
// The controller scopes by req.user._id so only the owner's data is returned.
// vendorOnly would block freshly registered vendors whose JWT hasn't been
// refreshed yet with role:vendor.
router.get('/profile', protect, getVendorProfile);
router.get('/stats',   protect, getVendorStats);

// PUT /profile — vendorOnly is fine here (editing requires confirmed vendor role)
router.put('/profile', protect, vendorOnly, updateVendorProfile);

// GET / — admin only
router.get('/', protect, adminOnly, getAllVendors);

module.exports = router;