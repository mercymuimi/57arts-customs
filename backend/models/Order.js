const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: false,
  },
  name:     { type: String, required: true },
  image:    { type: String },
  category: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true },
  customization: {
    color:    { type: String },
    size:     { type: String },
    material: { type: String },
    notes:    { type: String },
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    items: [orderItemSchema],

    shippingAddress: {
      fullName:   { type: String, required: true },
      phone:      { type: String, required: true },
      street:     { type: String, required: true },
      city:       { type: String, required: true },
      county:     { type: String },
      country:    { type: String, default: 'Kenya' },
      postalCode: { type: String },
    },

    paymentMethod: {
      type: String,
      enum: ['mpesa', 'card', 'paypal', 'bank', 'cash_on_delivery'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    mpesaTransactionId: { type: String },

    itemsPrice:    { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    totalPrice:    { type: Number, required: true },

    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    notes: { type: String },

    affiliateCode:       { type: String },
    affiliate:           { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate' },
    affiliateCommission: { type: Number, default: 0 },

    deliveredAt:  { type: Date },
    cancelledAt:  { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

// ✅ No next() — modern Mongoose handles async pre-hooks via returned promise
orderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `57AC${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
});

orderSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

module.exports = mongoose.model('Order', orderSchema);