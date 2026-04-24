const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  storeDescription: {
    type: String,
    default: ''
  },
  storeLogo: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['fashion', 'furniture', 'antiques'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // ✅ FIX: Added isApproved and status — these were missing from the schema,
  // causing Mongoose to silently strip them on every findByIdAndUpdate call.
  isApproved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'pending'
  },
  totalSales: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);