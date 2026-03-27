const Product = require('../models/product');

// ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const {
      name, description, price,
      category, images, customizationOptions,
      stock, tags
    } = req.body;

    const product = await Product.create({
      vendor: req.user.id,
      name,
      description,
      price,
      category,
      images,
      customizationOptions,
      stock,
      tags
    });

    res.status(201).json({
      message: 'Product added successfully',
      product
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true })
      .populate('vendor', 'storeName category')
      .sort({ createdAt: -1 });

    res.status(200).json({ products });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'storeName category rating');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};