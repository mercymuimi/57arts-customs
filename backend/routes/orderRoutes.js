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

// ── Vendor routes MUST come before /:id — otherwise Express matches
//    "vendor" as an order ID and the route never reaches getVendorOrders ──────
router.get('/vendor/all', protect, vendorOnly, getVendorOrders);

// ── Buyer routes ─────────────────────────────────────────────────────────────
router.post('/',            protect,             createOrder);
router.get('/my-orders',    protect,             getMyOrders);
router.get('/:id',          protect,             getOrderById);
router.put('/:id/cancel',   protect,             cancelOrder);

// ── Vendor order status update ────────────────────────────────────────────────
router.put('/:id/status',   protect, vendorOnly, updateOrderStatus);

module.exports = router;