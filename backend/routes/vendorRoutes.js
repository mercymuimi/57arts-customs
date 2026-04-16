const express = require('express');
const router = express.Router();
const {
  registerVendor,
  getVendorProfile,
  updateVendorProfile,
  getVendorStats,
  getAllVendors,
} = require('../controllers/vendorController');
const { protect, vendorOnly, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', protect, registerVendor);
router.get('/profile', protect, vendorOnly, getVendorProfile);
router.put('/profile', protect, vendorOnly, updateVendorProfile);
router.get('/stats', protect, vendorOnly, getVendorStats);
router.get('/', protect, adminOnly, getAllVendors);

module.exports = router;