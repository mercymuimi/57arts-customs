const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  resendOTP,
  forgotPassword,   // ✅ new
  resetPassword,    // ✅ new
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register',        register);
router.post('/verify-email',    verifyEmail);
router.post('/resend-otp',      resendOTP);
router.post('/login',           login);
router.post('/forgot-password', forgotPassword);   // ✅
router.post('/reset-password',  resetPassword);    // ✅
router.get('/me',   protect,    getProfile);
router.put('/me',   protect,    updateProfile);

module.exports = router;