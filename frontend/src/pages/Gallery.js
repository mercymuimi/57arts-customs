import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg:      '#0a0a0a',
  surface: '#111111',
  border:  '#1c1c1c',
  bHov:    '#2e2e2e',
  faint:   '#242424',
  cream:   '#f0ece4',
  muted:   '#606060',
  dim:     '#333333',
  gold:    '#c9a84c',
};

const s = {
  section:  { maxWidth: 1200, margin: '0 auto', padding: '0 48px' },
  eyebrow:  { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 },
  btnGold:  { backgroundColor: C.gold, color: '#000', padding: '11px 22px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  btnGhost: { backgroundColor: 'transparent', color: C.cream, padding: '11px 22px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em', display: 'inline-block', cursor: 'pointer' },
  card:     { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 },
  input:    { backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.cream, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const galleryItems = [
  { name: 'GOLDEN DISTRESSED DENIM', tag: '#DenimCustoms',     category: 'FASHION',   slug: 'distressed-artisanal-denim', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600' },
  { name: 'THE OBSIDIAN THRONE',     tag: '#ArtisanalFurniture',category: 'FURNITURE', slug: 'vanguard-teak-chair',        img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600' },
  { name: 'CYBER-TRIBAL NECKPIECE',  tag: '#CyberBeads',        category: 'BEADS',     slug: 'gold-infused-obsidian-beads',img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600' },
  { name: 'SHADOW RIDER LEATHER',    tag: '#CustomApparel',     category: 'FASHION',   slug: 'midnight-velvet-blazer',     img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600' },
  { name: 'MAGMA COFFEE TABLE',      tag: '#ArtisanalFurniture',category: 'FURNITURE', slug: 'the-sculptor-chair',         img: 'https://images.unsplash.com/photo-1493106819501-8f9e5ce02e5d?w=600' },
  { name: 'HERITAGE PULSE SET',      tag: '#ModernBeads',       category: 'BEADS',     slug: 'traditional-bead-set',       img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600' },
];

const galleryTags = ['All Projects', '#DenimCustoms', '#ArtisanalFurniture', '#ModernBeads', '#StreetLuxe', '#CyberBeads'];

const lookbookEntries = [
  { id: 1, title: 'The Making of the Obsidian Throne', artisan: 'Master Julian', avatar: 'MJ', date: 'October 24, 2023', category: 'Furniture', tag: 'Behind the Scenes', readTime: '4 min read', excerpt: 'Three weeks of carving, two layers of obsidian inlay, and one near-disaster with the gold leaf. Here is the full story of how the Obsidian Throne came to life.', body: ['It started with a sketch on a napkin. The buyer had described something regal — a chair that felt like it belonged in a palace but also in a modern Nairobi living room.', 'The teak arrived from a supplier in Kisumu. Quarter-sawn, tight grain, exactly what I needed for the structural integrity the design demanded. I spent the first four days just preparing the wood.', 'The obsidian inlay was the most technically demanding part. Each piece had to be cut to within half a millimetre. I lost two pieces to cracking before I figured out the correct cutting angle.', 'The gold leaf application on the backrest nearly undid everything. I applied the first layer on a day with too much humidity and it lifted overnight. Starting over at that stage tested every bit of patience I have built over twenty years of craft.', 'But the final piece — when the last coat of varnish dried and I turned it in the light — it was everything the brief asked for and more.'], images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900'], product: 'vanguard-teak-chair', likes: 47, comments: 12 },
  { id: 2, title: 'Sourcing Aso-Oke in Lagos — A Two-Day Journey', artisan: 'Adaeze Obi', avatar: 'AO', date: 'October 18, 2023', category: 'Fashion', tag: 'Materials', readTime: '3 min read', excerpt: 'Finding the right hand-woven Aso-Oke for a bespoke agbada commission meant travelling to three markets across Lagos and negotiating with four weavers.', body: ['When the commission brief arrived — an oversized agbada with neon geometric panels on heritage Aso-Oke — I knew immediately I could not use the mass-produced fabric available locally.', 'I took the early bus to Lagos on a Tuesday. My first stop was Balogun market. The colours were extraordinary but the weave was too loose for the structural silhouette the design required.', 'The second market, tucked behind Tejuosho, is where I found Master Biodun. He has been weaving for thirty-eight years and still works on a wooden loom his grandfather built.', 'We agreed on a price over tea. He promised delivery in ten days. He delivered in seven.', 'The fabric arrived rolled in brown paper. When I unrolled it in my workshop the geometric pattern caught the afternoon light in a way I had not anticipated. It made the whole design feel inevitable.'], images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900', 'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=900'], product: 'distressed-artisanal-denim', likes: 63, comments: 18 },
  { id: 3, title: 'Gold Pulse Beads — Tradition Meets Geometry', artisan: 'Amina Yusuf', avatar: 'AY', date: 'October 10, 2023', category: 'Beads', tag: 'Craft Process', readTime: '5 min read', excerpt: 'Each bead in the Gold Pulse collection is individually wrapped in 24k gold leaf before stringing. A process that takes twelve hours per piece and cannot be rushed.', body: ['Beadwork in my family goes back four generations. My great-grandmother made ceremonial pieces for the Lamido court in Adamawa. I learned from my grandmother, who learned from hers.', 'The Gold Pulse collection started as an experiment. I wanted to see what happened when I took traditional Fulani bead geometry and applied it to obsidian. The contrast was immediately striking.', 'The gold leaf application is the most meditative part of the process. Each bead takes approximately forty minutes. I work in the early morning when the air is still and my hands are steadiest.', 'The stringing pattern encodes a traditional Fulani blessing for safe travel. It is not visible in the finished piece but it is there. I think the people who wear these pieces feel it even if they do not know it.'], images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900', 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=900'], product: 'gold-infused-obsidian-beads', likes: 89, comments: 24 },
  { id: 4, title: 'Why I Left Architecture to Make Furniture', artisan: 'Kofi Mensah', avatar: 'KM', date: 'October 3, 2023', category: 'Furniture', tag: 'Artisan Story', readTime: '6 min read', excerpt: 'Seven years designing buildings in Accra taught me everything about structure and almost nothing about soul. I found both when I walked into my grandfather\'s woodshop.', body: ['I graduated from KNUST with a first class degree in architecture. I had offers from three firms in Accra and one in London. I took the Accra job and spent seven years designing commercial buildings.', 'The pivot happened gradually and then all at once. My grandfather fell ill in 2018 and I spent a month in his village outside Kumasi. His woodshop had been there for fifty years.', 'I started working in the shop just to keep busy while he recovered. Within a week I realised I had not thought about a deadline or a client brief in days. I was just making things.', 'The architectural training turned out to be invaluable. I understand load distribution, joinery stress, material behaviour under climate variation. I design furniture the way architects design buildings — from the structure outward.'], images: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900'], product: 'vanguard-teak-chair', likes: 134, comments: 41 },
  { id: 5, title: 'The Midnight Velvet Blazer — A Commission Story', artisan: 'Fatima Al-Hassan', avatar: 'FA', date: 'September 28, 2023', category: 'Fashion', tag: 'Commission', readTime: '3 min read', excerpt: 'The buyer wanted something for a Lagos wedding that would photograph beautifully at night. The brief was three words: dark, structured, unforgettable.', body: ['Three words. That was the entire brief. Dark, structured, unforgettable. I love briefs like this because they give you the destination without prescribing the route.', 'I started with fabric research. Italian velvet in midnight navy was the obvious answer but obvious is not unforgettable. I sourced a double-weave velvet from a supplier in Milan.', 'The structure came from the lining. I used a boned internal corset construction borrowed from couture tailoring to give the blazer a sculptural shape that holds even when the wearer is dancing.', 'The buyer sent a photo from the wedding at 2am with no message. Just the photo. The blazer was doing exactly what it was supposed to do. That was enough.'], images: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900'], product: 'midnight-velvet-blazer', likes: 72, comments: 19 },
  { id: 6, title: 'Learning the Kente Loom at 34', artisan: 'Abena Asante', avatar: 'AA', date: 'September 20, 2023', category: 'Fashion', tag: 'Artisan Story', readTime: '4 min read', excerpt: 'I am not from a weaving family. I taught myself Kente on YouTube videos and a second-hand loom I bought from a retiring weaver in Kumasi.', body: ['Everyone assumes Kente weaving is inherited. It is often true — many of the great weavers in Bonwire learned from parents and grandparents. But craft traditions do not have to be blood traditions.', 'I found my first video tutorial at 2am during a period of unemployment in 2021. I watched it three times and then searched for a loom.', 'The first month was humbling. My patterns were inconsistent, my tension was wrong, and I wasted more yarn than I care to calculate. But the process of learning was exactly what I needed.', 'By month three I was producing pieces I was not ashamed of. By month eight I had my first commission. I cried after I delivered it.'], images: ['https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=900'], product: 'kente-bead-stack', likes: 156, comments: 53 },
];

const lookbookCategories = ['All', 'Furniture', 'Fashion', 'Beads'];
const lookbookTags       = ['All', 'Behind the Scenes', 'Materials', 'Craft Process', 'Artisan Story', 'Commission'];

// ── SHARED FOOTER ─────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '64px 0 36px' }}>
    <div style={s.section}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 64, marginBottom: 52 }}>
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 13, letterSpacing: '0.04em' }}>57 ARTS & CUSTOMS</span>
          </Link>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 270, marginBottom: 18 }}>
            Redefining luxury through artisanal craftsmanship and AI-powered creativity. Built for the bold generation.
          </p>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.muted, fontSize: 11, fontWeight: 900, textDecoration: 'none', border: `1px solid ${C.border}`, padding: '6px 14px', borderRadius: 8 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.bHov; e.currentTarget.style.color = C.cream; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            ← Back to Home
          </Link>
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Explore</h4>
          {[['Shop All', '/shop'], ['Custom Orders', '/custom-order'], ['Lookbook', '/gallery'], ['Fashion', '/fashion']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Support</h4>
          {[['About Us', '/about'], ['Vendor Program', '/vendor'], ['Contact Us', '/contact'], ['Privacy Policy', '/contact']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: C.muted, fontSize: 11 }}>© 2024 57 Arts & Customs. All rights reserved. Nairobi, Kenya.</p>
        <span style={{ color: C.dim, fontSize: 11 }}>Est. 1957 · Revised 2024 · Designed for the Bold</span>
      </div>
    </div>
  </footer>
);

// ── SHARED NAV ────────────────────────────────────────────────────────────────
const Subnav = ({ activeTab, setActiveTab, setOpenEntry, lbSearch, setLbSearch }) => (
  <nav style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}`, height: 58, display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
    <div style={{ ...s.section, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      {/* Left: Home + brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={{ color: C.muted, fontSize: 11, fontWeight: 900, letterSpacing: '0.06em', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = C.cream}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}>← Home</Link>
        <span style={{ color: C.border }}>|</span>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 26, height: 26, borderRadius: 5, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
          <span style={{ color: C.cream, fontWeight: 900, fontSize: 12, letterSpacing: '0.06em' }}>GALLERY</span>
        </Link>
      </div>

      {/* Centre: tabs */}
      <div style={{ display: 'flex', gap: 4 }}>
        {['Gallery', 'Lookbook'].map(tab => (
          <button key={tab} onClick={() => { setOpenEntry(null); setActiveTab(tab); }}
            style={{ padding: '6px 16px', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer', background: 'none', border: 'none', color: activeTab === tab ? C.gold : C.muted, borderBottom: `2px solid ${activeTab === tab ? C.gold : 'transparent'}`, transition: 'all 0.15s' }}
            onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = C.cream; }}
            onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = C.muted; }}>
            {tab}
          </button>
        ))}
        {[['Shop', '/shop'], ['About', '/about']].map(([label, path]) => (
          <Link key={label} to={path} style={{ padding: '6px 16px', fontSize: 11, fontWeight: 900, color: C.muted, textDecoration: 'none', borderRadius: 8 }}
            onMouseEnter={e => e.currentTarget.style.color = C.cream}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>{label}</Link>
        ))}
      </div>

      {/* Right: search + cart */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 12px' }}>
          <span style={{ color: C.muted, fontSize: 12 }}>◎</span>
          <input type="text" value={lbSearch} onChange={e => setLbSearch(e.target.value)} placeholder="Search archives…"
            style={{ background: 'transparent', border: 'none', color: C.cream, fontSize: 11, outline: 'none', width: 120 }} />
        </div>
        <Link to="/cart" style={{ color: C.muted, fontSize: 16, textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = C.gold}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}>◻</Link>
      </div>
    </div>
  </nav>
);

// ── COMPONENT ─────────────────────────────────────────────────────────────────
const Gallery = () => {
  const [activeTab,    setActiveTab]    = useState('Gallery');
  const [activeTag,    setActiveTag]    = useState('All Projects');
  const [visibleCount, setVisibleCount] = useState(6);
  const [lbCategory,   setLbCategory]  = useState('All');
  const [lbTag,        setLbTag]       = useState('All');
  const [lbSearch,     setLbSearch]    = useState('');
  const [openEntry,    setOpenEntry]   = useState(null);
  const [liked,        setLiked]       = useState([]);
  const [hovGallery,   setHovGallery]  = useState(null);
  const [hovCard,      setHovCard]     = useState(null);

  const filteredGallery  = activeTag === 'All Projects' ? galleryItems : galleryItems.filter(i => i.tag === activeTag);
  const filteredLookbook = lookbookEntries.filter(e => {
    const matchCat    = lbCategory === 'All' || e.category === lbCategory;
    const matchTag    = lbTag === 'All' || e.tag === lbTag;
    const matchSearch = !lbSearch || e.title.toLowerCase().includes(lbSearch.toLowerCase()) || e.artisan.toLowerCase().includes(lbSearch.toLowerCase()) || e.excerpt.toLowerCase().includes(lbSearch.toLowerCase());
    return matchCat && matchTag && matchSearch;
  });
  const toggleLike = id => setLiked(p => p.includes(id) ? p.filter(l => l !== id) : [...p, id]);

  // ── LOOKBOOK ARTICLE READER ──────────────────────────────────────────────
  if (openEntry) {
    return (
      <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>
        <Subnav activeTab="Lookbook" setActiveTab={setActiveTab} setOpenEntry={setOpenEntry} lbSearch={lbSearch} setLbSearch={setLbSearch} />
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '52px 48px 80px' }}>

          {/* Back */}
          <button onClick={() => setOpenEntry(null)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.muted, fontSize: 12, fontWeight: 900, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 36, letterSpacing: '0.06em' }}
            onMouseEnter={e => e.currentTarget.style.color = C.gold}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            ← Back to Lookbook
          </button>

          {/* Hero image */}
          <div style={{ borderRadius: 16, overflow: 'hidden', height: 420, border: `1px solid ${C.border}`, marginBottom: 32 }}>
            <img src={openEntry.images[0]} alt={openEntry.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Tags + meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <span style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: C.gold, border: `1px solid rgba(201,168,76,0.3)`, fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 100 }}>{openEntry.category}</span>
            <span style={{ backgroundColor: C.faint, color: C.muted, border: `1px solid ${C.border}`, fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 100 }}>{openEntry.tag}</span>
            <span style={{ color: C.dim, fontSize: 11 }}>{openEntry.date}</span>
            <span style={{ color: C.dim, fontSize: 11 }}>· {openEntry.readTime}</span>
          </div>

          <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 36, textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24 }}>{openEntry.title}</h1>

          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 28, borderBottom: `1px solid ${C.border}`, marginBottom: 36 }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#000', flexShrink: 0 }}>{openEntry.avatar}</div>
            <div>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 14 }}>{openEntry.artisan}</p>
              <p style={{ color: C.muted, fontSize: 12 }}>Master Artisan · 57 Arts & Customs</p>
            </div>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
            {openEntry.body.map((para, i) => (
              <p key={i} style={{ color: C.muted, fontSize: 14, lineHeight: 1.9 }}>{para}</p>
            ))}
          </div>

          {/* Second image */}
          {openEntry.images[1] && (
            <div style={{ borderRadius: 14, overflow: 'hidden', height: 300, border: `1px solid ${C.border}`, marginBottom: 36 }}>
              <img src={openEntry.images[1]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {/* Footer actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 28, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={() => toggleLike(openEntry.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, fontWeight: 900, fontSize: 13, cursor: 'pointer', border: `1px solid ${liked.includes(openEntry.id) ? C.gold : C.border}`, backgroundColor: liked.includes(openEntry.id) ? C.gold : 'transparent', color: liked.includes(openEntry.id) ? '#000' : C.muted, transition: 'all 0.2s' }}>
                ♥ {liked.includes(openEntry.id) ? openEntry.likes + 1 : openEntry.likes}
              </button>
              <span style={{ color: C.dim, fontSize: 12 }}>💬 {openEntry.comments} comments</span>
            </div>
            <Link to={`/product/${openEntry.product}`} style={s.btnGold}>View the Piece →</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── MAIN GALLERY / LOOKBOOK VIEW ─────────────────────────────────────────
  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* ANNOUNCEMENT BAR */}
      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        57 Arts & Customs · Visual Gallery & Craft Lookbook · Nairobi, Kenya
      </div>

      <Subnav activeTab={activeTab} setActiveTab={setActiveTab} setOpenEntry={setOpenEntry} lbSearch={lbSearch} setLbSearch={setLbSearch} />

      {/* ══ GALLERY TAB ══════════════════════════════════════════════════════ */}
      {activeTab === 'Gallery' && (
        <>
          {/* Hero */}
          <div style={{ padding: '72px 0 56px', borderBottom: `1px solid ${C.border}` }}>
            <div style={s.section}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 3, height: 36, backgroundColor: C.gold, borderRadius: 2 }} />
                    <p style={{ ...s.eyebrow, marginBottom: 0 }}>Archive 2024</p>
                  </div>
                  <h1 style={{ color: C.cream, fontSize: 80, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.88, marginBottom: 20 }}>
                    Visual<br /><span style={{ color: C.gold }}>Gallery</span>
                  </h1>
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 380 }}>
                    An immersive exploration of luxury street fashion, artisanal furniture, and modern tribal beads. Handcrafted for the bold.
                  </p>
                </div>
                <Link to="/custom-order" style={{ ...s.btnGhost, fontSize: 11 }}>Request Custom ↗</Link>
              </div>

              {/* Filter tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 40 }}>
                {galleryTags.map(tag => (
                  <button key={tag} onClick={() => setActiveTag(tag)}
                    style={{ padding: '8px 18px', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer', border: `1px solid ${activeTag === tag ? C.gold : C.border}`, backgroundColor: activeTag === tag ? C.gold : 'transparent', color: activeTag === tag ? '#000' : C.muted, transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (activeTag !== tag) e.currentTarget.style.borderColor = C.bHov; }}
                    onMouseLeave={e => { if (activeTag !== tag) e.currentTarget.style.borderColor = C.border; }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{ ...s.section, padding: '48px 48px 80px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {filteredGallery.slice(0, visibleCount).map(item => {
                const isHov = hovGallery === item.name;
                return (
                  <Link to={`/product/${item.slug}`} key={item.name}
                    onMouseEnter={() => setHovGallery(item.name)}
                    onMouseLeave={() => setHovGallery(null)}
                    style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 300, display: 'block', border: `1px solid ${isHov ? C.bHov : C.border}`, transition: 'border-color 0.2s', textDecoration: 'none' }}>
                    <img src={item.img} alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s', transform: isHov ? 'scale(1.06)' : 'scale(1)' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(0,0,0,${isHov ? 0.55 : 0.25})`, transition: 'background-color 0.3s' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 22px', background: 'linear-gradient(to top, rgba(10,10,10,0.92) 50%, transparent)' }}>
                      <p style={{ color: C.gold, fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 5 }}>{item.tag}</p>
                      <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{item.name}</h3>
                    </div>
                    {isHov && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ backgroundColor: C.gold, color: '#000', fontWeight: 900, fontSize: 11, padding: '8px 18px', borderRadius: 8, letterSpacing: '0.06em' }}>View Details →</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: 48 }}>
              {visibleCount < filteredGallery.length ? (
                <button onClick={() => setVisibleCount(p => p + 3)}
                  style={{ ...s.btnGhost, fontSize: 11 }}>+ Discover More</button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, color: C.dim, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  <div style={{ width: 48, height: 1, backgroundColor: C.border }} />
                  End of Collection
                  <div style={{ width: 48, height: 1, backgroundColor: C.border }} />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══ LOOKBOOK TAB ═════════════════════════════════════════════════════ */}
      {activeTab === 'Lookbook' && (
        <>
          {/* Hero */}
          <div style={{ padding: '72px 0 56px', borderBottom: `1px solid ${C.border}` }}>
            <div style={s.section}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 3, height: 36, backgroundColor: C.gold, borderRadius: 2 }} />
                    <p style={{ ...s.eyebrow, marginBottom: 0 }}>Craft Journal</p>
                  </div>
                  <h1 style={{ color: C.cream, fontSize: 80, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.88, marginBottom: 20 }}>
                    The<br /><span style={{ color: C.gold }}>Lookbook</span>
                  </h1>
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 380 }}>
                    Behind every piece is a story. Our artisans document their process — from raw material to finished masterpiece.
                  </p>
                </div>
                <div style={{ textAlign: 'right', paddingBottom: 8 }}>
                  <p style={{ color: C.gold, fontWeight: 900, fontSize: 40, lineHeight: 1 }}>{lookbookEntries.length}</p>
                  <p style={{ color: C.muted, fontSize: 11, marginBottom: 16 }}>Entries published</p>
                  <p style={{ color: C.gold, fontWeight: 900, fontSize: 40, lineHeight: 1 }}>{lookbookEntries.reduce((a, b) => a + b.likes, 0)}</p>
                  <p style={{ color: C.muted, fontSize: 11 }}>Total likes</p>
                </div>
              </div>

              {/* Filters */}
              <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {lookbookCategories.map(cat => (
                    <button key={cat} onClick={() => setLbCategory(cat)}
                      style={{ padding: '7px 16px', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer', border: `1px solid ${lbCategory === cat ? C.gold : C.border}`, backgroundColor: lbCategory === cat ? C.gold : 'transparent', color: lbCategory === cat ? '#000' : C.muted, transition: 'all 0.15s' }}>
                      {cat}
                    </button>
                  ))}
                  <div style={{ width: 1, height: 24, backgroundColor: C.border, margin: '0 4px' }} />
                  {lookbookTags.map(tag => (
                    <button key={tag} onClick={() => setLbTag(tag)}
                      style={{ padding: '7px 16px', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer', border: `1px solid ${lbTag === tag ? 'rgba(201,168,76,0.5)' : C.border}`, backgroundColor: lbTag === tag ? 'rgba(201,168,76,0.1)' : 'transparent', color: lbTag === tag ? C.gold : C.dim, transition: 'all 0.15s' }}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Entries */}
          <div style={{ ...s.section, padding: '48px 48px 80px' }}>
            {filteredLookbook.length === 0 ? (
              <div style={{ ...s.card, padding: 48, textAlign: 'center', border: `2px dashed ${C.border}` }}>
                <p style={{ color: C.muted, fontSize: 14 }}>No entries found matching your filters.</p>
              </div>
            ) : (
              <>
                {/* Featured entry */}
                <button onClick={() => setOpenEntry(filteredLookbook[0])}
                  style={{ width: '100%', ...s.card, marginBottom: 20, cursor: 'pointer', textAlign: 'left', display: 'block', transition: 'border-color 0.2s', padding: 0, overflow: 'hidden' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <div style={{ position: 'relative', height: 360, overflow: 'hidden' }}>
                      <img src={filteredLookbook[0].images[0]} alt={filteredLookbook[0].title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', top: 16, left: 16, backgroundColor: C.gold, color: '#000', fontSize: 10, fontWeight: 900, padding: '5px 12px', borderRadius: 100, letterSpacing: '0.1em' }}>✦ Featured</div>
                    </div>
                    <div style={{ padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                          <span style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: C.gold, border: `1px solid rgba(201,168,76,0.3)`, fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 100 }}>{filteredLookbook[0].category}</span>
                          <span style={{ backgroundColor: C.faint, color: C.muted, border: `1px solid ${C.border}`, fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 100 }}>{filteredLookbook[0].tag}</span>
                        </div>
                        <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 22, textTransform: 'uppercase', lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.01em' }}>{filteredLookbook[0].title}</h2>
                        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.75 }}>{filteredLookbook[0].excerpt}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#000' }}>{filteredLookbook[0].avatar}</div>
                          <div>
                            <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{filteredLookbook[0].artisan}</p>
                            <p style={{ color: C.dim, fontSize: 10 }}>{filteredLookbook[0].date} · {filteredLookbook[0].readTime}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 14, color: C.dim, fontSize: 12 }}>
                          <span>♥ {filteredLookbook[0].likes}</span>
                          <span>💬 {filteredLookbook[0].comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Entry grid */}
                {filteredLookbook.length > 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {filteredLookbook.slice(1).map(entry => {
                      const isHov = hovCard === entry.id;
                      return (
                        <button key={entry.id} onClick={() => setOpenEntry(entry)}
                          onMouseEnter={() => setHovCard(entry.id)} onMouseLeave={() => setHovCard(null)}
                          style={{ ...s.card, cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s', borderColor: isHov ? C.bHov : C.border, padding: 0, overflow: 'hidden' }}>
                          <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
                            <img src={entry.images[0]} alt={entry.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: isHov ? 'scale(1.06)' : 'scale(1)' }} />
                            <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 900, padding: '3px 10px', borderRadius: 100 }}>{entry.category}</div>
                          </div>
                          <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <span style={{ backgroundColor: C.faint, color: C.dim, border: `1px solid ${C.border}`, fontSize: 9, fontWeight: 900, padding: '3px 8px', borderRadius: 100, marginBottom: 10, alignSelf: 'flex-start', letterSpacing: '0.08em' }}>{entry.tag}</span>
                            <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 13, lineHeight: 1.35, marginBottom: 8, flex: 1 }}>{entry.title}</h3>
                            <p style={{ color: C.muted, fontSize: 11, lineHeight: 1.65, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{entry.excerpt}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 9, color: '#000' }}>{entry.avatar}</div>
                                <div>
                                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 11 }}>{entry.artisan}</p>
                                  <p style={{ color: C.dim, fontSize: 10 }}>{entry.readTime}</p>
                                </div>
                              </div>
                              <span style={{ color: C.dim, fontSize: 11 }}>♥ {liked.includes(entry.id) ? entry.likes + 1 : entry.likes}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Artisan CTA */}
                <div style={{ marginTop: 48, backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
                  <div style={{ height: 2, backgroundColor: C.gold }} />
                  <div style={{ padding: '36px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={s.eyebrow}>Are you an artisan?</p>
                      <p style={{ color: C.cream, fontWeight: 900, fontSize: 22, marginBottom: 6 }}>Share your story in the Lookbook.</p>
                      <p style={{ color: C.muted, fontSize: 13 }}>Document your craft, grow your audience, and connect buyers to your process.</p>
                    </div>
                    <Link to="/vendor" style={{ ...s.btnGold, flexShrink: 0, marginLeft: 40 }}>Become a Vendor →</Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;