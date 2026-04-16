const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: { type: String, maxlength: 100 },
    comment: { type: String, maxlength: 1000 },

    images: [{ type: String }], // URLs of review photos

    // Useful for AI recommendation training
    verified: { type: Boolean, default: false }, // verified purchase
    helpful: { type: Number, default: 0 },       // upvotes from other users
    reported: { type: Boolean, default: false },

    // Vendor reply
    vendorReply: {
      message: { type: String },
      repliedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// After saving a review, update the product's average rating
reviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { product: this.product } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews,
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;