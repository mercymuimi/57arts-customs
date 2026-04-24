const Vendor  = require('../models/Vendor');
const Order   = require('../models/Order');
const Product = require('../models/Product');
const User    = require('../models/User');

// POST /api/vendors/register
exports.registerVendor = async (req, res) => {
  try {
    const existing = await Vendor.findOne({ user: req.user._id });
    if (existing) {
      // Idempotent — if already registered just return the existing profile
      return res.status(200).json({ success: true, vendor: existing, alreadyExists: true });
    }

    const { storeName, storeDescription, storeLogo, category } = req.body;

    if (!storeName) return res.status(400).json({ message: 'Store name is required' });
    if (!category)  return res.status(400).json({ message: 'Category is required' });

    const vendor = await Vendor.create({
      user:             req.user._id,
      storeName,
      storeDescription: storeDescription || '',
      storeLogo:        storeLogo        || '',
      category,
    });

    // Upgrade user role to vendor in DB.
    // The JWT still says role:buyer until the frontend calls refreshUser()
    // which hits GET /auth/me and gets a fresh token with role:vendor.
    await User.findByIdAndUpdate(req.user._id, { role: 'vendor' });

    res.status(201).json({ success: true, message: 'Vendor registered', vendor });
  } catch (err) {
    console.error('❌ REGISTER VENDOR ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/vendors/profile
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id })
      .populate('user', 'name email phone');

    if (!vendor) {
      return res.status(404).json({
        message: 'Vendor profile not found. Please complete your vendor registration.',
      });
    }

    res.json({ success: true, vendor });
  } catch (err) {
    console.error('❌ GET VENDOR PROFILE ERROR:', err.message);
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
    console.error('❌ UPDATE VENDOR PROFILE ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/vendors/stats
exports.getVendorStats = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const totalProducts = await Product.countDocuments({ vendor: vendor._id });
    const orders        = await Order.find({ 'items.vendor': vendor._id });

    const totalOrders  = orders.length;
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => {
        const vendorItems = o.items.filter(
          i => i.vendor?.toString() === vendor._id.toString()
        );
        return sum + vendorItems.reduce((s, i) => s + i.price * i.quantity, 0);
      }, 0);

    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;

    res.json({
      success: true,
      stats: { totalProducts, totalOrders, totalRevenue, pendingOrders },
    });
  } catch (err) {
    console.error('❌ GET VENDOR STATS ERROR:', err.message);
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
    console.error('❌ GET ALL VENDORS ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};