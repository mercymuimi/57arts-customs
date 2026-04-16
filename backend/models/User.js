const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },

  // ✅ Unified roles — removed duplicate 'customer', kept 'buyer' as default
  role: {
    type: String,
    enum: ['buyer', 'vendor', 'affiliate', 'admin'],
    default: 'buyer',
  },

  phone: {
    type: String,
    default: '',
  },

  address: {
    street:  { type: String, default: '' },
    city:    { type: String, default: '' },
    country: { type: String, default: '' },
  },

  profileImage: {
    type: String,
    default: '',
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Method to compare passwords at login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);