const Review = require('../models/Review');
const Order = require('../models/Order');

// POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { product, vendor, order, rating, title, comment, images } = req.body;

    // Check for existing review
    const existing = await Review.findOne({ user: req.user._id, product });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    // Check if it's a verified purchase
    let verified = false;
    if (order) {
      const orderDoc = await Order.findOne({
        _id: order,
        user: req.user._id,
        'items.product': product,
        paymentStatus: 'paid',
      });
      verified = !!orderDoc;
    }

    const review = await Review.create({
      user: req.user._id,
      product, vendor, order,
      rating, title, comment, images,
      verified,
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/reviews/:productId
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/reviews/:id/helpful
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    res.json({ success: true, helpful: review.helpful });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};