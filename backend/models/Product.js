const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['fashion', 'furniture', 'antiques'],
    required: true
  },
  images: [
    {
      type: String
    }
  ],
  customizationOptions: {
    colors: [String],
    sizes: [String],
    materials: [String],
    designs: [String]
  },
  stock: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);