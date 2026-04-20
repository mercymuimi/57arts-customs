// Run this ONCE to create your admin account:
// node seedAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  const existing = await User.findOne({ email: 'admin@57arts.com' });
  if (existing) {
    console.log('⚠️  Admin already exists:', existing.email);
    process.exit(0);
  }

  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@57arts.com',
    password: 'Admin@123',   // ← change this after first login!
    role: 'admin',
    isActive: true,
  });

  console.log('✅ Admin created successfully!');
  console.log('   Email:    admin@57arts.com');
  console.log('   Password: Admin@123');
  console.log('   ⚠️  Change the password after first login!');
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});