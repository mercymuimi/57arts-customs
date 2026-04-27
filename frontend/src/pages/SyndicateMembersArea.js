import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';

const perks = [
  { icon: '★',  title: 'Early Access Protocols',  desc: 'First allocation on every limited drop before public release.' },
  { icon: '✦',  title: 'Bespoke Consults',         desc: 'Direct line to our lead artisans for custom conceptualization.' },
  { icon: '🔑', title: 'Private Events',            desc: 'Invitation-only gallery nights at undisclosed Nairobi locations.' },
  { icon: '🛡',  title: 'The Registry',             desc: 'Permanent archival documentation for every commissioned piece.' },
  { icon: '💎', title: 'Priority Custom Slots',     desc: 'Skip the queue — first access to limited artisan commissions.' },
  { icon: '📦', title: 'White-Glove Delivery',      desc: 'Bespoke packaging with a hand-signed certificate of authenticity.' },
];

const SyndicateMembersArea = () => {
  const [drops, setDrops]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('drops');

  useEffect(() => {
    // Pull featured + limited products — these are the "early access drops"
    Promise.all([
      productAPI.getFeatured(),
      productAPI.getAll({ tag: 'Limited' }),
    ])
      .then(([featuredRes, limitedRes]) => {
        const featured = featuredRes.data?.products || featuredRes.data || [];
        const limited  = limitedRes.data?.products  || limitedRes.data  || [];
        // Merge, deduplicate by _id
        const seen = new Set();
        const merged = [...featured, ...limited].filter(p => {
          if (seen.has(p._id)) return false;
          seen.add(p._id);
          return true;
        });
        setDrops(merged);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: 'drops',  label: 'Early Drops',     icon: '★' },
    { id: 'perks',  label: 'Your Perks',       icon: '✦' },
    { id: 'events', label: 'Private Events',   icon: '🔑' },
    { id: 'custom', label: 'Bespoke Consults', icon: '💎' },
  ];

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* ── NAVBAR ───────────────────────────────────── */}
      <nav
        style={{ backgroundColor: 'rgba(26,21,0,0.97)' }}
        className="px-8 py-4 flex justify-between items-center border-b border-yellow-900 sticky top-0 z-30 backdrop-blur-md"
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-yellow-400 text-black w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm">
            57
          </span>
          <span className="text-white font-black text-sm tracking-wide">
            57 ARTS <span className="text-yellow-400">&</span> CUSTOMS
          </span>
        </Link>
        <div className="flex gap-8 text-xs text-gray-500 uppercase tracking-widest font-black">
          <Link to="/gallery"          className="hover:text-yellow-400 transition">Gallery</Link>
          <Link to="/fashion"          className="hover:text-yellow-400 transition">Collections</Link>
          <Link to="/syndicate/members" className="text-yellow-400 border-b border-yellow-400 pb-0.5">Members Area</Link>
          <Link to="/shop"             className="hover:text-yellow-400 transition">Archive</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="text-gray-500 hover:text-yellow-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
          <Link to="/profile" className="text-gray-500 hover:text-yellow-400 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* ── HERO HEADER ──────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-yellow-900" style={{ backgroundColor: '#1a1a00' }}>
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #FFD700, transparent 55%)' }}
        />
        <div className="max-w-6xl mx-auto px-8 py-14 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-yellow-400" />
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Syndicate Members Area</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-6xl font-black uppercase leading-none mb-4">
                <span className="text-white block">WELCOME TO</span>
                <span className="text-yellow-400 italic block">THE INNER CIRCLE</span>
              </h1>
              <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
                You're among the 57. Everything here is exclusively yours — early drops,
                bespoke access, private events. The rest of the world waits. You don't.
              </p>
            </div>
            {/* Member badge */}
            <div
              className="rounded-2xl border border-yellow-900 px-8 py-6 text-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(201,168,76,0.08)' }}
            >
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black text-black">
                ✦
              </div>
              <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-1">Status</p>
              <p className="text-white font-black text-sm">Active Member</p>
              <p className="text-gray-600 text-xs mt-1">Syndicate Class of 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────── */}
      <div className="border-b border-yellow-900 sticky top-[65px] z-20" style={{ backgroundColor: '#1a1500' }}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex gap-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition ${
                  activeTab === tab.id
                    ? 'text-yellow-400 border-yellow-400'
                    : 'text-gray-600 border-transparent hover:text-gray-400'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* ── EARLY DROPS TAB ── */}
        {activeTab === 'drops' && (
          <>
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-px bg-yellow-400" />
                  <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Exclusive Access</span>
                </div>
                <h2 className="text-white font-black text-3xl uppercase">
                  Early Drops <span className="text-yellow-400 italic">& Limited Pieces</span>
                </h2>
              </div>
              <Link
                to="/shop"
                className="border border-gray-700 text-gray-400 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:border-yellow-400 hover:text-yellow-400 transition"
                style={{ backgroundColor: '#2a2000' }}
              >
                Full Archive →
              </Link>
            </div>

            {/* Early access banner */}
            <div
              className="rounded-2xl border border-yellow-900 p-5 mb-8 flex items-center gap-4"
              style={{ backgroundColor: 'rgba(201,168,76,0.06)' }}
            >
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-0.5">
                  You're seeing this 48hrs before the public
                </p>
                <p className="text-gray-400 text-sm">
                  These pieces are exclusively available to Syndicate members until Friday. After that, they go live on the public shop.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-3 py-20 text-gray-600">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm uppercase tracking-widest">Loading drops…</span>
              </div>
            ) : drops.length === 0 ? (
              <div
                className="rounded-2xl border border-gray-800 p-16 text-center"
                style={{ backgroundColor: '#1a1a00' }}
              >
                <div className="text-5xl mb-4 opacity-30">✦</div>
                <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">Stand By</p>
                <h3 className="text-white font-black text-xl uppercase mb-3">Next Drop Incoming</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                  No drops are live yet. You'll be the first to know when the next release is ready.
                  Check your email — we'll notify you 24 hours before it drops.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {drops.map(product => (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`}
                    className="group rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-900 transition-all duration-300"
                    style={{ backgroundColor: '#1a1a00' }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ height: '260px' }}>
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl opacity-20" style={{ backgroundColor: '#2a2000' }}>
                          ✦
                        </div>
                      )}
                      {/* Tag */}
                      {product.tag && (
                        <div className="absolute top-3 left-3">
                          <span
                            className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: product.tag === 'Limited' ? 'rgba(224,92,92,0.9)' : 'rgba(201,168,76,0.9)',
                              color: '#000',
                            }}
                          >
                            {product.tag}
                          </span>
                        </div>
                      )}
                      {/* Members only badge */}
                      <div className="absolute top-3 right-3">
                        <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(26,21,0,0.9)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.4)' }}>
                          ✦ Members
                        </span>
                      </div>
                      {/* Overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ backgroundColor: 'rgba(26,21,0,0.5)' }}>
                        <span className="bg-yellow-400 text-black px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest">
                          View Piece →
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-white font-black text-sm uppercase mb-2 group-hover:text-yellow-400 transition">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-400 font-black text-lg">
                          KES {(product.price || 0).toLocaleString()}
                        </span>
                        {product.stock !== undefined && (
                          <span className={`text-xs font-black uppercase tracking-widest ${product.stock > 0 ? 'text-green-500' : 'text-red-400'}`}>
                            {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── PERKS TAB ── */}
        {activeTab === 'perks' && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-px bg-yellow-400" />
                <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Active Benefits</span>
              </div>
              <h2 className="text-white font-black text-3xl uppercase">
                Your <span className="text-yellow-400 italic">Syndicate Perks</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-8">
              {perks.map((perk, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-800 p-6 flex gap-5 hover:border-yellow-900 transition"
                  style={{ backgroundColor: '#1a1a00' }}
                >
                  <div className="w-12 h-12 bg-yellow-400 bg-opacity-20 border border-yellow-900 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {perk.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-black text-sm uppercase tracking-wide mb-2">{perk.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{perk.desc}</p>
                    <span className="inline-block mt-3 text-green-500 text-xs font-black uppercase tracking-widest">✓ Active</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom order CTA */}
            <div
              className="rounded-2xl border border-yellow-900 p-8 flex items-center justify-between"
              style={{ backgroundColor: 'rgba(201,168,76,0.06)' }}
            >
              <div>
                <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">✦ Exclusive to Members</p>
                <h3 className="text-white font-black text-2xl uppercase mb-2">Commission a Bespoke Piece</h3>
                <p className="text-gray-400 text-sm max-w-md">
                  As a Syndicate member, you skip the public queue. Our artisans are ready to bring your vision to life.
                </p>
              </div>
              <Link
                to="/custom-order"
                className="flex-shrink-0 bg-yellow-400 text-black px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition"
              >
                Start a Commission →
              </Link>
            </div>
          </>
        )}

        {/* ── EVENTS TAB ── */}
        {activeTab === 'events' && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-px bg-yellow-400" />
                <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Members Only</span>
              </div>
              <h2 className="text-white font-black text-3xl uppercase">
                Private <span className="text-yellow-400 italic">Events</span>
              </h2>
            </div>

            {/* Upcoming event */}
            <div
              className="rounded-2xl border border-yellow-900 overflow-hidden mb-5 relative"
              style={{ height: '280px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200"
                alt="Event"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,21,0,0.97) 50%, transparent)' }} />
              <div className="absolute inset-0 flex items-center px-10">
                <div>
                  <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ backgroundColor: 'rgba(201,168,76,0.2)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.4)' }}>
                    Upcoming · Members Only
                  </span>
                  <h3 className="text-white font-black text-3xl uppercase mb-3">
                    Studio Night<br />
                    <span className="text-yellow-400 italic">Volume IV</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 max-w-sm">
                    An intimate evening at the Westlands atelier. Live crafting, curated cocktails, and first look at the next collection.
                  </p>
                  <div className="flex gap-4 text-xs text-gray-500 uppercase tracking-widest mb-5">
                    <span>📅 TBA — Watch Your Email</span>
                    <span>📍 Nairobi, Kenya</span>
                    <span>👥 57 Seats Max</span>
                  </div>
                  <button className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition">
                    Register Interest →
                  </button>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl border border-gray-800 p-8 text-center"
              style={{ backgroundColor: '#1a1a00' }}
            >
              <span className="text-3xl">🔑</span>
              <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mt-4 mb-2">Invitations</p>
              <h3 className="text-white font-black text-xl uppercase mb-3">All Events Come to Your Inbox</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                Private event details — including location, time, and RSVP links — are always sent directly to your registered email. Never publicly listed.
              </p>
            </div>
          </>
        )}

        {/* ── BESPOKE CONSULTS TAB ── */}
        {activeTab === 'custom' && (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-px bg-yellow-400" />
                <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">Priority Access</span>
              </div>
              <h2 className="text-white font-black text-3xl uppercase">
                Bespoke <span className="text-yellow-400 italic">Commissions</span>
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-5 mb-8">
              {[
                { icon: '👔', category: 'Fashion',   title: 'Custom Garment',   desc: 'Tailored to your measurements, references, and story.' },
                { icon: '🪑', category: 'Furniture', title: 'Bespoke Furniture', desc: 'One-of-a-kind pieces built by hand in our Nairobi workshop.' },
                { icon: '💎', category: 'Beads',     title: 'Artisan Jewellery', desc: 'Custom bead and jewellery work using traditional techniques.' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-800 p-6 hover:border-yellow-900 transition"
                  style={{ backgroundColor: '#1a1a00' }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">{item.category}</p>
                  <h3 className="text-white font-black text-sm uppercase mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-5">{item.desc}</p>
                  <Link
                    to="/custom-order"
                    className="inline-block border border-yellow-900 text-yellow-400 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition"
                  >
                    Commission →
                  </Link>
                </div>
              ))}
            </div>

            {/* Priority note */}
            <div
              className="rounded-2xl border border-yellow-900 p-6 flex items-start gap-4"
              style={{ backgroundColor: 'rgba(201,168,76,0.06)' }}
            >
              <span className="text-yellow-400 text-2xl mt-0.5">✦</span>
              <div>
                <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-2">
                  Syndicate Priority Queue
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your custom order goes to the front of the queue. Syndicate members receive a dedicated artisan consultation call within 48 hours of submission, before any public commissions are reviewed.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{ backgroundColor: '#0d0d00' }} className="border-t border-yellow-900 px-8 py-8 mt-12">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs">57</span>
            <div>
              <p className="text-white font-black text-sm">57 ARTS & CUSTOMS</p>
              <p className="text-gray-700 text-xs">The Syndicate · Est. 1957</p>
            </div>
          </div>
          <div className="flex gap-6 text-xs text-gray-600 uppercase tracking-widest">
            <Link to="/syndicate" className="hover:text-yellow-400 transition">Syndicate Home</Link>
            <Link to="/shop"      className="hover:text-yellow-400 transition">Archive</Link>
            <Link to="/contact"   className="hover:text-yellow-400 transition">Contact</Link>
          </div>
          <p className="text-gray-700 text-xs text-right">
            © 2024 57 Arts & Customs.<br />All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SyndicateMembersArea;