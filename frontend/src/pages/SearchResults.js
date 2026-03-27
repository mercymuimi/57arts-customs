import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const allProducts = [
  {
    id: 1,
    name: 'Distressed Artisanal Denim',
    price: '$450',
    desc: 'Hand-painted Limited Edition',
    category: 'Fashion',
    tag: 'CUSTOM ORDER',
    tagColor: 'bg-yellow-400 text-black',
    img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    path: '/product/distressed-artisanal-denim',
  },
  {
    id: 2,
    name: 'Linen Riviera Set',
    price: '$320',
    desc: 'Heritage Collection',
    category: 'Fashion',
    tag: 'READY-MADE',
    tagColor: 'bg-gray-700 text-white',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    path: '/product/linen-riviera-set',
  },
  {
    id: 3,
    name: 'Gold-Infused Obsidian Beads',
    price: '$185',
    desc: 'Hand-threaded Jewelry',
    category: 'Beads',
    tag: '',
    tagColor: '',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    path: '/product/gold-infused-obsidian-beads',
  },
  {
    id: 4,
    name: 'Vanguard Teak Chair',
    price: '$1,200',
    desc: 'Bespoke Furniture Line',
    category: 'Furniture',
    tag: 'CUSTOM ORDER',
    tagColor: 'bg-yellow-400 text-black',
    img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400',
    path: '/product/vanguard-teak-chair',
  },
  {
    id: 5,
    name: 'Midnight Velvet Blazer',
    price: '$590',
    desc: 'Premium After-hours Wear',
    category: 'Fashion',
    tag: '',
    tagColor: '',
    img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400',
    path: '/product/midnight-velvet-blazer',
  },
  {
    id: 6,
    name: 'Monarch Carry-all',
    price: '$780',
    desc: 'Full-grain Leather Accessory',
    category: 'Fashion',
    tag: 'BESPOKE ONLY',
    tagColor: 'bg-yellow-400 text-black',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    path: '/product/monarch-carry-all',
  },
  {
    id: 7,
    name: 'Ancestral Pulse Bracelet',
    price: '$95',
    desc: 'Heritage Beadwork',
    category: 'Beads',
    tag: 'ARTISANAL',
    tagColor: 'bg-orange-600 text-white',
    img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400',
    path: '/product/gold-infused-obsidian-beads',
  },
  {
    id: 8,
    name: 'Obsidian Throne Chair',
    price: '$850',
    desc: 'Matte Carbon / Brass',
    category: 'Furniture',
    tag: 'LIMITED',
    tagColor: 'bg-gray-700 text-white',
    img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400',
    path: '/product/vanguard-teak-chair',
  },
  {
    id: 9,
    name: 'Solar Flare Chair',
    price: '$675',
    desc: 'Sculpted Resin / Yellow',
    category: 'Furniture',
    tag: '',
    tagColor: '',
    img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400',
    path: '/product/vanguard-teak-chair',
  },
];

const styles = ['Old Money', 'Denim', 'Minimalist', 'Avant-garde', 'Eco-Luxury'];
const categories = ['All', 'Fashion', 'Furniture', 'Beads'];
const popularTags = ['Denim', 'Custom Order', 'Beads', 'Furniture', 'Old Money', 'Limited Edition'];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState(query);
  const [activeCategory, setActiveCategory] = useState('All');
  const [availability, setAvailability] = useState({
    readyMade: true,
    customOrders: false,
  });
  const [activeStyles, setActiveStyles] = useState(['Denim']);
  const [sortBy, setSortBy] = useState('Latest Drop');
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleSearchClick = () => {
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const toggleWishlist = (name) => {
    setWishlist(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const toggleStyle = (style) => {
    setActiveStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const filteredProducts = allProducts.filter(p => {
    const matchesQuery =
      query === '' ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* SEARCH BAR SECTION */}
      <div
        className="border-b border-yellow-900 px-8 py-6"
        style={{ backgroundColor: '#1a1500' }}
      >
        <div className="max-w-7xl mx-auto">

          {/* Search Input Row */}
          <div className="flex items-center gap-4">
            <div
              className="flex-1 flex items-center gap-3 border border-gray-700 rounded-xl px-5 py-4 focus-within:border-yellow-400 transition"
              style={{ backgroundColor: '#2a2000' }}
            >
              <span className="text-yellow-400 text-xl">🔍</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search products, categories, styles..."
                className="bg-transparent text-white text-base focus:outline-none w-full placeholder-gray-600"
                autoFocus
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="text-gray-500 hover:text-white text-sm transition"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleSearchClick}
              className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-black text-sm hover:bg-yellow-500 transition uppercase tracking-wide"
            >
              Search
            </button>
          </div>

          {/* Popular Tags */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="text-gray-600 text-xs uppercase tracking-wide">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                className="border border-gray-700 text-gray-400 text-xs px-3 py-1 rounded-full hover:border-yellow-400 hover:text-yellow-400 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-8 py-8 flex gap-8">

        {/* SIDEBAR */}
        <div className="w-56 flex-shrink-0">

          {/* Back to Home */}
          <Link
            to="/"
            className="flex items-center gap-2 text-yellow-400 text-xs font-black uppercase tracking-wide mb-8 hover:text-yellow-300 transition"
          >
            ← Back to Home
          </Link>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-4">
              Categories
            </h3>
            {[
              { name: 'All', icon: '🔥' },
              { name: 'Fashion', icon: '👔' },
              { name: 'Furniture', icon: '🪑' },
              { name: 'Beads', icon: '💎' },
            ].map((cat) => (
              <div
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 cursor-pointer transition ${
                  activeCategory === cat.name
                    ? 'bg-yellow-400 bg-opacity-20 border border-yellow-400'
                    : 'hover:bg-white hover:bg-opacity-5'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span className={`text-sm font-semibold ${
                  activeCategory === cat.name ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>

          {/* Availability */}
          <div className="mb-8">
            <h3 className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-4">
              Availability
            </h3>
            {[
              { key: 'readyMade', label: 'Ready-made' },
              { key: 'customOrders', label: 'Custom Orders' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 mb-3 cursor-pointer"
                onClick={() => setAvailability(prev => ({
                  ...prev,
                  [item.key]: !prev[item.key],
                }))}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
                  availability[item.key]
                    ? 'bg-yellow-400 border-yellow-400'
                    : 'border-gray-600'
                }`}>
                  {availability[item.key] && (
                    <span className="text-black text-xs font-black">✓</span>
                  )}
                </div>
                <span className="text-gray-400 text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-4">
              Price Range
            </h3>
            <input
              type="range"
              min="50"
              max="2500"
              defaultValue="800"
              className="w-full accent-yellow-400"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$50</span>
              <span>$2,500+</span>
            </div>
          </div>

          {/* Styles */}
          <div>
            <h3 className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-4">
              Styles
            </h3>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeStyles.includes(style)
                      ? 'bg-yellow-400 text-black'
                      : 'border border-gray-700 text-gray-400 hover:border-yellow-400'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCTS SECTION */}
        <div className="flex-1">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-500 text-xs mb-2 uppercase tracking-wide">
                Home › Search Results
              </p>
              <h1 className="text-2xl font-black">
                {query
                  ? <>Results for "<span className="text-yellow-400">{query}</span>"</>
                  : 'All Products'
                }
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Showing {filteredProducts.length} pieces
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                style={{ backgroundColor: '#2a2000' }}
              >
                <option>Latest Drop</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          {/* Category Quick Tabs */}
          <div className="flex gap-3 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-black transition ${
                  activeCategory === cat
                    ? 'bg-yellow-400 text-black'
                    : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-3 gap-5 mb-10">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(product.path)}
                >
                  <div
                    className="relative rounded-xl overflow-hidden mb-3"
                    style={{ backgroundColor: '#2a2000', height: '260px' }}
                  >
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {product.tag && (
                      <span className={`absolute bottom-3 left-3 ${product.tagColor} text-xs font-black px-2 py-1 rounded`}>
                        {product.tag}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.name);
                      }}
                      className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-opacity-80"
                    >
                      <span className={wishlist.includes(product.name) ? 'text-red-400' : 'text-white'}>
                        {wishlist.includes(product.name) ? '♥' : '♡'}
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-black text-sm">{product.name}</p>
                      <p className="text-gray-500 text-xs mt-1">{product.desc}</p>
                      <span className="inline-block mt-1 text-xs text-yellow-600 uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-yellow-400 font-black text-sm ml-2">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-white font-black text-xl mb-2">No results found</h3>
              <p className="text-gray-500 text-sm mb-6">
                We couldn't find anything for "<span className="text-yellow-400">{query}</span>"
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/search')}
                  className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-lg font-black text-sm hover:bg-yellow-400 hover:text-black transition"
                >
                  Clear Search
                </button>
                <Link
                  to="/shop"
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-black text-sm hover:bg-yellow-500 transition"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center items-center gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition text-sm">
                ‹
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-sm font-black transition ${
                    currentPage === page
                      ? 'bg-yellow-400 text-black'
                      : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="text-gray-600 text-sm">...</span>
              <button
                onClick={() => setCurrentPage(12)}
                className={`w-8 h-8 rounded-full text-sm font-black transition ${
                  currentPage === 12
                    ? 'bg-yellow-400 text-black'
                    : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                }`}
              >
                12
              </button>
              <button className="w-8 h-8 rounded-full border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition text-sm">
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer
        style={{ backgroundColor: '#0d0d00' }}
        className="border-t border-yellow-900 px-8 py-10 mt-8"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-start gap-8 mb-6">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">
                57
              </span>
              <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Redefining modern luxury through artisanal craftsmanship and Gen-Z focused aesthetics.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Explore</h4>
              {['Collections', 'Custom Orders', 'Collaborations'].map((item) => (
                <p key={item} className="text-gray-500 text-sm mb-2 hover:text-yellow-400 cursor-pointer transition">
                  {item}
                </p>
              ))}
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Support</h4>
              {['Shipping', 'Sizing Guide', 'Contact'].map((item) => (
                <p key={item} className="text-gray-500 text-sm mb-2 hover:text-yellow-400 cursor-pointer transition">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-yellow-900 pt-6 flex justify-between items-center">
          <p className="text-gray-600 text-xs">© 2024 57 Arts & Customs. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-600">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchResults;