const express = require('express');
const router = express.Router();
const {
  addReview,
  getProductReviews,
  markHelpful,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/:productId', getProductReviews);         // public
router.post('/', protect, addReview);                  // buyer only
router.put('/:id/helpful', protect, markHelpful);      // any logged in user
router.delete('/:id', protect, deleteReview);          // owner or admin

module.exports = router;