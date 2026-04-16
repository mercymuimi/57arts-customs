const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Protect — verifies JWT and loads full user onto req.user
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' });

    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Vendor or Admin only
const vendorOnly = (req, res, next) => {
  if (req.user?.role === 'vendor' || req.user?.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Vendors only.' });
};

// ✅ Admin only
const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Admins only.' });
};

// ✅ Affiliate or Admin only
const affiliateOnly = (req, res, next) => {
  if (req.user?.role === 'affiliate' || req.user?.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Affiliates only.' });
};

// ✅ Any logged in user (buyer, vendor, affiliate, admin)
const buyerOnly = (req, res, next) => {
  if (['buyer', 'vendor', 'affiliate', 'admin'].includes(req.user?.role)) {
    return next();
  }
  res.status(403).json({ message: 'Access denied.' });
};

module.exports = { protect, vendorOnly, adminOnly, affiliateOnly, buyerOnly };