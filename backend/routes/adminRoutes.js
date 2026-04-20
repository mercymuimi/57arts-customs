const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getAllUsers, toggleUserStatus, updateUserRole, deleteUser,
  getAllVendors, approveVendor, rejectVendor,
  getAllOrders, updateOrderStatus,
  getAllProducts, deleteProduct,
  getAllAffiliates,
  getSettings, updateSettings,
} = require('../controllers/adminController');

router.use(protect);

router.get('/stats', getDashboardStats);

router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

router.get('/vendors', getAllVendors);
router.put('/vendors/:id/approve', approveVendor);
router.put('/vendors/:id/reject', rejectVendor);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/products', getAllProducts);
router.delete('/products/:id', deleteProduct);

router.get('/affiliates', getAllAffiliates);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;