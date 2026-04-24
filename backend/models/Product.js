const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor:        { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: false },
  name:          { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  price:         { type: Number, required: true },
  originalPrice: { type: Number },
  category:      { type: String, required: true, enum: ['Fashion', 'Furniture', 'Beads', 'Antiques'] },
  slug:          { type: String, required: true, unique: true, lowercase: true },
  tag:           { type: String, enum: ['Hot', 'New', 'Limited', 'Custom', 'Featured'] },
  images:        [{ type: String }],
  rating:        { type: Number, default: 4.5, min: 0, max: 5 },
  numReviews:    { type: Number, default: 0 },
  sizes:         [{ type: String }],
  materials:     [{ type: String }],
  deliveryTime:  { type: String, default: '3-5 Business Days' },
  customizationOptions: { colors: [String], sizes: [String] },
  inStock:       { type: Boolean, default: true },
  stock:         { type: Number, default: 0, min: 0 },
  status:        { type: String, enum: ['active', 'out_of_stock', 'draft'], default: 'active' },
  featured:      { type: Boolean, default: false },
  trending:      { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ category: 1 });
// ❌ REMOVED: productSchema.index({ slug: 1 }) — slug already indexed via unique:true

module.exports = mongoose.model('Product', productSchema);
