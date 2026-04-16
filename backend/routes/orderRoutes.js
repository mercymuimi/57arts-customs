const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getVendorOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, vendorOnly } = require('../middleware/authMiddleware');

// Buyer routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Vendor routes
router.get('/vendor/all', protect, vendorOnly, getVendorOrders);
router.put('/:id/status', protect, vendorOnly, updateOrderStatus);

module.exports = router;