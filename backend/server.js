require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const aiRoutes = require('./routes/aiRoutes');
const orderRoutes = require('./routes/orderRoutes');         // ❌ missing
const vendorRoutes = require('./routes/vendorRoutes');       // ❌ missing
const affiliateRoutes = require('./routes/affiliateRoutes'); // ❌ missing
const reviewRoutes = require('./routes/reviewRoutes');       // ❌ missing

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((error) => console.log('MongoDB connection failed:', error.message));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/orders', orderRoutes);         // ❌ missing
app.use('/api/vendors', vendorRoutes);       // ❌ missing
app.use('/api/affiliates', affiliateRoutes); // ❌ missing
app.use('/api/reviews', reviewRoutes);       // ❌ missing

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to 57 Arts & Customs API!' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});