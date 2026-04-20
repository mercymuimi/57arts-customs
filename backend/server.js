require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const authRoutes      = require('./routes/authRoutes');
const productRoutes   = require('./routes/productRoutes');
const aiRoutes        = require('./routes/aiRoutes');
const orderRoutes     = require('./routes/orderRoutes');
const vendorRoutes    = require('./routes/vendorRoutes');
const affiliateRoutes = require('./routes/affiliateRoutes');
const reviewRoutes    = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB connection failed:', err.message));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/ai',         aiRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/vendors',    vendorRoutes);
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to 57 Arts & Customs API!' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));