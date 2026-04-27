const express = require('express');
const router  = express.Router();
const {
  createCustomOrder,
  getMyCustomOrders,
  getAllCustomOrders,
  updateCustomOrderStatus,
} = require('../controllers/customOrderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const CustomOrder = require('../models/CustomOrder');

// ── BUYER ROUTES ──────────────────────────────────────────────────────────────
router.post('/',         protect, createCustomOrder);
router.get('/my-orders', protect, getMyCustomOrders);

// Buyer approves a quoted order and pays
router.put('/:id/approve', protect, async (req, res) => {
  try {
    const { paymentMethod, paymentPhone } = req.body;

    const order = await CustomOrder.findOneAndUpdate(
      {
        _id:         req.params.id,
        user:        req.user._id,
        orderStatus: { $in: ['quoted', 'quote_received'] },
      },
      {
        orderStatus:   'approved',
        paymentMethod: paymentMethod || 'mpesa',
        paymentPhone:  paymentPhone  || '',
        paidAt:        new Date(),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: 'Order not found, or it is not in a payable state.',
      });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('[customOrderRoutes] approve error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN ROUTES ──────────────────────────────────────────────────────────────
router.get('/',           protect, adminOnly, getAllCustomOrders);
router.put('/:id/status', protect, adminOnly, updateCustomOrderStatus);

module.exports = router;