import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const featuredProducts = [
  {
    name: 'Obsidian Throne v.2',
    label: 'FEATURED CUSTOM',
    price: '$1,250',
    category: 'Furniture',
    slug: 'vanguard-teak-chair',
    img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600',
    bg: '#2a3a2a',
  },
  {
    name: 'Midnight Denim Jacket',
    label: 'LIMITED DROP',
    price: '$450',
    category: 'Fashion',
    slug: 'distressed-artisanal-denim',
    img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    bg: '#2a2a3a',
  },
  {
    name: 'Gold Pulse Beads',
    label: 'HERITAGE CRAFT',
    price: '$185',
    category: 'Beads',
    slug: 'gold-infused-obsidian-beads',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
    bg: '#3a2a1a',
  },
  {
    name: 'Monarch Carry-all',
    label: 'BESPOKE ONLY',
    price: '$780',
    category: 'Fashion',
    slug: 'monarch-carry-all',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    bg: '#3a2a2a',
  },
];

const trending = [
  {
    name: 'Distressed Artisanal Denim',
    price: '$450',
    category: 'Fashion',
    tag: 'HOT',
    slug: 'distressed-artisanal-denim',
    img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
  },
  {
    name: 'Vanguard Teak Chair',
    price: '$1,200',
    category: 'Furniture',
    tag: 'CUSTOM',
    slug: 'vanguard-teak-chair',
    img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400',
  },
  {
    name: 'Gold-Infused Obsidian Beads',
    price: '$185',
    category: 'Beads',
    tag: 'NEW',
    slug: 'gold-infused-obsidian-beads',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  },
  {
    name: 'Midnight Velvet Blazer',
    price: '$590',
    category: 'Fashion',
    tag: 'LIMITED',
    slug: 'midnight-velvet-blazer',
    img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400',
  },
];

const categories = [
  {
    name: 'Fashion',
    desc: 'Street luxury & bespoke apparel',
    icon: '👔',
    path: '/fashion',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
  },
  {
    name: 'Furniture',
    desc: 'Artisanal handcrafted pieces',
    icon: '🪑',
    path: '/furniture',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  },
  {
    name: 'Beads & Jewelry',
    desc: 'Heritage tribal collections',
    icon: '💎',
    path: '/beads',
    img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState(0);
  const [cartAdded, setCartAdded] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentProduct(prev => (prev + 1) % featuredProducts.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentProduct(index);
      setIsTransitioning(false);
    }, 300);
  };

  const handleAddToCart = () => {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const toggleWishlist = (slug) => {
    setWishlist(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const featured = featuredProducts[currentProduct];

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* ── HERO ── */}
      <section
        style={{ backgroundColor: '#1a1a00', height: 'calc(100vh - 65px)' }}
        className="relative flex items-center px-8 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #FFD700, transparent 60%)' }}
        />

        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 gap-10 items-center relative z-10">

          {/* LEFT */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-px bg-yellow-400" />
              <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
                AI-Powered Multi-Vendor Marketplace
              </span>
            </div>
            <h1 className="text-5xl font-black uppercase leading-tight mb-4">
              Design Your<br />
              <span className="text-yellow-400 italic">Identity.</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              The ultimate multi-vendor hub for Gen Z creators. From bespoke
              streetwear to artisanal furniture, use our AI tools to visualize
              and craft your next masterpiece.
            </p>
            <div className="flex gap-3 mb-8">
              <Link
                to="/custom-order"
                className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
              >
                ✦ Custom Made
              </Link>
              <Link
                to="/shop"
                className="flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-xl font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition"
              >
                ⊞ Shop Collection
              </Link>
            </div>
            <div className="flex gap-8 pt-6 border-t border-gray-800">
              {[
                { value: '2,400+', label: 'Artisan Products' },
                { value: '340+',   label: 'Vendors'          },
                { value: '98%',    label: 'Satisfaction'     },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-yellow-400 font-black text-xl">{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Featured Product Card */}
          <div className="relative">
            <div
              className={`rounded-2xl overflow-hidden border border-gray-800 transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ backgroundColor: featured.bg }}
            >
              <div
                className="relative overflow-hidden cursor-pointer"
                style={{ height: '260px' }}
                onClick={() => navigate(`/product/${featured.slug}`)}
              >
                <img
                  src={featured.img}
                  alt={featured.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-700"
                />
                <div className="absolute top-3 left-3 pointer-events-none">
                  <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                    {featured.label}
                  </span>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggleWishlist(featured.slug); }}
                  className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full w-9 h-9 flex items-center justify-center hover:bg-opacity-80 transition z-20"
                >
                  <span className={wishlist.includes(featured.slug) ? 'text-red-400' : 'text-white'}>
                    {wishlist.includes(featured.slug) ? '♥' : '♡'}
                  </span>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {featuredProducts.map((_, i) => (
                    <button
                      key={i}
                      onClick={e => { e.stopPropagation(); handleDotClick(i); }}
                      className={`rounded-full transition-all ${
                        i === currentProduct
                          ? 'bg-yellow-400 w-5 h-2'
                          : 'bg-white bg-opacity-50 w-2 h-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-yellow-400 text-xs font-black uppercase tracking-wide">
                      {featured.label}
                    </p>
                    <h3
                      className="text-white font-black text-lg cursor-pointer hover:text-yellow-400 transition mt-0.5"
                      onClick={() => navigate(`/product/${featured.slug}`)}
                    >
                      {featured.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{featured.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Starting at</p>
                    <p className="text-yellow-400 font-black text-xl">{featured.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/product/${featured.slug}`)}
                    className="flex-1 border border-gray-600 text-white py-2.5 rounded-xl font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition"
                  >
                    👁 View Details
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition ${
                      cartAdded
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-400 text-black hover:bg-yellow-500'
                    }`}
                  >
                    {cartAdded ? '✓ Added!' : '🛒 Add to Cart'}
                  </button>
                </div>
              </div>
            </div>

            {/* Next product thumbnail */}
            <div
              className="absolute -bottom-3 -right-3 w-20 h-20 rounded-xl overflow-hidden border-2 border-yellow-400 cursor-pointer hover:scale-110 transition z-10"
              onClick={() => handleDotClick((currentProduct + 1) % featuredProducts.length)}
            >
              <img
                src={featuredProducts[(currentProduct + 1) % featuredProducts.length].img}
                alt="Next"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center pointer-events-none">
                <span className="text-white text-lg font-black">›</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRENDING NOW ── */}
      <section className="max-w-6xl mx-auto px-8 py-14">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-px bg-yellow-400" />
              <p className="text-yellow-400 text-xs font-black uppercase tracking-widest">
                What's Hot
              </p>
            </div>
            <h2 className="text-3xl font-black uppercase">Trending Now</h2>
          </div>
          <Link to="/gallery" className="text-yellow-400 text-sm font-semibold hover:underline">
            View Gallery →
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {trending.map(product => (
            <div key={product.slug} className="group cursor-pointer">
              <div
                className="relative rounded-2xl overflow-hidden mb-3"
                style={{ backgroundColor: '#2a2000', height: '240px' }}
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-black px-2 py-1 rounded-full pointer-events-none">
                  {product.tag}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); toggleWishlist(product.slug); }}
                  className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-80 transition"
                >
                  <span className={wishlist.includes(product.slug) ? 'text-red-400' : 'text-white'}>
                    {wishlist.includes(product.slug) ? '♥' : '♡'}
                  </span>
                </button>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/product/${product.slug}`); }}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-xs hover:bg-yellow-500 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <p
                className="text-white font-black text-sm group-hover:text-yellow-400 transition"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                {product.name}
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-gray-500 text-xs">{product.category}</p>
                <p className="text-yellow-400 font-black text-sm">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-14 px-8" style={{ backgroundColor: '#1a1a00' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2">
              Browse By Category
            </p>
            <h2 className="text-3xl font-black uppercase">Shop The Collections</h2>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {categories.map(cat => (
              <Link key={cat.name} to={cat.path}>
                <div
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ height: '200px' }}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition pointer-events-none" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl mb-2">{cat.icon}</span>
                    <h3 className="text-white font-black text-lg uppercase">{cat.name}</h3>
                    <p className="text-gray-300 text-xs mt-1">{cat.desc}</p>
                    <span className="mt-3 border border-yellow-400 text-yellow-400 text-xs font-black px-4 py-1 rounded-full group-hover:bg-yellow-400 group-hover:text-black transition">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI FEATURES ── */}
      <section className="max-w-6xl mx-auto px-8 py-14">
        <div
          className="rounded-3xl p-10 border border-yellow-900 relative overflow-hidden"
          style={{ backgroundColor: '#1a1a00' }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #FFD700, transparent 60%)' }}
          />
          <div className="relative grid grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full mb-4">
                AI-POWERED
              </span>
              <h2 className="text-3xl font-black uppercase leading-tight mb-3">
                Design With<br />
                <span className="text-yellow-400">Artificial Intelligence</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Use our AI tools to visualize custom pieces, get smart product
                recommendations, and chat with our AI concierge for personalized
                styling advice.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/custom-order"
                  className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
                >
                  Try AI Design Studio
                </Link>
                <Link
                  to="/about"
                  className="border border-gray-600 text-gray-300 px-5 py-3 rounded-xl font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🧠', title: 'Smart Recommendations', desc: 'AI suggests products based on your taste',      path: '/shop'          },
                { icon: '🔍', title: 'Visual Search',          desc: 'Upload an image to find similar products',     path: '/shop'          },
                { icon: '💬', title: 'AI Chatbot',             desc: 'Get instant styling and product advice',       path: '/artisan-chat'  },
                { icon: '💰', title: 'Dynamic Pricing',        desc: 'Fair prices powered by market analytics',      path: '/shop'          },
              ].map(feature => (
                <Link
                  key={feature.title}
                  to={feature.path}
                  className="rounded-xl p-4 border border-gray-800 hover:border-yellow-400 transition block"
                  style={{ backgroundColor: '#2a2000' }}
                >
                  <span className="text-2xl mb-2 block">{feature.icon}</span>
                  <p className="text-white font-black text-xs mb-1">{feature.title}</p>
                  <p className="text-gray-500 text-xs">{feature.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VENDOR + AFFILIATE ── */}
      <section className="py-14 px-8" style={{ backgroundColor: '#1a1a00' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-6">
          <div
            className="rounded-2xl p-8 border border-gray-800"
            style={{ backgroundColor: '#0d0d00' }}
          >
            <span className="text-3xl mb-4 block">🏪</span>
            <h3 className="text-white font-black text-2xl mb-3">Become a Vendor</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Join 340+ artisans selling on 57 Arts & Customs. Get your own storefront,
              AI-powered analytics, and access to thousands of customers worldwide.
            </p>
            <Link
              to="/vendor"
              className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
            >
              Start Selling →
            </Link>
          </div>
          <div
            className="rounded-2xl p-8 border border-yellow-900"
            style={{ backgroundColor: '#2a2000' }}
          >
            <span className="text-3xl mb-4 block">💸</span>
            <h3 className="text-white font-black text-2xl mb-3">Affiliate Program</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Earn up to 12% commission referring customers. Real-time tracking,
              monthly M-Pesa payouts, and a full marketing kit included.
            </p>
            <Link
              to="/affiliate"
              className="inline-block border border-yellow-400 text-yellow-400 px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-400 hover:text-black transition"
            >
              Join Affiliate Program →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{ backgroundColor: '#0d0d00' }}
        className="border-t border-yellow-900 px-8 py-12"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-10 mb-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-yellow-400 text-black w-8 h-8 rounded flex items-center justify-center text-xs font-black">
                57
              </span>
              <span className="text-white font-black text-base">57 ARTS & CUSTOMS</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-4">
              Redefining modern luxury through artisanal craftsmanship and
              AI-powered creativity. Built for the bold generation.
            </p>
            <div className="flex gap-3 text-gray-500 text-lg">
              <span className="hover:text-yellow-400 cursor-pointer">◎</span>
              <span className="hover:text-yellow-400 cursor-pointer">@</span>
              <span className="hover:text-yellow-400 cursor-pointer">✉</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Shop</h4>
            {[
              { label: 'Fashion',       path: '/fashion'       },
              { label: 'Furniture',     path: '/furniture'     },
              { label: 'Beads & Jewelry', path: '/beads'       },
              { label: 'Custom Orders', path: '/custom-order'  },
              { label: 'Gallery',       path: '/gallery'       },
            ].map(item => (
              <Link key={item.label} to={item.path}
                className="block text-gray-500 text-sm mb-2 hover:text-yellow-400 transition">
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Company</h4>
            {[
              { label: 'About Us',       path: '/about'      },
              { label: 'Vendor Program', path: '/vendor'     },
              { label: 'Affiliate',      path: '/affiliate'  },
              { label: 'Contact',        path: '/contact'    },
            ].map(item => (
              <Link key={item.label} to={item.path}
                className="block text-gray-500 text-sm mb-2 hover:text-yellow-400 transition">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-yellow-900 pt-6 flex justify-between items-center">
          <p className="text-gray-600 text-xs">© 2024 57 Arts & Customs. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-600">
            <Link to="/contact" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;