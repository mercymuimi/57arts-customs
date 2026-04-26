const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      enum: ['fashion', 'furniture', 'beads'],
    },
    categoryLabel: { type: String },
    vision:        { type: String, required: true },
    materials:     [{ type: String }],
    filesCount:    { type: Number, default: 0 },
    aiRender:      { type: String, default: null },
    aiProvider:    { type: String, default: null },
    timeline:      { type: String, default: null },
    basePrice:     { type: String, default: null },
    orderStatus: {
      type: String,
      enum: ['pending', 'quoted', 'approved', 'in_progress', 'delivered', 'cancelled'],
      default: 'pending',
    },
    quotedPrice: { type: Number, default: null },
    adminNotes:  { type: String, default: null },
  },
  { timestamps: true }
);

// ── NOTE: orderNumber is generated in the controller to avoid pre-save hook issues ──

module.exports = mongoose.model('CustomOrder', customOrderSchema);