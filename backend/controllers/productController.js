const Product = require('../models/Product');

// Helper to generate slug
const generateSlug = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, featured, trending, search, limit = 20, page = 1 } = req.query;
    const filter = { inStock: true };

    if (category) filter.category = { $regex: new RegExp(category, 'i') };
    if (featured === 'true') filter.featured = true;
    if (trending === 'true') filter.trending = true;
    if (search) filter.name = { $regex: new RegExp(search, 'i') };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('vendor', 'storeName category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/products/featured
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, inStock: true })
      .limit(4).select('-__v');
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/products/trending
exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ trending: true, inStock: true })
      .limit(4).select('-__v');
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/products/:slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('vendor', 'storeName category rating')
      .select('-__v');
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/products (vendor only)
exports.addProduct = async (req, res) => {
  try {
    const {
      name, description, price, originalPrice,
      category, tag, images, sizes, materials,
      deliveryTime, customizationOptions,
      inStock, featured, trending,
    } = req.body;

    const slug = generateSlug(name);

    // Check for duplicate slug
    const existing = await Product.findOne({ slug });
    if (existing) return res.status(400).json({ success: false, error: 'Product name too similar to existing product' });

    const product = await Product.create({
      vendor: req.user.id,
      name, description, price, originalPrice,
      category, tag, images, sizes, materials,
      deliveryTime, customizationOptions,
      inStock, featured, trending, slug,
    });

    res.status(201).json({ success: true, message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/products/:id (vendor only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    // Only the owning vendor can update
    if (product.vendor?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });

    res.json({ success: true, message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/products/:id (vendor only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    if (product.vendor?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};