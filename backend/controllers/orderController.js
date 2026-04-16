const Order = require('../models/Order');
const Product = require('../models/Product');
const Affiliate = require('../models/Affiliate');

// POST /api/orders — create new order
exports.createOrder = async (req, res) => {
  try {
    const {
      items, shippingAddress, paymentMethod,
      itemsPrice, shippingPrice, totalPrice, affiliateCode
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Build order object
    const orderData = {
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice: shippingPrice || 0,
      totalPrice,
    };

    // Handle affiliate tracking
    if (affiliateCode) {
      const affiliate = await Affiliate.findOne({
        affiliateCode,
        status: 'active'
      });
      if (affiliate) {
        const commission = (totalPrice * affiliate.commissionRate) / 100;
        orderData.affiliateCode = affiliateCode;
        orderData.affiliate = affiliate._id;
        orderData.affiliateCommission = commission;

        // Update affiliate stats
        affiliate.totalOrders += 1;
        affiliate.totalSales += totalPrice;
        affiliate.totalEarned += commission;
        affiliate.pendingBalance += commission;
        affiliate.lastActiveAt = new Date();
        affiliate.orders.push(null); // will be updated after order save
        await affiliate.save();
      }
    }

    const order = await Order.create(orderData);

    // Update affiliate with the actual order ID
    if (orderData.affiliate) {
      await Affiliate.findByIdAndUpdate(orderData.affiliate, {
        $push: { orders: order._id }
      });
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images slug')
      .populate('items.vendor', 'storeName')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images slug')
      .populate('items.vendor', 'storeName');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || 'Cancelled by customer';
    await order.save();

    res.json({ success: true, message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/orders/vendor/all — vendor sees their own product orders
exports.getVendorOrders = async (req, res) => {
  try {
    const vendor = req.user._id;
    const orders = await Order.find({ 'items.vendor': vendor })
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/orders/:id/status — vendor updates order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: status,
        ...(status === 'delivered' && { deliveredAt: new Date(), paymentStatus: 'paid' })
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};