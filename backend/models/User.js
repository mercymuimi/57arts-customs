const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['buyer', 'vendor', 'affiliate', 'admin'], default: 'buyer' },
  phone:    { type: String, default: '' },
  address: {
    street:  { type: String, default: '' },
    city:    { type: String, default: '' },
    country: { type: String, default: '' },
  },
  profileImage: { type: String, default: '' },
  isActive:     { type: Boolean, default: true },

  isEmailVerified: { type: Boolean, default: false },
  emailOTP:        { type: String },
  emailOTPExpires: { type: Date },

  resetOTP:        { type: String },
  resetOTPExpires: { type: Date },

}, { timestamps: true });

// Mongoose 9: use async with no next parameter.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (this.password.startsWith('$2')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);