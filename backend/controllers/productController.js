const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

// Helper to generate slug
const generateSlug = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const generateUniqueSlug = async (name, excludeId = null) => {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).select('_id');

    if (!existing) return slug;

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
};

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, featured, trending, search, vendor, limit = 20, page = 1 } = req.query;
    const filter = {};

    // ✅ Only filter inStock if not fetching by vendor (vendor wants to see all their products)
    if (!vendor) filter.inStock = true;

    if (category) filter.category = { $regex: new RegExp(category, 'i') };
    if (featured === 'true') filter.featured = true;
    if (trending === 'true') filter.trending = true;
    if (search)  filter.name = { $regex: new RegExp(search, 'i') };
    if (vendor)  filter.vendor = vendor;

    const skip  = (parseInt(page) - 1) * parseInt(limit);
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
      page:    parseInt(page),
      pages:   Math.ceil(total / parseInt(limit)),
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
      inStock, featured, trending, stock, status,
    } = req.body;

    const vendorProfile = await Vendor.findOne({ user: req.user.id });
    if (!vendorProfile) {
      return res.status(404).json({ success: false, error: 'Vendor profile not found' });
    }

    const slug = await generateUniqueSlug(name);

    const product = await Product.create({
      vendor: vendorProfile._id,
      name, description, price,
      originalPrice: originalPrice || price,
      category, tag, images: images || [],
      sizes:       sizes       || [],
      materials:   materials   || [],
      deliveryTime: deliveryTime || '3-5 Business Days',
      customizationOptions: customizationOptions || { colors: [], sizes: [] },
      inStock: inStock !== undefined ? inStock : true,
      stock:   stock   || 0,
      status:  status  || 'active',
      featured: featured || false,
      trending: trending || false,
      slug,
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

    const vendorProfile = await Vendor.findOne({ user: req.user.id });

    // Only the owning vendor (or admin) can update
    if (product.vendor?.toString() !== vendorProfile?._id?.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    // ✅ Regenerate slug if name changed
    const updateData = { ...req.body };
    if (req.body.name) {
      updateData.slug = await generateUniqueSlug(req.body.name, req.params.id);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true,
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

    const vendorProfile = await Vendor.findOne({ user: req.user.id });

    if (product.vendor?.toString() !== vendorProfile?._id?.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
