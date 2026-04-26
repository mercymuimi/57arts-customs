const CustomOrder = require('../models/CustomOrder');

// ── POST /api/custom-orders ──────────────────────────────────────────────────
const createCustomOrder = async (req, res) => {
  try {
    const {
      category,
      categoryLabel,
      vision,
      materials,
      filesCount,
      aiRender,
      aiProvider,
      timeline,
      basePrice,
    } = req.body;

    if (!category || !vision) {
      return res.status(400).json({ message: 'Category and vision are required.' });
    }

    // Normalize category — accept 'beads' or 'beads & jewelry' both
    const normalizedCategory = category.toLowerCase().startsWith('beads') ? 'beads'
      : category.toLowerCase().startsWith('fashion')   ? 'fashion'
      : category.toLowerCase().startsWith('furniture') ? 'furniture'
      : category;

    const count = await CustomOrder.countDocuments();
    const orderNumber = `CO-${Date.now()}-${String(count + 1).padStart(4, '0')}`;

    const customOrder = new CustomOrder({
      user:          req.user._id,
      orderNumber,
      category:      normalizedCategory,
      categoryLabel: categoryLabel || normalizedCategory,
      vision,
      materials:     Array.isArray(materials) ? materials : [],
      filesCount:    filesCount || 0,
      aiRender:      aiRender   || null,
      aiProvider:    aiProvider || null,
      timeline:      timeline   || null,
      basePrice:     basePrice  || null,
    });

    await customOrder.save();
    res.status(201).json(customOrder);

  } catch (err) {
    console.error('❌ createCustomOrder error:', err.message, err.stack);
    res.status(500).json({ message: err.message, detail: err.errors || null });
  }
};

// ── GET /api/custom-orders/my-orders ────────────────────────────────────────
const getMyCustomOrders = async (req, res) => {
  try {
    const orders = await CustomOrder.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/custom-orders (admin) ──────────────────────────────────────────
const getAllCustomOrders = async (req, res) => {
  try {
    const orders = await CustomOrder.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/custom-orders/:id/status (admin) ───────────────────────────────
const updateCustomOrderStatus = async (req, res) => {
  try {
    const { orderStatus, quotedPrice, adminNotes } = req.body;

    const validStatuses = ['pending', 'quoted', 'approved', 'in_progress', 'delivered', 'cancelled'];
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (quotedPrice) update.quotedPrice = quotedPrice;
    if (adminNotes)  update.adminNotes  = adminNotes;

    const order = await CustomOrder.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Custom order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCustomOrder,
  getMyCustomOrders,
  getAllCustomOrders,
  updateCustomOrderStatus,
};