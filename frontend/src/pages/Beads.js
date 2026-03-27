import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const beadsProducts = [
  {
    name: 'Gold-Infused Pulse Beads',
    desc: 'Ancestral Gold Edition',
    price: '$85.00',
    tag: 'Best Seller',
    tagColor: 'bg-yellow-400 text-black',
    img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',
  },
  {
    name: 'Onyx Heritage Necklace',
    desc: 'Matte Black Series',
    price: '$120.00',
    tag: '',
    tagColor: '',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  },
  {
    name: 'Midnight Custom Bracelet',
    desc: 'Bespoke Collection',
    price: '$65.00',
    tag: 'Limited',
    tagColor: 'bg-gray-700 text-white',
    img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400',
  },
  {
    name: 'Royal Ancestral Set',
    desc: 'Limited Edition Trio',
    price: '$195.00',
    tag: '',
    tagColor: '',
    img: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400',
  },
];

const filters = ['All Creations', 'Bracelets', 'Necklaces', 'Waist Beads'];

const Beads = () => {
  const [activeFilter, setActiveFilter] = useState('All Creations');
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>



      {/* HERO */}
      <div className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1400"
          alt="Beads Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(26,21,0,0.5), rgba(26,21,0,0.85))' }}>
        </div>
        <div className="relative z-10 max-w-3xl px-6">
          <p className="text-yellow-400 text-xs uppercase tracking-widest mb-6 font-black">
            Ancestral Pulse Collection
          </p>
          <h1 className="text-6xl md:text-7xl font-black uppercase leading-tight mb-6">
            <span className="text-white">Traditional Craft</span><br />
            <span className="text-yellow-400">&</span>
            <span className="text-white"> Modern Style</span>
          </h1>
          <p className="text-gray-300 text-sm max-w-lg mx-auto mb-10">
            Experience the soul of ancestral artistry through a Gen Z lens.
            Elegant gold-infused beadwork crafted for the modern visionary.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/products"
              className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black text-sm hover:bg-yellow-500 transition"
            >
              Shop All Items
            </Link>
            <button className="border border-white text-white px-8 py-3 rounded-full font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition">
              Explore Heritage
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TABS + PRODUCTS */}
      <div className="max-w-6xl mx-auto px-8 py-16">

        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex gap-3 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wide transition ${
                  activeFilter === f
                    ? 'bg-yellow-400 text-black'
                    : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 border border-gray-700 text-gray-400 px-4 py-2 rounded-full text-xs hover:border-yellow-400 hover:text-yellow-400 transition">
            ⚙ Filter & Sort
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {beadsProducts.map((product) => (
            <div key={product.name} className="group cursor-pointer">
              <div className="relative rounded-2xl overflow-hidden mb-4"
                style={{ backgroundColor: '#2a2000' }}>
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                />
                {product.tag && (
                  <span className={`absolute top-3 left-3 ${product.tagColor} text-xs font-black px-2 py-1 rounded`}>
                    {product.tag}
                  </span>
                )}
                <button className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center text-white hover:text-red-400 transition">
                  ♡
                </button>
              </div>
              <p className="text-white font-black text-sm">{product.name}</p>
              <p className="text-gray-500 text-xs mt-1">{product.desc}</p>
              <p className="text-yellow-400 font-black mt-2">{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* THE STORY BEHIND THE PULSE */}
      <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-black uppercase leading-tight mb-6">
            The Story Behind The{' '}
            <span className="text-yellow-400 italic">Pulse</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            In our culture, beads are more than ornamentation; they are a visual
            language. Each pattern, color, and knot tells a story of lineage,
            protection, and identity. 57 Arts & Customs reclaims this heritage
            for a new generation.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="border-l-2 border-yellow-400 pl-4">
              <h4 className="text-yellow-400 font-black text-sm uppercase tracking-wide mb-2">
                Protection
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                The black onyx represents strength and grounding energy passed through generations.
              </p>
            </div>
            <div className="border-l-2 border-yellow-400 pl-4">
              <h4 className="text-yellow-400 font-black text-sm uppercase tracking-wide mb-2">
                Abundance
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                Gold accents signify the richness of our history and the brilliance of our future.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden h-80">
          <img
            src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600"
            alt="Beads crafting"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* YOUR STORY BESPOKE */}
      <div className="max-w-6xl mx-auto px-8 py-8 mb-16">
        <div className="rounded-2xl p-16 text-center"
          style={{ backgroundColor: '#2a2000' }}>
          <p className="text-yellow-400 text-2xl mb-4">✦</p>
          <h2 className="text-4xl font-black uppercase mb-4">
            Your Story, <span className="text-yellow-400 italic">Bespoke</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">
            Don't just wear history — design it. Use our interactive customizer
            to select symbols, materials, and lengths that resonate with your personal journey.
          </p>
          <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black text-sm hover:bg-yellow-500 transition">
            Launch Customizer →
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0f0e00' }}
        className="border-t border-yellow-900 px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
              <span className="text-white font-black text-sm">57 ARTS</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Crafting the pulse of the ancestors for the visionaries of tomorrow.
              Premium beadwork with a soul.
            </p>
            <div className="flex gap-3 mt-4 text-gray-500 text-lg">
              <span className="hover:text-yellow-400 cursor-pointer">⚡</span>
              <span className="hover:text-yellow-400 cursor-pointer">◎</span>
              <span className="hover:text-yellow-400 cursor-pointer">@</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Collections</h4>
            {['Beads & Waistbands', 'Ancestral Pulse', 'Modern Minimalist', 'The Custom Lab'].map((item) => (
              <p key={item} className="text-gray-500 text-sm mb-2 hover:text-yellow-400 cursor-pointer transition">{item}</p>
            ))}
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">The Brand</h4>
            {['Our Heritage', 'Sourcing Ethics', 'Artist Collective', 'Contact Us'].map((item) => (
              <p key={item} className="text-gray-500 text-sm mb-2 hover:text-yellow-400 cursor-pointer transition">{item}</p>
            ))}
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Newsletter</h4>
            <p className="text-gray-500 text-xs mb-4">
              Get exclusive access to drop notifications and cultural deep-dives.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-black bg-opacity-30 border border-yellow-900 text-white text-xs px-4 py-2 rounded-l-lg focus:outline-none focus:border-yellow-400 placeholder-gray-600"
              />
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-r-lg font-black text-xs hover:bg-yellow-500 transition">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-yellow-900 pt-6 flex justify-between items-center">
          <p className="text-gray-600 text-xs">© 2024 57 Arts & Customs. All Rights Reserved.</p>
          <div className="flex gap-4 text-xs text-gray-600 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">Cookies</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Beads;