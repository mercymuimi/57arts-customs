const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProduct
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/add', authMiddleware, addProduct);

module.exports = router;