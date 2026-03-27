import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const allProducts = [
  {
    name: 'Vintage Denim Jacket',
    price: 250,
    desc: 'Heritage Street Wear',
    category: 'Fashion',
    tag: 'LIMITED',
    tagColor: 'bg-yellow-400 text-black',
    img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    slug: 'distressed-artisanal-denim',
  },
  {
    name: 'Raw Silk Polo',
    price: 180,
    desc: 'Old Money Collection',
    category: 'Fashion',
    tag: '',
    tagColor: '',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    slug: 'linen-riviera-set',
  },
  {
    name: 'Handcrafted Stool',
    price: 450,
    desc: 'Artisanal Furniture',
    category: 'Furniture',
    tag: 'CUSTOM',
    tagColor: 'bg-yellow-400 text-black',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    slug: 'handcrafted-stool',
  },
  {
    name: 'Traditional Bead Set',
    price: 120,
    desc: 'Heritage Jewelry',
    category: 'Beads',
    tag: '',
    tagColor: '',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    slug: 'traditional-bead-set',
  },
  {
    name: 'The Sculptor Chair',
    price: 600,
    desc: 'Statement Furniture Art',
    category: 'Furniture',
    tag: 'BESPOKE',
    tagColor: 'bg-yellow-400 text-black',
    img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400',
    slug: 'the-sculptor-chair',
  },
  {
    name: 'Kente Bead Stack',
    price: 85,
    desc: 'Modern African Heritage',
    category: 'Beads',
    tag: '',
    tagColor: '',
    img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',
    slug: 'kente-bead-stack',
  },
  {
    name: 'Midnight Velvet Blazer',
    price: 590,
    desc: 'Premium After-hours Wear',
    category: 'Fashion',
    tag: 'LIMITED',
    tagColor: 'bg-yellow-400 text-black',
    img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400',
    slug: 'midnight-velvet-blazer',
  },
  {
    name: 'Monarch Carry-all',
    price: 780,
    desc: 'Full-grain Leather Accessory',
    category: 'Fashion',
    tag: 'BESPOKE ONLY',
    tagColor: 'bg-yellow-400 text-black',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    slug: 'monarch-carry-all',
  },
];

const categories = ['ALL', 'FASHION', 'FURNITURE', 'BEADS'];

const Shop = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('Latest');
  const [wishlist, setWishlist] = useState([]);
  const [cartAdded, setCartAdded] = useState([]);
  const [quickView, setQuickView] = useState(null);

  const toggleWishlist = (e, slug) => {
    e.stopPropagation();
    setWishlist(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    setCartAdded(prev => [...prev, product.slug]);
    setTimeout(() => {
      setCartAdded(prev => prev.filter(s => s !== product.slug));
    }, 2000);
  };

  const openQuickView = (e, product) => {
    e.stopPropagation();
    setQuickView(product);
  };

  const filtered = allProducts
    .filter(p =>
      activeCategory === 'ALL' || p.category.toUpperCase() === activeCategory
    )
    .sort((a, b) => {
      if (sortBy === 'Price: Low') return a.price - b.price;
      if (sortBy === 'Price: High') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* HERO BANNER */}
      <div
        className="relative px-8 py-16 text-center overflow-hidden"
        style={{ backgroundColor: '#1a1a00' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #FFD700, transparent 70%)',
          }}
        />
        <span className="inline-block border border-yellow-400 text-yellow-400 text-xs font-black px-4 py-1 rounded-full mb-4 uppercase tracking-widest">
          Limited Drops Available
        </span>
        <h1 className="text-6xl font-black uppercase leading-none mb-4">
          Shop <span className="text-yellow-400">Collection</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Curated artisanal pieces across fashion, furniture, and heritage beadwork.
          Each piece is one-of-a-kind.
        </p>
      </div>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wide transition ${
                  activeCategory === cat
                    ? 'bg-yellow-400 text-black'
                    : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-700 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
              style={{ backgroundColor: '#2a2000' }}
            >
              <option>Latest</option>
              <option>Price: Low</option>
              <option>Price: High</option>
            </select>
            <span className="text-gray-600 text-xs">{filtered.length} pieces</span>
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-4 gap-6">
          {filtered.map(product => (
            <div key={product.slug} className="group">

              {/* Image */}
              <div
                className="relative rounded-2xl overflow-hidden mb-3 cursor-pointer"
                style={{ backgroundColor: '#2a2000', height: '280px' }}
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Tag */}
                {product.tag && (
                  <span className={`absolute top-3 left-3 ${product.tagColor} text-xs font-black px-2 py-1 rounded-full`}>
                    {product.tag}
                  </span>
                )}

                {/* Wishlist Heart */}
                <button
                  onClick={e => toggleWishlist(e, product.slug)}
                  className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-80 transition z-10"
                >
                  <span className={wishlist.includes(product.slug) ? 'text-red-400' : 'text-white'}>
                    {wishlist.includes(product.slug) ? '♥' : '♡'}
                  </span>
                </button>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition duration-300 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={e => openQuickView(e, product)}
                    className="bg-white text-black px-5 py-2 rounded-full font-black text-xs hover:bg-yellow-400 transition w-36"
                  >
                    👁 Quick View
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="border-2 border-white text-white px-5 py-2 rounded-full font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition w-36"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div
                className="flex justify-between items-start mb-2 cursor-pointer"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <div>
                  <p className="text-white font-black text-sm group-hover:text-yellow-400 transition">
                    {product.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{product.desc}</p>
                  <p className="text-yellow-700 text-xs mt-1 uppercase tracking-wide">
                    {product.category}
                  </p>
                </div>
                <p className="text-yellow-400 font-black text-sm ml-2">${product.price}</p>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={e => handleAddToCart(e, product)}
                className={`w-full py-2 rounded-xl font-black text-xs transition ${
                  cartAdded.includes(product.slug)
                    ? 'bg-green-500 text-white'
                    : 'border border-gray-700 text-gray-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400'
                }`}
              >
                {cartAdded.includes(product.slug) ? '✓ Added to Cart!' : '+ Add to Cart'}
              </button>
            </div>
          ))}
        </div>

        {/* Custom Order CTA Banner */}
        <div
          className="mt-14 rounded-2xl p-10 text-center border border-yellow-900"
          style={{ backgroundColor: '#1a1a00' }}
        >
          <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">
            Can't find what you're looking for?
          </p>
          <h3 className="text-white font-black text-3xl mb-3">
            Want Something Unique?
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Commission a bespoke piece crafted to your exact specifications by our master artisans.
          </p>
          <Link
            to="/custom-order"
            className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
          >
            Start Custom Order →
          </Link>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {quickView && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4"
          onClick={() => setQuickView(null)}
        >
          <div
            className="rounded-2xl p-6 max-w-lg w-full border border-gray-700 relative"
            style={{ backgroundColor: '#1a1a00' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setQuickView(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl transition"
            >
              ✕
            </button>

            <div className="flex gap-5">
              <img
                src={quickView.img}
                alt={quickView.name}
                className="w-44 h-44 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1">
                {quickView.tag && (
                  <span className="inline-block bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full mb-2">
                    {quickView.tag}
                  </span>
                )}
                <p className="text-yellow-600 text-xs uppercase tracking-wide mb-1">
                  {quickView.category}
                </p>
                <h3 className="text-white font-black text-xl leading-tight mb-1">
                  {quickView.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{quickView.desc}</p>
                <p className="text-yellow-400 font-black text-3xl mb-5">
                  ${quickView.price}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigate(`/product/${quickView.slug}`);
                      setQuickView(null);
                    }}
                    className="flex-1 border border-yellow-400 text-yellow-400 py-2 rounded-lg font-black text-xs hover:bg-yellow-400 hover:text-black transition"
                  >
                    Full Details
                  </button>
                  <button
                    onClick={e => {
                      handleAddToCart(e, quickView);
                      setQuickView(null);
                    }}
                    className="flex-1 bg-yellow-400 text-black py-2 rounded-lg font-black text-xs hover:bg-yellow-500 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer
        style={{ backgroundColor: '#0d0d00' }}
        className="border-t border-yellow-900 px-8 py-10"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">
              57
            </span>
            <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
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

export default Shop;