require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User   = require('./models/User');
  const Vendor = require('./models/Vendor');

  const users   = await User.find({ role: 'vendor' });
  const vendors = await Vendor.find().populate('user', 'name email');

  console.log('\n=== USERS WITH VENDOR ROLE ===');
  if (users.length === 0) console.log('None found');
  users.forEach(u => console.log(`  - ${u.name} (${u.email}) | role: ${u.role}`));

  console.log('\n=== VENDOR PROFILES ===');
  if (vendors.length === 0) console.log('None found');
  vendors.forEach(v => console.log(`  - Store: ${v.storeName} | User: ${v.user?.email} | Category: ${v.category}`));

  console.log('\n=== ALL USERS ===');
  const all = await User.find().select('name email role');
  all.forEach(u => console.log(`  - ${u.name} (${u.email}) | role: ${u.role}`));

  process.exit(0);
}).catch(err => { console.error(err.message); process.exit(1); });