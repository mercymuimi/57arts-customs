const Order = require('../models/Order');
const Product = require('../models/Product');
const Affiliate = require('../models/Affiliate');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// ── Email transporter (Gmail — add credentials to .env) ───────────────────────
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use Gmail App Password (not your real password)
  },
});

// ── Send delivery notification email ─────────────────────────────────────────
const sendDeliveryEmail = async (order) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return; // skip if not configured

  try {
    const transporter = createTransporter();
    const customerEmail = order.user?.email;
    if (!customerEmail) return;

    const itemsList = order.items
      .map(i => `<li style="margin-bottom:8px"><strong>${i.name}</strong> × ${i.quantity} — KSH ${(i.price * i.quantity).toLocaleString()}</li>`)
      .join('');

    await transporter.sendMail({
      from:    `"57 Arts & Customs" <${process.env.EMAIL_USER}>`,
      to:      customerEmail,
      subject: `🎉 Your Order #${order.orderNumber} Has Been Delivered!`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f0ece4;padding:40px;border-radius:16px">
          <div style="text-align:center;margin-bottom:32px">
            <div style="width:60px;height:60px;background:#c9a84c;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#000">57</div>
            <h1 style="color:#f0ece4;font-size:24px;margin-top:16px">57 Arts & Customs</h1>
          </div>

          <div style="background:#1a3d28;border:1px solid #2d6b46;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <div style="font-size:48px;margin-bottom:12px">📦</div>
            <h2 style="color:#5cc98a;font-size:22px;margin:0 0 8px">Your Order Has Arrived!</h2>
            <p style="color:#a0c4b0;margin:0">Order <strong style="color:#f0ece4">#${order.orderNumber}</strong> has been delivered successfully.</p>
          </div>

          <div style="background:#111111;border:1px solid #1c1c1c;border-radius:12px;padding:24px;margin-bottom:24px">
            <h3 style="color:#c9a84c;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 16px">Order Summary</h3>
            <ul style="list-style:none;padding:0;margin:0 0 16px">
              ${itemsList}
            </ul>
            <div style="border-top:1px solid #1c1c1c;padding-top:16px;display:flex;justify-content:space-between">
              <span style="color:#606060">Total Paid</span>
              <strong style="color:#c9a84c">KSH ${order.totalPrice?.toLocaleString()}</strong>
            </div>
          </div>

          <div style="background:#111111;border:1px solid #1c1c1c;border-radius:12px;padding:24px;margin-bottom:24px">
            <h3 style="color:#c9a84c;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 16px">Delivered To</h3>
            <p style="color:#f0ece4;margin:0">${order.shippingAddress?.fullName}</p>
            <p style="color:#606060;margin:4px 0 0">${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.country}</p>
          </div>

          <div style="text-align:center;margin-bottom:24px">
            <p style="color:#606060;font-size:13px;margin-bottom:16px">We hope you love your piece! Please leave a review to help your artisan grow.</p>
            <a href="http://localhost:3000/order-tracking" style="display:inline-block;background:#c9a84c;color:#000;padding:14px 32px;border-radius:10px;font-weight:900;font-size:13px;text-decoration:none">
              View Order & Leave Review →
            </a>
          </div>

          <p style="color:#333;font-size:11px;text-align:center;margin:0">
            © 2024 57 Arts & Customs · Nairobi, Kenya · <a href="http://localhost:3000" style="color:#c9a84c">Visit Store</a>
          </p>
        </div>
      `,
    });

    console.log(`✅ Delivery email sent to ${customerEmail}`);
  } catch (err) {
    console.error('❌ Email error:', err.message);
    // Don't throw — email failure shouldn't break the order update
  }
};

// ── Send order confirmation email ─────────────────────────────────────────────
const sendOrderConfirmationEmail = async (order, userEmail) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  try {
    const transporter = createTransporter();
    if (!userEmail) return;

    const itemsList = order.items
      .map(i => `<li style="margin-bottom:8px"><strong>${i.name}</strong> × ${i.quantity} — KSH ${(i.price * i.quantity).toLocaleString()}</li>`)
      .join('');

    await transporter.sendMail({
      from:    `"57 Arts & Customs" <${process.env.EMAIL_USER}>`,
      to:      userEmail,
      subject: `✅ Order Confirmed — #${order.orderNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f0ece4;padding:40px;border-radius:16px">
          <div style="text-align:center;margin-bottom:32px">
            <div style="width:60px;height:60px;background:#c9a84c;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#000">57</div>
            <h1 style="color:#f0ece4;font-size:24px;margin-top:16px">Order Confirmed!</h1>
          </div>

          <div style="background:#111111;border:1px solid #1c1c1c;border-radius:12px;padding:24px;margin-bottom:24px">
            <p style="color:#606060;margin:0 0 8px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase">Order Number</p>
            <p style="color:#c9a84c;font-weight:900;font-size:20px;margin:0">#${order.orderNumber}</p>
          </div>

          <div style="background:#111111;border:1px solid #1c1c1c;border-radius:12px;padding:24px;margin-bottom:24px">
            <h3 style="color:#c9a84c;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 16px">Items Ordered</h3>
            <ul style="list-style:none;padding:0;margin:0 0 16px">${itemsList}</ul>
            <div style="border-top:1px solid #1c1c1c;padding-top:16px">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <span style="color:#606060">Subtotal</span>
                <span style="color:#f0ece4">KSH ${order.itemsPrice?.toLocaleString()}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <span style="color:#606060">Shipping</span>
                <span style="color:${order.shippingPrice === 0 ? '#5cc98a' : '#f0ece4'}">${order.shippingPrice === 0 ? 'Free' : `KSH ${order.shippingPrice?.toLocaleString()}`}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid #1c1c1c">
                <strong style="color:#f0ece4">Total</strong>
                <strong style="color:#c9a84c">KSH ${order.totalPrice?.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div style="text-align:center;margin-bottom:24px">
            <a href="http://localhost:3000/order-tracking" style="display:inline-block;background:#c9a84c;color:#000;padding:14px 32px;border-radius:10px;font-weight:900;font-size:13px;text-decoration:none">
              Track Your Order →
            </a>
          </div>

          <p style="color:#333;font-size:11px;text-align:center;margin:0">
            © 2024 57 Arts & Customs · Nairobi, Kenya
          </p>
        </div>
      `,
    });

    console.log(`✅ Confirmation email sent to ${userEmail}`);
  } catch (err) {
    console.error('❌ Confirmation email error:', err.message);
  }
};

// ── Helper: resolve product ID (handles both ObjectId and slug) ───────────────
const resolveProduct = async (productRef) => {
  if (mongoose.Types.ObjectId.isValid(productRef)) {
    const product = await Product.findById(productRef);
    if (product) return product;
  }
  const product = await Product.findOne({ slug: productRef });
  return product;
};

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const {
      items, shippingAddress, paymentMethod, paymentStatus,
      itemsPrice, shippingPrice, totalPrice, notes, affiliateCode,
      mpesaTransactionId,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const resolvedItems = [];
    for (const item of items) {
      const product = await resolveProduct(item.product);
      if (!product) {
        return res.status(400).json({
          message: `Some items have an invalid product ID (${item.name}). Please remove them from your cart and add them again.`,
        });
      }
      resolvedItems.push({
        product:  product._id,
        name:     item.name     || product.name,
        image:    item.image    || product.images?.[0] || '',
        category: item.category || product.category,
        quantity: item.quantity,
        price:    item.price    || product.price,
        ...(item.vendor ? { vendor: item.vendor } : {}),
      });
    }

    const orderData = {
      user:               req.user._id,
      items:              resolvedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus:      paymentStatus || 'pending',
      itemsPrice,
      shippingPrice:      shippingPrice || 0,
      totalPrice,
      notes:              notes || '',
      mpesaTransactionId: mpesaTransactionId || '',
    };

    if (affiliateCode) {
      const affiliate = await Affiliate.findOne({ affiliateCode, status: 'active' });
      if (affiliate) {
        const commission = (totalPrice * affiliate.commissionRate) / 100;
        orderData.affiliateCode       = affiliateCode;
        orderData.affiliate           = affiliate._id;
        orderData.affiliateCommission = commission;
        affiliate.totalOrders   += 1;
        affiliate.totalSales    += totalPrice;
        affiliate.totalEarned   += commission;
        affiliate.pendingBalance += commission;
        affiliate.lastActiveAt   = new Date();
        await affiliate.save();
      }
    }

    const order = await Order.create(orderData);

    if (orderData.affiliate) {
      await Affiliate.findByIdAndUpdate(orderData.affiliate, { $push: { orders: order._id } });
    }

    // ✅ Send order confirmation email
    await sendOrderConfirmationEmail(order, req.user.email);

    res.status(201).json({ success: true, order });

  } catch (err) {
    console.error('❌ Create order error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images slug')
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
      .populate('items.product', 'name images slug');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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

    order.orderStatus  = 'cancelled';
    order.cancelledAt  = new Date();
    order.cancelReason = req.body.reason || 'Cancelled by customer';
    await order.save();

    res.json({ success: true, message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/orders/vendor/all
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.vendor': req.user._id })
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/orders/:id/status
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
        ...(status === 'delivered' && { deliveredAt: new Date(), paymentStatus: 'paid' }),
      },
      { new: true }
    ).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // ✅ Send delivery email notification when status becomes 'delivered'
    if (status === 'delivered') {
      await sendDeliveryEmail(order);
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};