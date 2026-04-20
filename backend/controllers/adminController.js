const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Affiliate = require('../models/Affiliate');

const requireAdmin = (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Admin access only' });
    return false;
  }
  return true;
};

// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const [totalUsers, totalVendors, totalOrders, totalProducts, totalAffiliates, recentOrders, revenueData] = await Promise.all([
      User.countDocuments({ role: 'buyer' }),
      User.countDocuments({ role: 'vendor' }),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'affiliate' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$totalPrice' } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    res.json({ totalUsers, totalVendors, totalOrders, totalProducts, totalAffiliates, totalRevenue: totalRevenue[0]?.total || 0, recentOrders, revenueData });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/admin/users/:id/toggle
const toggleUserStatus = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { role } = req.body;
    if (!['buyer','vendor','affiliate','admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/vendors
const getAllVendors = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const vendors = await Vendor.find().populate('user', 'name email phone isActive').sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/admin/vendors/:id/approve
const approveVendor = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { isApproved: true, status: 'active' }, { new: true }).populate('user', 'name email');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor approved', vendor });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/admin/vendors/:id/reject
const rejectVendor = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { isApproved: false, status: 'suspended' }, { new: true }).populate('user', 'name email');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor rejected', vendor });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { orderStatus } = req.body;
    if (!['pending','processing','shipped','delivered','cancelled'].includes(orderStatus)) return res.status(400).json({ message: 'Invalid status' });
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/products
const getAllProducts = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const products = await Product.find().populate('vendor', 'businessName').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/affiliates
const getAllAffiliates = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const affiliates = await Affiliate.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(affiliates);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

let platformSettings = { maintenanceMode: false, newVendorRegistrations: true };

// GET /api/admin/settings
const getSettings = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    res.json(platformSettings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/admin/settings
const updateSettings = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    platformSettings = { ...platformSettings, ...req.body };
    res.json({ message: 'Settings updated', settings: platformSettings });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  getDashboardStats, getAllUsers, toggleUserStatus, updateUserRole, deleteUser,
  getAllVendors, approveVendor, rejectVendor,
  getAllOrders, updateOrderStatus,
  getAllProducts, deleteProduct,
  getAllAffiliates,
  getSettings, updateSettings,
};