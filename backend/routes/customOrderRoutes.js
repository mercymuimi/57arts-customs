const express = require('express');
const router  = express.Router();
const {
  createCustomOrder,
  getMyCustomOrders,
  getAllCustomOrders,
  updateCustomOrderStatus,
} = require('../controllers/customOrderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Buyer routes
router.post('/',             protect,            createCustomOrder);
router.get('/my-orders',     protect,            getMyCustomOrders);

// Admin routes
router.get('/',              protect, adminOnly, getAllCustomOrders);
router.put('/:id/status',    protect, adminOnly, updateCustomOrderStatus);

module.exports = router;