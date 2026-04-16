require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

const PRODUCTS = [
  {
    name: 'Obsidian Throne v.2', slug: 'obsidian-throne-v2',
    description: 'A sculptural masterpiece blending Scandinavian minimalism with African heritage motifs. Hand-carved from sustainably sourced wood by our master craftsmen.',
    price: 12000, originalPrice: 15000, category: 'Furniture', tag: 'Custom',
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'],
    rating: 4.9, reviews: 87,
    sizes: ['Standard', 'Custom Dimensions'],
    materials: ['Sustainably Sourced Hardwood', 'Hand-tooled Leather', 'Brass Hardware'],
    deliveryTime: '3-4 Weeks',
    customizationOptions: { colors: ['Ebony', 'Walnut', 'Natural'], sizes: ['Standard', 'Custom'] },
    inStock: true, featured: true, trending: false,
  },
  {
    name: 'Midnight Denim Jacket', slug: 'midnight-denim-jacket',
    description: 'Hand-painted Limited Edition jacket. Each piece is uniquely hand-distressed and painted by our master artisans. No two pieces are identical.',
    price: 1500, originalPrice: 2200, category: 'Fashion', tag: 'Limited',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
    rating: 4.8, reviews: 143,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    materials: ['14oz Selvedge Denim', 'Natural Indigo Dye', 'Hand-painted Accents'],
    deliveryTime: '3-5 Business Days',
    customizationOptions: { colors: ['Midnight Blue', 'Classic Blue', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    inStock: true, featured: true, trending: false,
  },
  {
    name: 'Gold Pulse Beads', slug: 'gold-pulse-beads',
    description: 'Ancestral-inspired beadwork featuring genuine obsidian stones infused with 18k gold accents. Each strand is hand-threaded using traditional techniques.',
    price: 2500, originalPrice: 3200, category: 'Beads', tag: 'New',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
    rating: 5.0, reviews: 214,
    sizes: ['16"', '18"', '20"', '24"', 'Custom'],
    materials: ['Genuine Obsidian Stone', '18k Gold Accents', 'Silk Thread'],
    deliveryTime: '5-7 Business Days',
    customizationOptions: { colors: ['Gold', 'Silver', 'Rose Gold'], sizes: ['16"', '18"', '20"', '24"'] },
    inStock: true, featured: true, trending: false,
  },
  {
    name: 'Monarch Carry-all', slug: 'monarch-carry-all',
    description: 'A statement tote crafted from full-grain vegetable-tanned leather. Ages beautifully with use, developing a unique patina.',
    price: 2000, originalPrice: 2800, category: 'Fashion', tag: 'Hot',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
    rating: 4.8, reviews: 93,
    sizes: ['Small', 'Medium', 'Large'],
    materials: ['Full-grain Leather', 'Brass Hardware', 'Suede Lining'],
    deliveryTime: '1-2 Weeks',
    customizationOptions: { colors: ['Tan', 'Brown', 'Black', 'Burgundy'], sizes: ['Small', 'Medium', 'Large'] },
    inStock: true, featured: true, trending: true,
  },
  {
    name: 'Distressed Denim Trouser', slug: 'distressed-denim-trouser',
    description: 'Artisanal hand-distressed denim trousers. Each pair tells a unique story through custom distressing patterns.',
    price: 3000, originalPrice: 4000, category: 'Fashion', tag: 'Hot',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
    rating: 4.7, reviews: 178,
    sizes: ['28', '30', '32', '34', '36', '38'],
    materials: ['14oz Selvedge Denim', 'Hand-distressed Finish', 'Copper Rivets'],
    deliveryTime: '3-5 Business Days',
    customizationOptions: { colors: ['Classic Blue', 'Dark Wash', 'Black'], sizes: ['28', '30', '32', '34', '36', '38'] },
    inStock: true, featured: false, trending: true,
  },
  {
    name: 'Vanguard Teak Chair', slug: 'vanguard-teak-chair',
    description: 'Hand-carved from sustainably sourced teak wood. Blends Scandinavian minimalism with African heritage motifs.',
    price: 12000, originalPrice: 15000, category: 'Furniture', tag: 'Custom',
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'],
    rating: 4.8, reviews: 67,
    sizes: ['Standard', 'Custom Dimensions'],
    materials: ['Sustainably Sourced Teak', 'Hand-tooled Leather', 'Brass Hardware'],
    deliveryTime: '3-4 Weeks',
    customizationOptions: { colors: ['Natural Teak', 'Dark Teak', 'Ebony'], sizes: ['Standard', 'Custom'] },
    inStock: true, featured: false, trending: true,
  },
  {
    name: 'Gold-Infused Obsidian Beads', slug: 'gold-infused-obsidian-beads',
    description: 'Heritage beadwork with genuine obsidian stones and 18k gold. Hand-threaded by heritage artisans using ancestral techniques.',
    price: 2500, originalPrice: 3100, category: 'Beads', tag: 'New',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
    rating: 5.0, reviews: 256,
    sizes: ['16"', '18"', '20"', '24"', 'Custom'],
    materials: ['Genuine Obsidian', '18k Gold', 'Silk Thread', 'Sterling Silver'],
    deliveryTime: '5-7 Business Days',
    customizationOptions: { colors: ['Gold', 'Silver', 'Rose Gold'], sizes: ['16"', '18"', '20"', '24"'] },
    inStock: true, featured: false, trending: true,
  },
  {
    name: 'Midnight Velvet Blazer', slug: 'midnight-velvet-blazer',
    description: 'Ultra-luxe velvet blazer for the modern auteur. Features hand-sewn lapels and heritage-inspired embroidery on inner cuffs.',
    price: 2000, originalPrice: 2800, category: 'Fashion', tag: 'Limited',
    images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800'],
    rating: 4.9, reviews: 156,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    materials: ['Italian Velvet', 'Custom Silk Lining', 'Hand-sewn Buttonholes', 'Horn Buttons'],
    deliveryTime: '3-5 Business Days',
    customizationOptions: { colors: ['Midnight Black', 'Deep Navy', 'Forest Green'], sizes: ['XS', 'S', 'M', 'L', 'XL'] },
    inStock: true, featured: false, trending: true,
  },
  {
    name: 'Kente Print Hoodie', slug: 'kente-print-hoodie',
    description: 'Inspired by vibrant Kente cloth patterns, merging street culture with African heritage. Premium fleece with custom Kente-inspired prints.',
    price: 3500, originalPrice: 4500, category: 'Fashion', tag: 'New',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'],
    rating: 4.6, reviews: 89,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    materials: ['Premium Fleece', 'Kente-inspired Print', 'Ribbed Cuffs'],
    deliveryTime: '2-4 Business Days',
    customizationOptions: { colors: ['Gold/Green', 'Red/Gold', 'Blue/Gold'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    inStock: true, featured: false, trending: false,
  },
  {
    name: 'Ankara Accent Stool', slug: 'ankara-accent-stool',
    description: 'Accent stool upholstered in authentic Ankara fabric on a solid wood frame. A statement piece for any African-modern interior.',
    price: 8500, originalPrice: 11000, category: 'Furniture', tag: 'Custom',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
    rating: 4.7, reviews: 54,
    sizes: ['Standard Height', 'Counter Height'],
    materials: ['Solid Wood Frame', 'Authentic Ankara Fabric', 'High-density Foam'],
    deliveryTime: '1-2 Weeks',
    customizationOptions: { colors: ['Blue Ankara', 'Red Ankara', 'Green Ankara'], sizes: ['Standard', 'Counter Height'] },
    inStock: true, featured: false, trending: false,
  },
  {
    name: 'Heritage Cowrie Necklace', slug: 'heritage-cowrie-necklace',
    description: 'Stunning cowrie shell necklace inspired by ancestral African adornment. Each shell is ethically sourced and hand-selected.',
    price: 1800, originalPrice: 2400, category: 'Beads', tag: 'Hot',
    images: ['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800'],
    rating: 4.9, reviews: 312,
    sizes: ['One Size', 'Custom Length'],
    materials: ['Natural Cowrie Shells', 'Gold-plated Clasps', 'Waxed Cotton Thread'],
    deliveryTime: '3-5 Business Days',
    customizationOptions: { colors: ['Natural', 'Gold-dipped', 'Black-dipped'], sizes: ['16"', '18"', '20"', 'Custom'] },
    inStock: true, featured: false, trending: false,
  },
  {
    name: 'Woven Leather Sandals', slug: 'woven-leather-sandals',
    description: 'Handcrafted woven leather sandals using traditional African weaving techniques. Vegetable-tanned leather that molds to your foot.',
    price: 4500, originalPrice: 5800, category: 'Fashion', tag: 'Limited',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'],
    rating: 4.6, reviews: 127,
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    materials: ['Vegetable-tanned Leather', 'Hand-woven Straps', 'Rubber Sole', 'Brass Buckles'],
    deliveryTime: '1-2 Weeks',
    customizationOptions: { colors: ['Tan', 'Brown', 'Black'], sizes: ['36-45'] },
    inStock: true, featured: false, trending: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑  Cleared existing products');

    const inserted = await Product.insertMany(PRODUCTS);
    console.log(`\n🌱 Seeded ${inserted.length} products:\n`);

    ['Fashion', 'Furniture', 'Beads'].forEach(cat => {
      const count = inserted.filter(p => p.category === cat).length;
      console.log(`   ${cat}: ${count} products`);
    });

    console.log('\n✨ Database ready!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();