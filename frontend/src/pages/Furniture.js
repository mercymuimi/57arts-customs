import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const furnitureProducts = [
  {
    name: 'Obsidian Throne',
    price: '$850',
    desc: 'MATTE CARBON / BRASS',
    tag: 'READY TO SHIP',
    tagColor: 'bg-yellow-400 text-black',
    img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400',
  },
  {
    name: 'Gilded Lounge',
    price: '$1,200',
    desc: 'GOLD VELVET / OAK',
    tag: 'LIMITED EDITION',
    tagColor: 'bg-orange-700 text-white',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  },
  {
    name: 'Midnight Stool',
    price: '$320',
    desc: 'POWDER COATED STEEL',
    tag: '',
    tagColor: '',
    img: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400',
  },
  {
    name: 'Solar Flare Chair',
    price: '$675',
    desc: 'SCULPTED RESIN / YELLOW',
    tag: '',
    tagColor: '',
    img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400',
  },
];

const filters = ['Chairs', 'Tables', 'Lighting', 'Storage'];

const Furniture = () => {
  const [activeFilter, setActiveFilter] = useState('Chairs');
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', category: 'Dining Table', vision: ''
  });

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0d0d0d' }}>



      {/* HERO */}
      <div className="relative h-screen flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400"
          alt="Furniture Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.2))' }}>
        </div>
        <div className="relative z-10 px-16 pb-24 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-black px-4 py-1 rounded-full mb-6 uppercase tracking-widest">
            ● NEXT-GEN INTERIORS
          </div>
          <h1 className="text-7xl font-black leading-tight mb-6">
            <span className="text-white italic">Bespoke</span><br />
            <span className="text-yellow-400 italic">Craftsmanship</span>
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md mb-10">
            Elevate your space with one-of-a-kind custom furniture designed for the
            digital generation. Merging brutalist aesthetics with premium artisanal soul.
          </p>
          <div className="flex gap-4">
            <Link
              to="/custom-order"
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-black text-sm hover:bg-yellow-500 transition flex items-center gap-2"
            >
              Start Custom Order →
            </Link>
            <Link to="/gallery" className="border border-white text-white px-8 py-3 rounded-lg font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition flex items-center justify-center">
              View Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* ARTISANAL LIVING - Products */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black uppercase italic">Artisanal Living</h2>
            <p className="text-gray-500 text-sm mt-1">Ready-to-ship essentials for the curated home.</p>
          </div>
          <div className="flex gap-6 text-sm">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`pb-1 font-semibold transition ${
                  activeFilter === f
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {furnitureProducts.map((product) => (
            <div key={product.name} className="group cursor-pointer">
              <div className="relative rounded-xl overflow-hidden mb-3 bg-gray-900">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-500 bg-white"
                />
                {product.tag && (
                  <span className={`absolute top-3 left-3 ${product.tagColor} text-xs font-black px-2 py-1 rounded`}>
                    {product.tag}
                  </span>
                )}
                <button className="absolute top-3 right-3 bg-black bg-opacity-60 rounded-full w-8 h-8 flex items-center justify-center text-white hover:text-red-400 transition">
                  ♡
                </button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-black text-sm">{product.name}</p>
                  <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">{product.desc}</p>
                </div>
                <p className="text-yellow-400 font-black text-sm">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Browse All */}
        <div className="text-center">
          <button className="border-b border-gray-600 text-gray-400 text-xs uppercase tracking-widest hover:text-yellow-400 hover:border-yellow-400 transition pb-1">
            Browse Entire Collection
          </button>
        </div>
      </div>

      {/* YOUR VISION OUR CUSTOM BUILD */}
      <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left */}
        <div>
          <h2 className="text-5xl font-black uppercase italic leading-tight mb-6">
            Your Vision,<br />
            Our <span className="text-yellow-400">Custom Build</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
            Can't find exactly what you're looking for? Our artisans specialize in
            bringing unique concepts to life. From custom wood grain selections to
            bespoke metal finishes, your space deserves a masterpiece.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { icon: '⚙', title: 'Consultation', sub: '1-on-1 design meeting' },
              { icon: '🖥', title: '3D Modeling', sub: 'See it before we build it' },
              { icon: '🔨', title: 'Handcrafted', sub: 'Master artisan build' },
              { icon: '✦', title: 'Lifetime Warranty', sub: 'Quality that endures' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-yellow-400 text-lg">{item.icon}</span>
                <div>
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Request Form */}
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#1a1a2e' }}>
          <h3 className="text-white font-black text-lg mb-6">Request a Custom Build</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wide block mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Alex Reed"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 placeholder-gray-600"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wide block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="alex@genz.design"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 placeholder-gray-600"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400"
              >
                <option>Dining Table</option>
                <option>Chair</option>
                <option>Sofa</option>
                <option>Bed Frame</option>
                <option>Storage</option>
                <option>Lighting</option>
              </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wide block mb-1">Project Vision</label>
              <textarea
                placeholder="Describe the vibe, dimensions, and materials you're dreaming of..."
                value={form.vision}
                onChange={(e) => setForm({ ...form, vision: e.target.value })}
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 placeholder-gray-600 resize-none"
              />
            </div>
            <button className="w-full bg-yellow-400 text-black py-3 rounded-lg font-black text-sm hover:bg-yellow-500 transition uppercase tracking-wide">
              Send Request
            </button>
          </div>
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <p className="text-center text-gray-600 text-xs uppercase tracking-widest mb-8">
          Designed For The Aesthetic Soul
        </p>
        <div className="grid grid-cols-3 gap-3">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600"
            alt="gallery1"
            className="rounded-xl h-64 w-full object-cover row-span-2 col-span-1"
            style={{ gridRow: 'span 2' }}
          />
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"
            alt="gallery2"
            className="rounded-xl h-32 w-full object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400"
            alt="gallery3"
            className="rounded-xl h-32 w-full object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600"
            alt="gallery4"
            className="rounded-xl h-32 w-full object-cover col-span-2"
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#080810' }}
        className="border-t border-gray-800 mt-16 px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
              <span className="text-white font-black text-sm">57 ARTS</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              Defined by the edge. Crafted by the hands. Built for the future of living.
            </p>
            <div className="flex gap-3 mt-4 text-gray-500 text-lg">
              <span className="hover:text-yellow-400 cursor-pointer">⚡</span>
              <span className="hover:text-yellow-400 cursor-pointer">◎</span>
              <span className="hover:text-yellow-400 cursor-pointer">□</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Shop</h4>
            {['All Furniture', 'Lighting', 'Home Decor', 'Limited Series'].map((item) => (
              <p key={item} className="text-gray-500 text-sm mb-2 hover:text-yellow-400 cursor-pointer transition">{item}</p>
            ))}
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Service</h4>
            {['Custom Build Process', 'Shipping & Returns', 'Warranty', 'Contact Us'].map((item) => (
              <p key={item} className="text-gray-500 text-sm mb-2 hover:text-yellow-400 cursor-pointer transition">{item}</p>
            ))}
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Join The Club</h4>
            <p className="text-gray-500 text-xs mb-4">Get drop alerts and early access to custom slots.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 text-white text-xs px-4 py-2 rounded-l-lg focus:outline-none focus:border-yellow-400 placeholder-gray-600"
              />
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-r-lg font-black text-xs hover:bg-yellow-500 transition">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex justify-between items-center">
          <p className="text-gray-600 text-xs">© 2024 57 Arts & Customs. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-600 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer">Instagram</span>
            <span className="hover:text-white cursor-pointer">TikTok</span>
            <span className="hover:text-white cursor-pointer">Twitter</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-600">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Furniture;