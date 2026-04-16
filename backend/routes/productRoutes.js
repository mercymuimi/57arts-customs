const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getProductBySlug,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, vendorOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/:slug', getProductBySlug);

// Vendor protected routes
router.post('/', protect, vendorOnly, addProduct);
router.put('/:id', protect, vendorOnly, updateProduct);
router.delete('/:id', protect, vendorOnly, deleteProduct);

module.exports = router;