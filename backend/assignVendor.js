/**
 * Run this ONCE to link all seeded (vendor-less) products to your vendor account.
 * Usage: node assignVendor.js
 * 
 * It reads your vendor ID from the Vendor collection (first vendor found),
 * or you can paste your vendor _id directly below.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');
const Vendor   = require('./models/Vendor');

async function assignVendor() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected');

  // Find the first vendor (you) — or replace with your actual vendor _id string
  const vendor = await Vendor.findOne({}).sort({ createdAt: 1 });
  if (!vendor) { console.error('❌ No vendor found. Register as a vendor first.'); process.exit(1); }

  console.log(`👤 Assigning to vendor: ${vendor.storeName} (${vendor._id})`);

  // Only update products that have no vendor set
  const result = await Product.updateMany(
    { vendor: { $exists: false } },
    { $set: { vendor: vendor._id } }
  );

  console.log(`✅ Updated ${result.modifiedCount} products`);
  process.exit(0);
}

assignVendor().catch(err => { console.error(err); process.exit(1); });