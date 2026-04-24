const mongoose = require('mongoose');

const commissionTierSchema = new mongoose.Schema({
  minSales: { type: Number, required: true },
  maxSales: { type: Number },
  rate:     { type: Number, required: true }, // percentage e.g. 10 = 10%
  label:    { type: String },                 // e.g. "Bronze", "Silver", "Gold"
});

const affiliateSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,
    },

    affiliateCode: {
      type:   String,
      unique: true,
    },

    status: {
      type:    String,
      enum:    ['pending', 'active', 'suspended'],
      default: 'pending',
    },

    // Payout info
    payoutMethod: {
      type:    String,
      enum:    ['mpesa', 'bank', 'paypal'],
      default: 'mpesa',
    },
    mpesaNumber: { type: String },
    bankDetails: {
      bankName:      { type: String },
      accountNumber: { type: String },
      accountName:   { type: String },
    },
    paypalEmail: { type: String },

    // Commission settings
    commissionRate: { type: Number, default: 5 }, // Starter tier — 5%
    tiers:          [commissionTierSchema],

    // Application data (stored for admin review)
    applicationData: {
      channel:  { type: String },
      audience: { type: String },
      why:      { type: String },
    },

    // Stats (updated on each referred order)
    totalClicks:    { type: Number, default: 0 },
    totalOrders:    { type: Number, default: 0 },
    totalSales:     { type: Number, default: 0 },    // KES value of referred sales
    totalEarned:    { type: Number, default: 0 },    // KES commission earned
    totalPaid:      { type: Number, default: 0 },    // KES paid out
    pendingBalance: { type: Number, default: 0 },    // KES awaiting payout

    // Referred orders
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Order',
      },
    ],

    joinedAt:     { type: Date, default: Date.now },
    lastActiveAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ── Virtuals ──────────────────────────────────────────────────────────────────

// Conversion rate as a percentage
affiliateSchema.virtual('conversionRate').get(function () {
  if (this.totalClicks === 0) return 0;
  return ((this.totalOrders / this.totalClicks) * 100).toFixed(2);
});

// Current tier label derived from totalSales
affiliateSchema.virtual('currentTier').get(function () {
  if (!this.tiers || this.tiers.length === 0) return 'Starter';
  const tier = this.tiers
    .slice()
    .reverse()
    .find(t => this.totalSales >= t.minSales);
  return tier ? tier.label : this.tiers[0].label;
});

// ── Pre-save hook ─────────────────────────────────────────────────────────────
// FIX: removed `async` from the callback. When using async middleware Mongoose
// does not pass `next` as a parameter — calling next() on undefined throws
// "next is not a function". Use the traditional (non-async) signature instead
// since this hook does no async work.
affiliateSchema.pre('save', function (next) {
  if (!this.affiliateCode) {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.affiliateCode = `AFF-${random}`;
  }
  next();
});

const Affiliate = mongoose.model('Affiliate', affiliateSchema);
module.exports = Affiliate;