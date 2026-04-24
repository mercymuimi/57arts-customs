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

  // Email verification
  isEmailVerified: { type: Boolean, default: false },
  emailOTP:        { type: String },
  emailOTPExpires: { type: Date },

  // Password reset
  resetOTP:        { type: String },
  resetOTPExpires: { type: Date },

}, { timestamps: true });

// FIX: use traditional function(next) signature so Mongoose passes next correctly.
// The previous version used async function() with no next parameter — this caused
// saves that didn't modify the password to hang indefinitely because next() was
// never called to advance the middleware chain.
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  if (this.password.startsWith('$2')) return next();

  bcrypt.hash(this.password, 10)
    .then(hashed => {
      this.password = hashed;
      next();
    })
    .catch(next);
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);