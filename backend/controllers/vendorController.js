const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// POST /api/vendors/register
exports.registerVendor = async (req, res) => {
  try {
    const existing = await Vendor.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Vendor profile already exists' });
    }

    const { storeName, storeDescription, storeLogo, category } = req.body;

    const vendor = await Vendor.create({
      user: req.user._id,
      storeName,
      storeDescription,
      storeLogo,
      category,
    });

    // Upgrade user role to vendor
    await User.findByIdAndUpdate(req.user._id, { role: 'vendor' });

    res.status(201).json({ success: true, message: 'Vendor registered', vendor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/vendors/profile
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
      .populate('user', 'name email phone');
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });
    res.json({ success: true, vendor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/vendors/profile
exports.updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ success: true, vendor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/vendors/stats — dashboard numbers
exports.getVendorStats = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const totalProducts = await Product.countDocuments({ vendor: vendor._id });
    const orders = await Order.find({ 'items.vendor': vendor._id });

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => {
        const vendorItems = o.items.filter(
          i => i.vendor.toString() === vendor._id.toString()
        );
        return sum + vendorItems.reduce((s, i) => s + i.price * i.quantity, 0);
      }, 0);

    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;

    res.json({
      success: true,
      stats: { totalProducts, totalOrders, totalRevenue, pendingOrders }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/vendors — admin only
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, vendors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};