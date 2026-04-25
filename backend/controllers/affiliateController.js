const Affiliate = require('../models/Affiliate');
const User      = require('../models/User');

// POST /api/affiliates/register
exports.registerAffiliate = async (req, res) => {
  try {
    const existing = await Affiliate.findOne({ user: req.user._id });
    if (existing) {
      return res.status(200).json({ success: true, affiliate: existing, alreadyExists: true });
    }

    const { payoutMethod, mpesaNumber, bankDetails, channel, audience, why } = req.body;

    const affiliate = await Affiliate.create({
      user:            req.user._id,
      payoutMethod:    payoutMethod || 'mpesa',
      mpesaNumber:     mpesaNumber  || '',
      bankDetails:     bankDetails  || {},
      status:          'pending',   // admin must approve before affiliate can earn
      commissionRate:  5,
      applicationData: { channel, audience, why },
    });

    // Role stays as 'buyer' until admin approves — upgraded in approveAffiliate

    res.status(201).json({ success: true, affiliate });
  } catch (err) {
    console.error('❌ REGISTER AFFILIATE ERROR:', err.message);
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
    console.error('❌ GET AFFILIATE PROFILE ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/affiliates/stats
exports.getAffiliateStats = async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user: req.user._id })
      .populate('orders', 'orderNumber totalPrice createdAt orderStatus affiliateCommission');
    if (!affiliate) return res.status(404).json({ message: 'Affiliate not found' });

    const monthlyData = {};
    (affiliate.orders || []).forEach(order => {
      const m = new Date(order.createdAt).getMonth();
      if (!monthlyData[m]) monthlyData[m] = { clicks: 0, conversions: 0, sales: 0 };
      monthlyData[m].conversions += 1;
      monthlyData[m].sales += order.totalPrice || 0;
    });

    let tier = 'Starter';
    let commissionRate = 5;
    if (affiliate.totalSales >= 200000)     { tier = 'Gold';   commissionRate = 12; }
    else if (affiliate.totalSales >= 50000) { tier = 'Silver'; commissionRate = 8;  }

    const nextTierThreshold = tier === 'Gold' ? null : tier === 'Silver' ? 200000 : 50000;
    const nextTier          = tier === 'Gold' ? null : tier === 'Silver' ? 'Gold'  : 'Silver';

    res.json({
      success: true,
      stats: {
        affiliateCode:    affiliate.affiliateCode,
        status:           affiliate.status,
        totalClicks:      affiliate.totalClicks,
        totalOrders:      affiliate.totalOrders,
        totalSales:       affiliate.totalSales,
        totalEarned:      affiliate.totalEarned,
        totalPaid:        affiliate.totalPaid,
        pendingBalance:   affiliate.pendingBalance,
        conversionRate:   affiliate.conversionRate,
        currentTier:      tier,
        commissionRate,
        nextTier,
        nextTierThreshold,
        monthlyData,
        recentOrders:     affiliate.orders?.slice(-10).reverse() || [],
      },
    });
  } catch (err) {
    console.error('❌ GET AFFILIATE STATS ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/affiliates/track-click — public
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
    console.error('❌ TRACK CLICK ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/affiliates/payout-details
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
    console.error('❌ UPDATE PAYOUT DETAILS ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};