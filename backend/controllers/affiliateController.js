const Affiliate = require('../models/Affiliate');
const User = require('../models/User');

// POST /api/affiliates/register
exports.registerAffiliate = async (req, res) => {
  try {
    const existing = await Affiliate.findOne({ user: req.user._id });
    if (existing) {
      // If already exists, return it (idempotent — useful for re-registration attempts)
      return res.status(200).json({ success: true, affiliate: existing, alreadyExists: true });
    }

    const { payoutMethod, mpesaNumber, bankDetails, channel, audience, why } = req.body;

    const affiliate = await Affiliate.create({
      user:          req.user._id,
      payoutMethod:  payoutMethod  || 'mpesa',
      mpesaNumber:   mpesaNumber   || '',
      bankDetails:   bankDetails   || {},
      // ✅ FIX: auto-activate so affiliate can access dashboard immediately
      // Admin can suspend later if needed
      status:        'active',
      commissionRate: 5, // Starter tier — 5%
      // Store application details for admin review
      applicationData: { channel, audience, why },
    });

    // Upgrade user role to affiliate
    await User.findByIdAndUpdate(req.user._id, { role: 'affiliate' });

    res.status(201).json({ success: true, affiliate });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/affiliates/profile
exports.getAffiliateProfile = async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user: req.user._id })
      .populate('user', 'name email phone')
      .populate('orders', 'orderNumber totalPrice createdAt orderStatus');
    if (!affiliate) return res.status(404).json({ message: 'Affiliate not found' });
    res.json({ success: true, affiliate });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/affiliates/stats
exports.getAffiliateStats = async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user: req.user._id })
      .populate('orders', 'orderNumber totalPrice createdAt orderStatus affiliateCommission');
    if (!affiliate) return res.status(404).json({ message: 'Affiliate not found' });

    // Build monthly chart data from real orders
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyData = {};
    (affiliate.orders || []).forEach(order => {
      const m = new Date(order.createdAt).getMonth();
      if (!monthlyData[m]) monthlyData[m] = { clicks: 0, conversions: 0, sales: 0 };
      monthlyData[m].conversions += 1;
      monthlyData[m].sales += order.totalPrice || 0;
    });

    // Determine tier based on totalSales
    let tier = 'Starter';
    let commissionRate = 5;
    if (affiliate.totalSales >= 200000) { tier = 'Gold';   commissionRate = 12; }
    else if (affiliate.totalSales >= 50000) { tier = 'Silver'; commissionRate = 8; }

    const nextTierThreshold = tier === 'Gold' ? null : tier === 'Silver' ? 200000 : 50000;
    const nextTier = tier === 'Gold' ? null : tier === 'Silver' ? 'Gold' : 'Silver';

    res.json({
      success: true,
      stats: {
        affiliateCode:      affiliate.affiliateCode,
        status:             affiliate.status,
        totalClicks:        affiliate.totalClicks,
        totalOrders:        affiliate.totalOrders,
        totalSales:         affiliate.totalSales,
        totalEarned:        affiliate.totalEarned,
        totalPaid:          affiliate.totalPaid,
        pendingBalance:     affiliate.pendingBalance,
        conversionRate:     affiliate.conversionRate,
        currentTier:        tier,
        commissionRate,
        nextTier,
        nextTierThreshold,
        monthlyData,
        recentOrders:       affiliate.orders?.slice(-10).reverse() || [],
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/affiliates/track-click — public, called when affiliate link is visited
exports.trackClick = async (req, res) => {
  try {
    const { affiliateCode } = req.body;
    if (!affiliateCode) return res.status(400).json({ message: 'Affiliate code required' });

    await Affiliate.findOneAndUpdate(
      { affiliateCode, status: 'active' },
      { $inc: { totalClicks: 1 }, lastActiveAt: new Date() }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/affiliates/payout-details — update payout method
exports.updatePayoutDetails = async (req, res) => {
  try {
    const { payoutMethod, mpesaNumber, bankDetails, paypalEmail } = req.body;
    const affiliate = await Affiliate.findOneAndUpdate(
      { user: req.user._id },
      { payoutMethod, mpesaNumber, bankDetails, paypalEmail },
      { new: true }
    );
    if (!affiliate) return res.status(404).json({ message: 'Affiliate not found' });
    res.json({ success: true, affiliate });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};