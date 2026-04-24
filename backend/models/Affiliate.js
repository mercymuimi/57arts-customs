const mongoose = require('mongoose');

const commissionTierSchema = new mongoose.Schema({
  minSales: { type: Number, required: true },
  maxSales: { type: Number },
  rate:     { type: Number, required: true },
  label:    { type: String },
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

    commissionRate: { type: Number, default: 5 },
    tiers:          [commissionTierSchema],

    applicationData: {
      channel:  { type: String },
      audience: { type: String },
      why:      { type: String },
    },

    totalClicks:    { type: Number, default: 0 },
    totalOrders:    { type: Number, default: 0 },
    totalSales:     { type: Number, default: 0 },
    totalEarned:    { type: Number, default: 0 },
    totalPaid:      { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },

    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],

    joinedAt:     { type: Date, default: Date.now },
    lastActiveAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

affiliateSchema.virtual('conversionRate').get(function () {
  if (this.totalClicks === 0) return 0;
  return ((this.totalOrders / this.totalClicks) * 100).toFixed(2);
});

affiliateSchema.virtual('currentTier').get(function () {
  if (!this.tiers || this.tiers.length === 0) return 'Starter';
  const tier = this.tiers
    .slice()
    .reverse()
    .find(t => this.totalSales >= t.minSales);
  return tier ? tier.label : this.tiers[0].label;
});

// Mongoose 9: pre-save hooks do NOT receive `next` as a parameter.
// Just return — Mongoose handles completion automatically.
affiliateSchema.pre('save', function () {
  if (!this.affiliateCode) {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.affiliateCode = `AFF-${random}`;
  }
});

const Affiliate = mongoose.model('Affiliate', affiliateSchema);
module.exports = Affiliate;