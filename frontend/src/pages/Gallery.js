import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const galleryItems = [
  {
    name: 'GOLDEN DISTRESSED DENIM',
    tag: '#DenimCustoms',
    category: 'FASHION',
    img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
  },
  {
    name: 'THE OBSIDIAN THRONE',
    tag: '#ArtisanalFurniture',
    category: 'FURNITURE',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
  },
  {
    name: 'CYBER-TRIBAL NECKPIECE',
    tag: '#CyberBeads',
    category: 'BEADS',
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
  },
  {
    name: 'SHADOW RIDER LEATHER',
    tag: '#CustomApparel',
    category: 'FASHION',
    img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500',
  },
  {
    name: 'MAGMA COFFEE TABLE',
    tag: '#ArtisanalFurniture',
    category: 'FURNITURE',
    img: 'https://images.unsplash.com/photo-1493106819501-8f9e5ce02e5d?w=500',
  },
  {
    name: 'HERITAGE PULSE SET',
    tag: '#ModernBeads',
    category: 'BEADS',
    img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500',
  },
];

const tags = [
  'All Projects',
  '#DenimCustoms',
  '#ArtisanalFurniture',
  '#ModernBeads',
  '#StreetLuxe',
  '#CyberBeads',
];

const lookbookEntries = [
  {
    id: 1,
    title: 'The Making of the Obsidian Throne',
    artisan: 'Master Julian',
    avatar: 'MJ',
    date: 'October 24, 2023',
    category: 'Furniture',
    tag: 'Behind the Scenes',
    readTime: '4 min read',
    excerpt: 'Three weeks of carving, two layers of obsidian inlay, and one near-disaster with the gold leaf. Here is the full story of how the Obsidian Throne came to life.',
    body: [
      'It started with a sketch on a napkin. The buyer had described something regal — a chair that felt like it belonged in a palace but also in a modern Nairobi living room. That tension between ancestral and contemporary is what I love most about custom work.',
      'The teak arrived from a supplier in Kisumu. Quarter-sawn, tight grain, exactly what I needed for the structural integrity the design demanded. I spent the first four days just preparing the wood — drying, planing, checking for any hidden knots that could compromise the armrests.',
      'The obsidian inlay was the most technically demanding part. Each piece had to be cut to within half a millimetre. I lost two pieces to cracking before I figured out the correct cutting angle. By day twelve I had a rhythm.',
      'The gold leaf application on the backrest detailing nearly undid everything. I applied the first layer on a day with too much humidity in the workshop and it lifted overnight. Starting over at that stage tested every bit of patience I have built over twenty years of craft.',
      'But the final piece — when the last coat of varnish dried and I turned it in the light — it was everything the brief asked for and more.',
    ],
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    ],
    product: 'vanguard-teak-chair',
    likes: 47,
    comments: 12,
  },
  {
    id: 2,
    title: 'Sourcing Aso-Oke in Lagos — A Two-Day Journey',
    artisan: 'Adaeze Obi',
    avatar: 'AO',
    date: 'October 18, 2023',
    category: 'Fashion',
    tag: 'Materials',
    readTime: '3 min read',
    excerpt: 'Finding the right hand-woven Aso-Oke for a bespoke agbada commission meant travelling to three markets across Lagos and negotiating with four weavers.',
    body: [
      'When the commission brief arrived — an oversized agbada with neon geometric panels on heritage Aso-Oke — I knew immediately I could not use the mass-produced fabric available locally. This piece demanded the real thing.',
      'I took the early bus to Lagos on a Tuesday. My first stop was Balogun market. The colours were extraordinary but the weave was too loose for the structural silhouette the design required. I photographed everything and moved on.',
      'The second market, tucked behind Tejuosho, is where I found Master Biodun. He has been weaving for thirty-eight years and still works on a wooden loom his grandfather built. When I showed him the sketch he nodded slowly and said he could do it in indigo with copper thread.',
      'We agreed on a price over tea. He promised delivery in ten days. He delivered in seven.',
      'The fabric arrived rolled in brown paper and tied with twine. When I unrolled it in my workshop the geometric pattern caught the afternoon light in a way I had not anticipated. It made the whole design feel inevitable.',
    ],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
      'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=800',
    ],
    product: 'distressed-artisanal-denim',
    likes: 63,
    comments: 18,
  },
  {
    id: 3,
    title: 'Gold Pulse Beads — Tradition Meets Geometry',
    artisan: 'Amina Yusuf',
    avatar: 'AY',
    date: 'October 10, 2023',
    category: 'Beads',
    tag: 'Craft Process',
    readTime: '5 min read',
    excerpt: 'Each bead in the Gold Pulse collection is individually wrapped in 24k gold leaf before stringing. A process that takes twelve hours per piece and cannot be rushed.',
    body: [
      'Beadwork in my family goes back four generations. My great-grandmother made ceremonial pieces for the Lamido court in Adamawa. I learned from my grandmother, who learned from hers. The patterns I use today are the same patterns they used — I have only changed the materials.',
      'The Gold Pulse collection started as an experiment. I wanted to see what happened when I took traditional Fulani bead geometry and applied it to obsidian. The contrast of the matte black stone against the 24k gold wrapping was immediately striking.',
      'The gold leaf application is the most meditative part of the process. Each bead takes approximately forty minutes. I work in the early morning when the air is still and my hands are steadiest.',
      'The stringing pattern encodes a traditional Fulani blessing for safe travel. It is not visible in the finished piece but it is there. I think the people who wear these pieces feel it even if they do not know it.',
    ],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
    ],
    product: 'gold-infused-obsidian-beads',
    likes: 89,
    comments: 24,
  },
  {
    id: 4,
    title: 'Why I Left Architecture to Make Furniture',
    artisan: 'Kofi Mensah',
    avatar: 'KM',
    date: 'October 3, 2023',
    category: 'Furniture',
    tag: 'Artisan Story',
    readTime: '6 min read',
    excerpt: 'Seven years designing buildings in Accra taught me everything about structure and almost nothing about soul. I found both when I walked into my grandfather\'s woodshop.',
    body: [
      'I graduated from KNUST with a first class degree in architecture. I had offers from three firms in Accra and one in London. I took the Accra job and spent seven years designing commercial buildings that I am still not sure the world needed.',
      'The pivot happened gradually and then all at once. My grandfather fell ill in 2018 and I spent a month in his village outside Kumasi. His woodshop had been there for fifty years. The smell of teak shavings and linseed oil is the smell of my entire childhood.',
      'I started working in the shop just to keep busy while he recovered. Within a week I realised I had not thought about a deadline or a client brief in days. I was just making things.',
      'The architectural training turned out to be invaluable. I understand load distribution, joinery stress, material behaviour under climate variation. I design furniture the way architects design buildings — from the structure outward.',
    ],
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
    ],
    product: 'vanguard-teak-chair',
    likes: 134,
    comments: 41,
  },
  {
    id: 5,
    title: 'The Midnight Velvet Blazer — A Commission Story',
    artisan: 'Fatima Al-Hassan',
    avatar: 'FA',
    date: 'September 28, 2023',
    category: 'Fashion',
    tag: 'Commission',
    readTime: '3 min read',
    excerpt: 'The buyer wanted something for a Lagos wedding that would photograph beautifully at night. The brief was three words: dark, structured, unforgettable.',
    body: [
      'Three words. That was the entire brief. Dark, structured, unforgettable. I love briefs like this because they give you the destination without prescribing the route.',
      'I started with fabric research. Italian velvet in midnight navy was the obvious answer but obvious is not unforgettable. I sourced a double-weave velvet from a supplier in Milan that has a subtle directional sheen — it appears almost black in flat light and deep blue under flash.',
      'The structure came from the lining. I used a boned internal corset construction borrowed from couture tailoring to give the blazer a sculptural shape that holds even when the wearer is dancing.',
      'The buyer sent a photo from the wedding at 2am with no message. Just the photo. He was standing in a garden with string lights behind him and the blazer was doing exactly what it was supposed to do. That was enough.',
    ],
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800',
    ],
    product: 'midnight-velvet-blazer',
    likes: 72,
    comments: 19,
  },
  {
    id: 6,
    title: 'Learning the Kente Loom at 34',
    artisan: 'Abena Asante',
    avatar: 'AA',
    date: 'September 20, 2023',
    category: 'Fashion',
    tag: 'Artisan Story',
    readTime: '4 min read',
    excerpt: 'I am not from a weaving family. I taught myself Kente on YouTube videos and a second-hand loom I bought from a retiring weaver in Kumasi.',
    body: [
      'Everyone assumes Kente weaving is inherited. It is often true — many of the great weavers in Bonwire learned from parents and grandparents. But craft traditions do not have to be blood traditions. They can be chosen.',
      'I found my first video tutorial at 2am during a period of unemployment in 2021. I watched it three times and then searched for a loom. Found one on Jiji from a weaver in Kumasi who was retiring due to arthritis.',
      'The first month was humbling. My patterns were inconsistent, my tension was wrong, and I wasted more yarn than I care to calculate. But the process of learning — the patience it required — was exactly what I needed.',
      'By month three I was producing pieces I was not ashamed of. By month eight I had my first commission. I cried after I delivered it.',
    ],
    images: [
      'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=800',
    ],
    product: 'kente-bead-stack',
    likes: 156,
    comments: 53,
  },
];

const lookbookCategories = ['All', 'Furniture', 'Fashion', 'Beads'];
const lookbookTags = ['All', 'Behind the Scenes', 'Materials', 'Craft Process', 'Artisan Story', 'Commission'];

const Gallery = () => {
  const [activeTab, setActiveTab]     = useState('Gallery');
  const [activeTag, setActiveTag]     = useState('All Projects');
  const [visibleCount, setVisibleCount] = useState(6);
  const [lbCategory, setLbCategory]   = useState('All');
  const [lbTag, setLbTag]             = useState('All');
  const [lbSearch, setLbSearch]       = useState('');
  const [openEntry, setOpenEntry]     = useState(null);
  const [liked, setLiked]             = useState([]);

  const filteredGallery = activeTag === 'All Projects'
    ? galleryItems
    : galleryItems.filter(i => i.tag === activeTag);

  const filteredLookbook = lookbookEntries.filter(e => {
    const matchCat    = lbCategory === 'All' || e.category === lbCategory;
    const matchTag    = lbTag === 'All' || e.tag === lbTag;
    const matchSearch = !lbSearch ||
      e.title.toLowerCase().includes(lbSearch.toLowerCase()) ||
      e.artisan.toLowerCase().includes(lbSearch.toLowerCase()) ||
      e.excerpt.toLowerCase().includes(lbSearch.toLowerCase());
    return matchCat && matchTag && matchSearch;
  });

  const toggleLike = id =>
    setLiked(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);

  // ── SUBNAV (shared) ──────────────────────────────────
  const Subnav = () => (
    <nav
      style={{ backgroundColor: '#1a1500' }}
      className="px-8 py-4 flex justify-between items-center border-b border-yellow-900"
    >
      <Link to="/" className="flex items-center gap-2">
        <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
        <span className="text-white font-black text-sm italic">
         <span className="text-yellow-400"></span>
        </span>
      </Link>
      <div className="flex gap-8 text-sm text-gray-400">
        <button
          onClick={() => { setOpenEntry(null); setActiveTab('Gallery'); }}
          className={`transition pb-1 ${
            activeTab === 'Gallery' && !openEntry
              ? 'text-white font-semibold border-b border-yellow-400'
              : 'hover:text-white'
          }`}>
          Gallery
        </button>
        <button
          onClick={() => { setOpenEntry(null); setActiveTab('Lookbook'); }}
          className={`transition pb-1 ${
            activeTab === 'Lookbook' || openEntry
              ? 'text-yellow-400 font-black border-b border-yellow-400'
              : 'hover:text-white'
          }`}>
          Lookbook
        </button>
        <Link to="/shop"  className="hover:text-white transition">Shop</Link>
        <Link to="/about" className="hover:text-white transition">About</Link>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 border border-gray-700 rounded-lg px-3 py-2"
          style={{ backgroundColor: '#0d0d00' }}
        >
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search archives..."
            className="bg-transparent text-white text-xs focus:outline-none w-28 placeholder-gray-600"
          />
        </div>
        <Link to="/cart" className="text-gray-400 hover:text-yellow-400 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </Link>
        <Link to="/profile" className="text-gray-400 hover:text-yellow-400 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>
      </div>
    </nav>
  );

  // ── FOOTER (shared) ───────────────────────────────────
  const Footer = () => (
    <footer style={{ backgroundColor: '#0d0d00' }} className="border-t border-yellow-900 px-8 py-12 mt-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
            <span className="text-white font-black italic text-sm">
              '57 ARTS <span className="text-yellow-400">&</span> CUSTOMS
            </span>
          </div>
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
            Redefining luxury through the lens of craftsmanship and subculture.
            Every piece tells a unique story of heritage and innovation.
          </p>
          <div className="flex gap-3 mt-4 text-gray-500 text-lg">
            <span className="hover:text-yellow-400 cursor-pointer">⚡</span>
            <span className="hover:text-yellow-400 cursor-pointer">◎</span>
            <span className="hover:text-yellow-400 cursor-pointer">✉</span>
          </div>
        </div>
        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Explore</h4>
          {[
            { label: 'Latest Drops',    path: '/shop'         },
            { label: 'Custom Process',  path: '/custom-order' },
            { label: 'Lookbook',        path: '/gallery'      },
            { label: 'Materials',       path: '/gallery'      },
          ].map(item => (
            <Link key={item.label} to={item.path}
              className="block text-gray-500 text-sm mb-2 hover:text-yellow-400 transition">
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Support</h4>
          {[
            { label: 'Shipping & FAQ',   path: '/contact' },
            { label: 'Privacy Policy',   path: '/contact' },
            { label: 'Terms of Service', path: '/contact' },
            { label: 'Contact Us',       path: '/contact' },
          ].map(item => (
            <Link key={item.label} to={item.path}
              className="block text-gray-500 text-sm mb-2 hover:text-yellow-400 transition">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-yellow-900 pt-6 flex justify-between items-center">
        <p className="text-gray-600 text-xs">© 2024 '57 Arts & Customs. All Rights Reserved.</p>
        <div className="flex gap-6 text-xs text-gray-600 uppercase tracking-widest">
          <span>Est. 1957 / Rev. 2024</span>
          <span className="text-yellow-900">Designed For The Bold</span>
        </div>
      </div>
    </footer>
  );

  // ── LOOKBOOK FULL ENTRY READER ───────────────────────
  if (openEntry) {
    return (
      <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>
        <Subnav />
        <div className="max-w-3xl mx-auto px-8 py-10">
          <button
            onClick={() => setOpenEntry(null)}
            className="flex items-center gap-2 text-gray-500 text-sm hover:text-yellow-400 transition font-black mb-8"
          >
            ← Back to Lookbook
          </button>

          <div className="rounded-2xl overflow-hidden mb-8" style={{ height: '400px' }}>
            <img src={openEntry.images[0]} alt={openEntry.title}
              className="w-full h-full object-cover" />
          </div>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-yellow-400 bg-opacity-20 text-yellow-400 border border-yellow-900 text-xs font-black px-3 py-1 rounded-full">
              {openEntry.category}
            </span>
            <span className="bg-gray-800 text-gray-400 text-xs font-black px-3 py-1 rounded-full">
              {openEntry.tag}
            </span>
            <span className="text-gray-600 text-xs">{openEntry.date}</span>
            <span className="text-gray-600 text-xs">· {openEntry.readTime}</span>
          </div>

          <h1 className="text-white font-black text-3xl uppercase leading-tight mb-6">
            {openEntry.title}
          </h1>

          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black text-xs">
              {openEntry.avatar}
            </div>
            <div>
              <p className="text-white font-black text-sm">{openEntry.artisan}</p>
              <p className="text-gray-500 text-xs">Master Artisan · 57 Arts & Customs</p>
            </div>
          </div>

          <div className="space-y-5 mb-8">
            {openEntry.body.map((para, i) => (
              <p key={i} className="text-gray-300 text-sm leading-relaxed">{para}</p>
            ))}
          </div>

          {openEntry.images[1] && (
            <div className="rounded-2xl overflow-hidden mb-8" style={{ height: '300px' }}>
              <img src={openEntry.images[1]} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between pt-8 border-t border-gray-800">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleLike(openEntry.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-black text-sm transition ${
                  liked.includes(openEntry.id)
                    ? 'bg-yellow-400 border-yellow-400 text-black'
                    : 'border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                }`}
                style={!liked.includes(openEntry.id) ? { backgroundColor: '#2a2000' } : {}}
              >
                ♥ {liked.includes(openEntry.id) ? openEntry.likes + 1 : openEntry.likes}
              </button>
              <span className="text-gray-600 text-xs">💬 {openEntry.comments} comments</span>
            </div>
            <Link
              to={`/product/${openEntry.product}`}
              className="bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
            >
              View the Piece →
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>
      <Subnav />

      {/* ══ GALLERY TAB ══════════════════════════════════ */}
      {activeTab === 'Gallery' && (
        <>
          <div className="max-w-6xl mx-auto px-8 pt-14 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-yellow-400" />
                  <p className="text-yellow-400 text-xs font-black uppercase tracking-widest">
                    Archive 2024
                  </p>
                </div>
                <h1 className="text-7xl font-black uppercase leading-none">
                  <span className="text-white">Visual</span><br />
                  <span className="text-yellow-400">Gallery</span>
                </h1>
                <p className="text-gray-500 text-sm mt-4 max-w-sm leading-relaxed">
                  An immersive exploration of luxury street fashion, artisanal
                  furniture, and modern tribal beads. Handcrafted for the bold.
                </p>
              </div>
              <Link
                to="/custom-order"
                className="flex items-center gap-2 border border-yellow-400 text-yellow-400 px-6 py-3 rounded-full font-black text-sm hover:bg-yellow-400 hover:text-black transition mt-8"
              >
                Request Custom ↗
              </Link>
            </div>

            <div className="flex gap-3 flex-wrap mt-10">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full text-xs font-black transition ${
                    activeTag === tag
                      ? 'bg-yellow-400 text-black'
                      : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-8 pb-16">
            <div className="grid grid-cols-3 gap-5">
              {filteredGallery.slice(0, visibleCount).map(item => (
                <div
                  key={item.name}
                  className="relative group cursor-pointer rounded-2xl overflow-hidden"
                  style={{ height: '280px' }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-50 transition" />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-5"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
                  >
                    <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-1">
                      {item.tag}
                    </p>
                    <h3 className="text-white font-black text-base uppercase leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <button className="bg-yellow-400 text-black px-5 py-2 rounded-full font-black text-xs hover:bg-yellow-500 transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              {visibleCount < filteredGallery.length ? (
                <button
                  onClick={() => setVisibleCount(prev => prev + 3)}
                  className="flex items-center gap-2 mx-auto border border-gray-700 text-gray-400 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:border-yellow-400 hover:text-yellow-400 transition"
                >
                  <span className="text-xl">+</span> Discover More
                </button>
              ) : (
                <div className="flex items-center gap-3 justify-center text-gray-600 text-xs uppercase tracking-widest">
                  <div className="w-12 h-px bg-gray-700" />
                  <span>End of Collection</span>
                  <div className="w-12 h-px bg-gray-700" />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══ LOOKBOOK TAB ═════════════════════════════════ */}
      {activeTab === 'Lookbook' && (
        <>
          <div className="max-w-6xl mx-auto px-8 pt-14 pb-8">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-yellow-400" />
                  <p className="text-yellow-400 text-xs font-black uppercase tracking-widest">
                    Craft Journal
                  </p>
                </div>
                <h1 className="text-7xl font-black uppercase leading-none">
                  <span className="text-white">The</span><br />
                  <span className="text-yellow-400">Lookbook</span>
                </h1>
                <p className="text-gray-500 text-sm mt-4 max-w-sm leading-relaxed">
                  Behind every piece is a story. Our artisans document their
                  process, share their inspirations, and record the journey
                  from raw material to finished masterpiece.
                </p>
              </div>
              <div className="text-right pb-2">
                <p className="text-yellow-400 font-black text-3xl">{lookbookEntries.length}</p>
                <p className="text-gray-500 text-xs mb-3">Entries published</p>
                <p className="text-yellow-400 font-black text-3xl">
                  {lookbookEntries.reduce((a, b) => a + b.likes, 0)}
                </p>
                <p className="text-gray-500 text-xs">Total likes</p>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-700 focus-within:border-yellow-400 transition max-w-sm"
                style={{ backgroundColor: '#1a1a00' }}
              >
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={lbSearch}
                  onChange={e => setLbSearch(e.target.value)}
                  placeholder="Search entries, artisans..."
                  className="bg-transparent text-white text-sm outline-none flex-1 placeholder-gray-600"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {lookbookCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setLbCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-black transition ${
                      lbCategory === cat
                        ? 'bg-yellow-400 text-black'
                        : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <div className="w-px bg-gray-700 self-stretch mx-1" />
                {lookbookTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setLbTag(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-black transition ${
                      lbTag === tag
                        ? 'bg-yellow-400 bg-opacity-20 text-yellow-400 border border-yellow-900'
                        : 'border border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-8 pb-16">
            {filteredLookbook.length === 0 ? (
              <div
                className="rounded-2xl border border-dashed border-gray-700 p-16 text-center"
                style={{ backgroundColor: '#1a1a00' }}
              >
                <p className="text-gray-500 text-sm">No entries found matching your filters.</p>
              </div>
            ) : (
              <>
                {/* Featured entry */}
                <button
                  onClick={() => setOpenEntry(filteredLookbook[0])}
                  className="w-full rounded-2xl overflow-hidden border border-gray-800 mb-8 group hover:border-yellow-400 transition text-left"
                  style={{ backgroundColor: '#1a1a00' }}
                >
                  <div className="grid grid-cols-2">
                    <div className="relative overflow-hidden" style={{ height: '340px' }}>
                      <img
                        src={filteredLookbook[0].images[0]}
                        alt={filteredLookbook[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                        ✦ Featured
                      </div>
                    </div>
                    <div className="p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className="text-yellow-400 text-xs font-black px-2 py-1 rounded-full border border-yellow-900"
                            style={{ backgroundColor: '#2a2000' }}
                          >
                            {filteredLookbook[0].category}
                          </span>
                          <span
                            className="text-gray-500 text-xs font-black px-2 py-1 rounded-full border border-gray-700"
                            style={{ backgroundColor: '#2a2000' }}
                          >
                            {filteredLookbook[0].tag}
                          </span>
                        </div>
                        <h2 className="text-white font-black text-xl uppercase leading-tight mb-3">
                          {filteredLookbook[0].title}
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {filteredLookbook[0].excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center font-black text-black text-xs">
                            {filteredLookbook[0].avatar}
                          </div>
                          <div>
                            <p className="text-white font-black text-xs">{filteredLookbook[0].artisan}</p>
                            <p className="text-gray-600 text-xs">
                              {filteredLookbook[0].date} · {filteredLookbook[0].readTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-xs">
                          <span>♥ {filteredLookbook[0].likes}</span>
                          <span>💬 {filteredLookbook[0].comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Entry grid */}
                {filteredLookbook.length > 1 && (
                  <div className="grid grid-cols-3 gap-5">
                    {filteredLookbook.slice(1).map(entry => (
                      <button
                        key={entry.id}
                        onClick={() => setOpenEntry(entry)}
                        className="rounded-2xl border border-gray-800 overflow-hidden text-left group hover:border-yellow-400 transition flex flex-col"
                        style={{ backgroundColor: '#1a1a00' }}
                      >
                        <div className="relative overflow-hidden" style={{ height: '180px' }}>
                          <img
                            src={entry.images[0]}
                            alt={entry.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                          />
                          <div className="absolute top-3 left-3 bg-yellow-400 bg-opacity-90 text-black text-xs font-black px-2 py-0.5 rounded-full">
                            {entry.category}
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <span
                            className="text-gray-600 text-xs font-black border border-gray-800 px-2 py-0.5 rounded-full mb-2 self-start"
                            style={{ backgroundColor: '#2a2000' }}
                          >
                            {entry.tag}
                          </span>
                          <h3 className="text-white font-black text-sm leading-snug mb-2 flex-1">
                            {entry.title}
                          </h3>
                          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
                            {entry.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-yellow-400 flex items-center justify-center font-black text-black text-xs">
                                {entry.avatar}
                              </div>
                              <div>
                                <p className="text-white font-black text-xs">{entry.artisan}</p>
                                <p className="text-gray-700 text-xs">{entry.readTime}</p>
                              </div>
                            </div>
                            <span className="text-gray-600 text-xs">
                              ♥ {liked.includes(entry.id) ? entry.likes + 1 : entry.likes}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Artisan CTA */}
            <div
              className="mt-12 rounded-2xl border border-yellow-900 p-8 flex items-center justify-between"
              style={{ backgroundColor: '#2a2000' }}
            >
              <div>
                <p className="text-yellow-400 font-black text-sm uppercase tracking-widest mb-1">
                  Are you an artisan?
                </p>
                <p className="text-white font-black text-xl mb-1">
                  Share your story in the Lookbook.
                </p>
                <p className="text-gray-400 text-sm">
                  Document your craft, grow your audience, and connect buyers to your process.
                </p>
              </div>
              <Link
                to="/vendor"
                className="flex-shrink-0 bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition ml-8"
              >
                Become a Vendor →
              </Link>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;