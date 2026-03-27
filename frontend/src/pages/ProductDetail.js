import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const products = {
  'distressed-artisanal-denim': {
    name: 'Distressed Artisanal Denim',
    price: '$450',
    originalPrice: '$600',
    desc: 'Hand-painted Limited Edition',
    category: 'Fashion',
    tag: 'CUSTOM ORDER',
    details: 'Each piece is uniquely hand-distressed and painted by our master artisans. No two pieces are identical. Made from premium 14oz selvedge denim sourced from heritage mills.',
    materials: ['14oz Selvedge Denim', 'Natural Indigo Dye', 'Hand-painted Accents', 'YKK Zippers'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    deliveryTime: '3-5 Business Days',
    rating: 4.9,
    reviews: 128,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    ],
    related: [
      { name: 'Midnight Velvet Blazer', price: '$590', img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300', path: '/product/midnight-velvet-blazer' },
      { name: 'Linen Riviera Set', price: '$320', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300', path: '/product/linen-riviera-set' },
      { name: 'Monarch Carry-all', price: '$780', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300', path: '/product/monarch-carry-all' },
    ],
  },
  'linen-riviera-set': {
    name: 'Linen Riviera Set',
    price: '$320',
    originalPrice: '$400',
    desc: 'Heritage Collection',
    category: 'Fashion',
    tag: 'READY-MADE',
    details: 'A sophisticated two-piece linen ensemble inspired by the old money aesthetic. Lightweight, breathable, and effortlessly elegant for any occasion.',
    materials: ['100% Belgian Linen', 'Mother of Pearl Buttons', 'Silk Lining'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    deliveryTime: '2-4 Business Days',
    rating: 4.7,
    reviews: 89,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    ],
    related: [
      { name: 'Distressed Artisanal Denim', price: '$450', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300', path: '/product/distressed-artisanal-denim' },
      { name: 'Midnight Velvet Blazer', price: '$590', img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300', path: '/product/midnight-velvet-blazer' },
    ],
  },
  'gold-infused-obsidian-beads': {
    name: 'Gold-Infused Obsidian Beads',
    price: '$185',
    originalPrice: '$220',
    desc: 'Hand-threaded Jewelry',
    category: 'Beads',
    tag: 'ARTISANAL',
    details: 'Ancestral-inspired beadwork featuring genuine obsidian stones infused with 18k gold accents. Each strand is hand-threaded by our heritage artisans using traditional techniques passed down through generations.',
    materials: ['Genuine Obsidian Stone', '18k Gold Accents', 'Silk Thread', 'Sterling Silver Clasp'],
    sizes: ['16"', '18"', '20"', '24"', 'Custom'],
    deliveryTime: '5-7 Business Days',
    rating: 5.0,
    reviews: 214,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
    ],
    related: [
      { name: 'Royal Ancestral Set', price: '$195', img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=300', path: '/product/traditional-bead-set' },
    ],
  },
  'vanguard-teak-chair': {
    name: 'Vanguard Teak Chair',
    price: '$1,200',
    originalPrice: '$1,500',
    desc: 'Bespoke Furniture Line',
    category: 'Furniture',
    tag: 'CUSTOM ORDER',
    details: 'A sculptural masterpiece blending Scandinavian minimalism with African heritage motifs. Hand-carved from sustainably sourced teak wood by our master craftsmen.',
    materials: ['Sustainably Sourced Teak', 'Hand-tooled Leather', 'Brass Hardware', 'Natural Oils Finish'],
    sizes: ['Standard', 'Custom Dimensions'],
    deliveryTime: '3-4 Weeks',
    rating: 4.8,
    reviews: 67,
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    ],
    related: [
      { name: 'Obsidian Throne Chair', price: '$850', img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300', path: '/product/the-sculptor-chair' },
    ],
  },
  'midnight-velvet-blazer': {
    name: 'Midnight Velvet Blazer',
    price: '$590',
    originalPrice: '$750',
    desc: 'Premium After-hours Wear',
    category: 'Fashion',
    tag: 'LIMITED',
    details: 'An ultra-luxe velvet blazer designed for the modern auteur. Features hand-sewn lapels, custom lining, and heritage-inspired embroidery on the inner cuffs.',
    materials: ['Italian Velvet', 'Custom Silk Lining', 'Hand-sewn Buttonholes', 'Horn Buttons'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    deliveryTime: '3-5 Business Days',
    rating: 4.9,
    reviews: 156,
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    ],
    related: [
      { name: 'Linen Riviera Set', price: '$320', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300', path: '/product/linen-riviera-set' },
      { name: 'Monarch Carry-all', price: '$780', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300', path: '/product/monarch-carry-all' },
    ],
  },
  'monarch-carry-all': {
    name: 'Monarch Carry-all',
    price: '$780',
    originalPrice: '$950',
    desc: 'Full-grain Leather Accessory',
    category: 'Fashion',
    tag: 'BESPOKE ONLY',
    details: 'A statement tote crafted from full-grain vegetable-tanned leather. Ages beautifully with use, developing a unique patina that tells your personal story.',
    materials: ['Full-grain Vegetable-tanned Leather', 'Brass Hardware', 'Suede Lining', 'Hand-stitched Edges'],
    sizes: ['Small', 'Medium', 'Large'],
    deliveryTime: '1-2 Weeks',
    rating: 4.8,
    reviews: 93,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    ],
    related: [
      { name: 'Midnight Velvet Blazer', price: '$590', img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300', path: '/product/midnight-velvet-blazer' },
    ],
  },
  'handcrafted-stool': {
    name: 'Handcrafted Stool',
    price: '$450',
    originalPrice: '$550',
    desc: 'Artisanal Furniture Piece',
    category: 'Furniture',
    tag: 'READY-MADE',
    details: 'A beautifully crafted stool made from reclaimed wood with hand-forged iron legs. Perfect for both functional use and as a statement art piece.',
    materials: ['Reclaimed Oak Wood', 'Hand-forged Iron', 'Beeswax Finish'],
    sizes: ['Standard Height', 'Counter Height', 'Bar Height'],
    deliveryTime: '1-2 Weeks',
    rating: 4.6,
    reviews: 45,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
    ],
    related: [
      { name: 'Vanguard Teak Chair', price: '$1,200', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300', path: '/product/vanguard-teak-chair' },
    ],
  },
  'traditional-bead-set': {
    name: 'Traditional Bead Set',
    price: '$120',
    originalPrice: '$150',
    desc: 'Heritage Jewelry Collection',
    category: 'Beads',
    tag: 'ARTISANAL',
    details: 'A complete traditional bead set handcrafted using ancestral techniques. Includes necklace, bracelet and earrings made from ethically sourced natural stones.',
    materials: ['Natural Stones', 'Gold-plated Clasps', 'Waxed Cotton Thread'],
    sizes: ['One Size', 'Custom Fit'],
    deliveryTime: '3-5 Business Days',
    rating: 4.9,
    reviews: 178,
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    ],
    related: [
      { name: 'Gold-Infused Obsidian Beads', price: '$185', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300', path: '/product/gold-infused-obsidian-beads' },
    ],
  },
  'the-sculptor-chair': {
    name: 'The Sculptor Chair',
    price: '$600',
    originalPrice: '$800',
    desc: 'Statement Furniture Art',
    category: 'Furniture',
    tag: 'LIMITED',
    details: 'A sculptural lounge chair that doubles as a work of art. Designed by our lead artisan with flowing organic curves inspired by natural forms.',
    materials: ['Solid Walnut', 'Premium Foam', 'Boucle Fabric', 'Brass Feet'],
    sizes: ['One Size'],
    deliveryTime: '2-3 Weeks',
    rating: 4.7,
    reviews: 52,
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    ],
    related: [
      { name: 'Vanguard Teak Chair', price: '$1,200', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300', path: '/product/vanguard-teak-chair' },
      { name: 'Handcrafted Stool', price: '$450', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300', path: '/product/handcrafted-stool' },
    ],
  },
  'kente-bead-stack': {
    name: 'Kente Bead Stack',
    price: '$85',
    originalPrice: '$110',
    desc: 'Modern African Heritage',
    category: 'Beads',
    tag: 'READY-MADE',
    details: 'Inspired by the vibrant patterns of Kente cloth, this bead stack brings bold color and cultural heritage to your everyday wear.',
    materials: ['Glass Beads', 'Recycled Brass', 'Elastic Cord'],
    sizes: ['XS', 'S/M', 'L/XL', 'Custom'],
    deliveryTime: '2-4 Business Days',
    rating: 4.5,
    reviews: 203,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
    ],
    related: [
      { name: 'Traditional Bead Set', price: '$120', img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=300', path: '/product/traditional-bead-set' },
    ],
  },
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`text-sm ${star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products[slug];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white"
        style={{ backgroundColor: '#1a1500' }}>
        <p className="text-6xl mb-4">😕</p>
        <h2 className="text-2xl font-black mb-2">Product Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">This product may have been removed.</p>
        <div className="flex gap-4">
          <Link to="/shop"
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black hover:bg-yellow-500 transition">
            Browse Shop
          </Link>
          <Link to="/"
            className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-xl font-black hover:bg-yellow-400 hover:text-black transition">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const discount = product.originalPrice
    ? Math.round((1 - parseInt(product.price.replace('$', '').replace(',', '')) /
        parseInt(product.originalPrice.replace('$', '').replace(',', ''))) * 100)
    : 0;

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* BREADCRUMB */}
      <div style={{ backgroundColor: '#1a1a00' }}
        className="border-b border-gray-800 px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide">
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <span>›</span>
          <Link to="/shop" className="hover:text-yellow-400 transition">Shop</Link>
          <span>›</span>
          <Link to={`/${product.category.toLowerCase()}`}
            className="hover:text-yellow-400 transition">{product.category}</Link>
          <span>›</span>
          <span className="text-yellow-400 truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* MAIN PRODUCT SECTION */}
        <div className="grid grid-cols-2 gap-12 mb-16">

          {/* LEFT - IMAGE GALLERY */}
          <div className="space-y-4">

            {/* Main Image */}
            <div
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              style={{ height: '500px', backgroundColor: '#2a2000' }}
              onClick={() => navigate(`/product/${slug}`)}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />

              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute top-5 left-5 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full">
                  -{discount}% OFF
                </div>
              )}

              {/* Tag badge */}
              {product.tag && (
                <div className="absolute top-5 right-5 bg-yellow-400 text-black text-xs font-black px-3 py-1.5 rounded-full">
                  {product.tag}
                </div>
              )}

              {/* Image counter */}
              <div className="absolute bottom-5 right-5 bg-black bg-opacity-60 text-white text-xs font-black px-3 py-1 rounded-full">
                {selectedImage + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className="flex-1 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
                    style={{
                      height: '100px',
                      border: selectedImage === index
                        ? '2px solid #FFD700'
                        : '2px solid transparent',
                      opacity: selectedImage === index ? 1 : 0.5,
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: '🔒', text: 'Secure Payment' },
                { icon: '✦', text: 'Authenticity Cert.' },
                { icon: '↩', text: '14-Day Returns' },
              ].map(badge => (
                <div key={badge.text}
                  className="flex flex-col items-center gap-1 py-3 rounded-xl border border-gray-800"
                  style={{ backgroundColor: '#1a1a00' }}>
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-gray-400 text-xs font-semibold">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - PRODUCT INFO */}
          <div className="flex flex-col">

            {/* Category + Rating */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-yellow-600 text-xs font-black uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} />
                <span className="text-yellow-400 font-black text-sm">{product.rating}</span>
                <span className="text-gray-500 text-xs">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-4xl font-black uppercase leading-tight mb-2">
              {product.name}
            </h1>
            <p className="text-gray-400 text-sm mb-5">{product.desc}</p>

            {/* Price */}
            <div
              className="flex items-center gap-4 p-4 rounded-2xl mb-5"
              style={{ backgroundColor: '#2a2000' }}
            >
              <span className="text-yellow-400 font-black text-4xl">{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-gray-600 line-through text-xl">{product.originalPrice}</span>
                  <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
                    SAVE {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-2 mb-5 text-sm">
              <span className="text-green-400">🚚</span>
              <span className="text-green-400 font-semibold">Free Delivery</span>
              <span className="text-gray-500">• Est. {product.deliveryTime}</span>
            </div>

            {/* Size Selection */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-white font-black text-xs uppercase tracking-widest">
                  Select Size / Variant
                </p>
                <button className="text-yellow-400 text-xs hover:underline">Size Guide →</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-black transition border-2 ${
                      selectedSize === size
                        ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 text-yellow-400'
                        : 'border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-white font-black text-xs uppercase tracking-widest mb-3">
                Quantity
              </p>
              <div className="flex items-center gap-3 w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl border-2 border-gray-700 text-white hover:border-yellow-400 hover:text-yellow-400 transition font-black text-xl"
                >
                  −
                </button>
                <span className="text-white font-black text-xl w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 rounded-xl border-2 border-gray-700 text-white hover:border-yellow-400 hover:text-yellow-400 transition font-black text-xl"
                >
                  +
                </button>
                <span className="text-gray-500 text-sm ml-2">
                  Total: <span className="text-yellow-400 font-black">
                    ${(parseInt(product.price.replace('$', '').replace(',', '')) * quantity).toLocaleString()}
                  </span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wide transition flex items-center justify-center gap-2 ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-400 text-black hover:bg-yellow-500'
                }`}
              >
                {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wide border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition flex items-center justify-center gap-2"
              >
                ⚡ Buy Now
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-14 rounded-2xl border-2 flex items-center justify-center text-xl transition ${
                  wishlisted
                    ? 'border-red-400 bg-red-400 bg-opacity-20 text-red-400'
                    : 'border-gray-700 text-gray-400 hover:border-red-400 hover:text-red-400'
                }`}
              >
                {wishlisted ? '♥' : '♡'}
              </button>
            </div>

            {/* Custom Order CTA */}
            <div
              className="rounded-2xl p-4 border border-yellow-900 flex items-center justify-between"
              style={{ backgroundColor: '#2a2000' }}
            >
              <div>
                <p className="text-yellow-400 text-xs font-black flex items-center gap-1">
                  ✦ Want this customized?
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Bespoke version tailored to your exact specs
                </p>
              </div>
              <Link
                to="/custom-order"
                className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-black text-xs hover:bg-yellow-500 transition flex-shrink-0 ml-4"
              >
                Customize →
              </Link>
            </div>
          </div>
        </div>

        {/* TABS SECTION */}
        <div className="mb-16">
          <div className="flex gap-1 border-b border-gray-800 mb-6">
            {[
              { key: 'description', label: 'Description' },
              { key: 'materials', label: 'Materials & Care' },
              { key: 'shipping', label: 'Shipping & Returns' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 font-black text-sm transition border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? 'text-yellow-400 border-yellow-400'
                    : 'text-gray-500 border-transparent hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="rounded-2xl p-6 border border-gray-800"
            style={{ backgroundColor: '#1a1a00' }}
          >
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-300 leading-relaxed text-sm mb-4">{product.details}</p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { icon: '🎨', label: 'Hand-crafted', desc: 'Made by master artisans' },
                    { icon: '🌿', label: 'Sustainable', desc: 'Ethically sourced materials' },
                    { icon: '✦', label: 'Certified', desc: 'Certificate of authenticity' },
                  ].map(item => (
                    <div key={item.label}
                      className="rounded-xl p-4 border border-gray-800 text-center"
                      style={{ backgroundColor: '#2a2000' }}>
                      <span className="text-2xl block mb-2">{item.icon}</span>
                      <p className="text-white font-black text-xs">{item.label}</p>
                      <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div>
                <p className="text-gray-400 text-sm mb-5">Premium materials sourced from ethical suppliers worldwide.</p>
                <div className="grid grid-cols-2 gap-3">
                  {product.materials.map((mat, i) => (
                    <div key={mat}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-800"
                      style={{ backgroundColor: '#2a2000' }}>
                      <span className="text-yellow-400 font-black text-sm">0{i + 1}</span>
                      <span className="text-white text-sm">{mat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                {[
                  { icon: '🚚', title: 'Free Delivery', desc: `Estimated delivery: ${product.deliveryTime}` },
                  { icon: '📦', title: 'Secure Packaging', desc: 'Every piece is packed with archival materials to ensure safe delivery.' },
                  { icon: '↩', title: '14-Day Returns', desc: 'Not satisfied? Return within 14 days for a full refund.' },
                  { icon: '🌍', title: 'Worldwide Shipping', desc: 'We ship to over 50 countries with tracked delivery.' },
                ].map(item => (
                  <div key={item.title}
                    className="flex items-start gap-4 p-4 rounded-xl border border-gray-800"
                    style={{ backgroundColor: '#2a2000' }}>
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-white font-black text-sm">{item.title}</p>
                      <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {product.related && product.related.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-1">
                  More Like This
                </p>
                <h2 className="text-2xl font-black uppercase">You May Also Like</h2>
              </div>
              <Link to="/shop"
                className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-xl font-black text-xs hover:bg-yellow-400 hover:text-black transition">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {product.related.map(rel => (
                <div
                  key={rel.name}
                  onClick={() => {
                    navigate(rel.path);
                    setSelectedImage(0);
                    setSelectedSize('');
                    setQuantity(1);
                    window.scrollTo(0, 0);
                  }}
                  className="group cursor-pointer"
                >
                  <div
                    className="rounded-2xl overflow-hidden mb-3 border border-gray-800"
                    style={{ height: '220px', backgroundColor: '#2a2000' }}
                  >
                    <img
                      src={rel.img}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <p className="text-white font-black text-sm group-hover:text-yellow-400 transition">
                    {rel.name}
                  </p>
                  <p className="text-yellow-400 font-black text-sm mt-1">{rel.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0d0d00' }}
        className="border-t border-yellow-900 px-8 py-10 mt-16">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
            <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/shop" className="hover:text-yellow-400 transition">Shop</Link>
            <Link to="/fashion" className="hover:text-yellow-400 transition">Fashion</Link>
            <Link to="/furniture" className="hover:text-yellow-400 transition">Furniture</Link>
            <Link to="/beads" className="hover:text-yellow-400 transition">Beads</Link>
            <Link to="/custom-order" className="hover:text-yellow-400 transition">Custom Orders</Link>
          </div>
          <p className="text-gray-600 text-xs">© 2024 57 Arts & Customs.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;