require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

const PRODUCTS = [
  {
    name: 'Obsidian Throne v.2', slug: 'obsidian-throne-v2',
    description: 'A sculptural masterpiece blending Scandinavian minimalism with African heritage motifs. Hand-carved from sustainably sourced wood by our master craftsmen.',
    price: 9500, originalPrice: 10500, category: 'Furniture', tag: 'Custom',
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'],
    rating: 4.9, numReviews: 87,
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
    rating: 4.8, numReviews: 143,
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
    rating: 5.0, numReviews: 214,
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
    rating: 4.8, numReviews: 93,
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
    rating: 4.7, numReviews: 178,
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
    rating: 4.8, numReviews: 67,
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
    rating: 5.0, numReviews: 256,
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
    rating: 4.9, numReviews: 156,
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
    rating: 4.6, numReviews: 89,
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
    rating: 4.7, numReviews: 54,
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
    rating: 4.9, numReviews: 312,
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
    rating: 4.6, numReviews: 127,
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    materials: ['Vegetable-tanned Leather', 'Hand-woven Straps', 'Rubber Sole', 'Brass Buckles'],
    deliveryTime: '1-2 Weeks',
    customizationOptions: { colors: ['Tan', 'Brown', 'Black'], sizes: ['36-45'] },
    inStock: true, featured: false, trending: false,
  },

  // ── 8 NEW PRODUCTS ────────────────────────────────────────────────────────
  {
    name: 'Maasai Bead Bracelet Set', slug: 'maasai-bead-bracelet-set',
    description: 'A vibrant set of 5 handcrafted Maasai-inspired beaded bracelets. Made using traditional colour codes that carry cultural meaning and heritage.',
    price: 1200, originalPrice: 1800, category: 'Beads', tag: 'New',
    images: ['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800'],
    rating: 4.8, numReviews: 203,
    sizes: ['One Size', 'Custom'],
    materials: ['Glass Seed Beads', 'Elastic Thread', 'Sterling Silver Clasp'],
    deliveryTime: '3-5 Business Days',
    customizationOptions: { colors: ['Red/Blue/White', 'Green/Gold/Black', 'Pink/Purple/Gold'], sizes: ['One Size', 'Custom'] },
    inStock: true, featured: true, trending: true,
  },
  {
    name: 'Baobab Coffee Table', slug: 'baobab-coffee-table',
    description: 'Inspired by the ancient Baobab tree, this coffee table features a live-edge slab top on hand-forged iron legs. Each piece is one of a kind.',
    price: 28000, originalPrice: 35000, category: 'Furniture', tag: 'Custom',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
    rating: 4.9, numReviews: 41,
    sizes: ['Standard (120cm)', 'Large (150cm)', 'Custom'],
    materials: ['Live-edge Hardwood Slab', 'Hand-forged Iron Legs', 'Natural Oil Finish'],
    deliveryTime: '4-6 Weeks',
    customizationOptions: { colors: ['Natural', 'Dark Stain', 'Ebony'], sizes: ['Standard', 'Large', 'Custom'] },
    inStock: true, featured: true, trending: false,
  },
  {
    name: 'Adire Tie-Dye Shirt', slug: 'adire-tie-dye-shirt',
    description: 'Contemporary oversized shirt made using traditional Yoruba Adire tie-dye technique. Each shirt has a completely unique pattern — truly one of one.',
    price: 2200, originalPrice: 3000, category: 'Fashion', tag: 'New',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'],
    rating: 4.7, numReviews: 118,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    materials: ['100% Cotton', 'Natural Indigo Dye', 'Hand-tied Pattern'],
    deliveryTime: '3-5 Business Days',
    customizationOptions: { colors: ['Indigo Blue', 'Earthy Brown', 'Forest Green'], sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    inStock: true, featured: false, trending: true,
  },
  {
    name: 'Mkeka Woven Wall Art', slug: 'mkeka-woven-wall-art',
    description: 'Large-format woven wall hanging inspired by East African Mkeka mat traditions. Hand-woven with natural sisal and recycled cotton.',
    price: 5500, originalPrice: 7200, category: 'Furniture', tag: 'Hot',
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'],
    rating: 4.8, numReviews: 76,
    sizes: ['60x90cm', '80x120cm', 'Custom'],
    materials: ['Natural Sisal', 'Recycled Cotton Cord', 'Driftwood Dowel'],
    deliveryTime: '1-2 Weeks',
    customizationOptions: { colors: ['Natural/Cream', 'Terracotta/Ivory', 'Black/Gold'], sizes: ['60x90cm', '80x120cm', 'Custom'] },
    inStock: true, featured: false, trending: true,
  },
  {
    name: 'Zulu Beaded Earrings', slug: 'zulu-beaded-earrings',
    description: 'Statement earrings crafted in the Zulu beadwork tradition. Lightweight despite their bold presence, featuring geometric patterns in vibrant colours.',
    price: 950, originalPrice: 1400, category: 'Beads', tag: 'Hot',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
    rating: 4.9, numReviews: 287,
    sizes: ['One Size'],
    materials: ['Glass Seed Beads', 'Sterling Silver Hooks', 'Nylon Thread'],
    deliveryTime: '2-4 Business Days',
    customizationOptions: { colors: ['Red/Black/White', 'Blue/Gold/White', 'Green/Orange/Yellow'], sizes: ['One Size'] },
    inStock: true, featured: false, trending: true,
  },
  {
    name: 'Kitenge Print Co-ord Set', slug: 'kitenge-print-coord-set',
    description: 'Matching two-piece set — wide-leg trousers and cropped jacket — in bold East African Kitenge print. Tailored to order by our Nairobi-based artisans.',
    price: 6500, originalPrice: 8500, category: 'Fashion', tag: 'Limited',
    images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800'],
    rating: 4.8, numReviews: 94,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'],
    materials: ['100% Cotton Kitenge', 'Satin Lining', 'Custom Buttons'],
    deliveryTime: '1-2 Weeks',
    customizationOptions: { colors: ['Blue Kitenge', 'Orange Kitenge', 'Green Kitenge'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'] },
    inStock: true, featured: true, trending: true,
  },
  {
    name: 'Ebony Chess Set', slug: 'ebony-chess-set',
    description: 'Hand-carved chess set with pieces representing African royalty and warriors. Board inlaid with ebony and maple. A collector\'s heirloom.',
    price: 18500, originalPrice: 24000, category: 'Furniture', tag: 'Custom',
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'],
    rating: 5.0, numReviews: 29,
    sizes: ['Standard (40cm board)'],
    materials: ['African Ebony', 'Maple Wood', 'Brass Inlays'],
    deliveryTime: '4-5 Weeks',
    customizationOptions: { colors: ['Ebony/Maple', 'Walnut/Ash', 'Rosewood/Birch'], sizes: ['Standard'] },
    inStock: true, featured: true, trending: false,
  },
  {
    name: 'Ankara Bucket Hat', slug: 'ankara-bucket-hat',
    description: 'Reversible bucket hat in authentic Ankara fabric on one side and solid cotton twill on the other. Bold, wearable, and handmade in Nairobi.',
    price: 850, originalPrice: 1200, category: 'Fashion', tag: 'Hot',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
    rating: 4.6, numReviews: 341,
    sizes: ['S/M', 'L/XL', 'Custom'],
    materials: ['Authentic Ankara Fabric', 'Cotton Twill', 'Adjustable Drawstring'],
    deliveryTime: '2-4 Business Days',
    customizationOptions: { colors: ['Blue/Gold Ankara', 'Red/Black Ankara', 'Green/Orange Ankara'], sizes: ['S/M', 'L/XL', 'Custom'] },
    inStock: true, featured: false, trending: true,
  },

  // ── TEST PRODUCT — 
  {
    name: 'Test Product (10 Bob)', slug: 'test-product',
    description: 'Cheap test product for payment and order flow testing.',
    price: 10, originalPrice: 10, category: 'Fashion', tag: 'Hot',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
    rating: 5.0, numReviews: 0,
    sizes: ['One Size'],
    materials: ['Test Material'],
    deliveryTime: '1 Business Day',
    customizationOptions: { colors: ['Black'], sizes: ['One Size'] },
    inStock: true, featured: true, trending: true,
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