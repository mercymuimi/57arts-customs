const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    console.log('📩 REGISTER BODY:', req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const allowedRoles = ['buyer', 'vendor', 'affiliate'];
    const assignedRole = allowedRoles.includes(role) ? role : 'buyer';

    const user = new User({ name, email, password, role: assignedRole });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });

  } catch (error) {
    console.error('❌ REGISTER ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    console.log('🔐 LOGIN BODY:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        phone:     user.phone,
        address:   user.address,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });

  } catch (error) {
    console.error('❌ GET PROFILE ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, profileImage, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Handle password change if requested
    if (currentPassword && newPassword) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      // The pre-save hook will hash the new password
      user.password = newPassword;
    }

    // ✅ Update fields only if provided
    if (name)         user.name         = name;
    if (phone)        user.phone        = phone;
    if (address)      user.address      = address;
    if (profileImage) user.profileImage = profileImage;

    await user.save(); // ✅ triggers pre-save hook for password hashing

    res.json({
      success: true,
      message: 'Profile updated',
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        phone:     user.phone,
        address:   user.address,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('❌ UPDATE PROFILE ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};