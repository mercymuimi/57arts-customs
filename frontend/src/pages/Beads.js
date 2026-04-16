import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  goldHov: '#deba60',
};

const s = {
  section:    { maxWidth: 1200, margin: '0 auto', padding: '0 48px' },
  eyebrow:    { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 },
  h2:         { color: C.cream, fontSize: 36, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 },
  btnGold:    { backgroundColor: C.gold, color: '#000', padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  btnGhost:   { backgroundColor: 'transparent', color: C.cream, padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em', display: 'inline-block', cursor: 'pointer' },
  card:       { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 },
};

const beadsProducts = [
  { name: 'Gold-Infused Pulse Beads', desc: 'Ancestral Gold Edition',    price: 'KSH 12,325', tag: 'Best Seller', img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600', slug: 'gold-infused-obsidian-beads' },
  { name: 'Onyx Heritage Necklace',   desc: 'Matte Black Series',         price: 'KSH 17,400', tag: '',           img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', slug: 'traditional-bead-set' },
  { name: 'Midnight Custom Bracelet', desc: 'Bespoke Collection',         price: 'KSH 9,425',  tag: 'Limited',    img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600', slug: 'traditional-bead-set' },
  { name: 'Royal Ancestral Set',      desc: 'Limited Edition Trio',       price: 'KSH 28,275', tag: 'Exclusive',  img: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600', slug: 'traditional-bead-set' },
  { name: 'Kente Bead Stack',         desc: 'Modern African Heritage',    price: 'KSH 6,205',  tag: 'New',        img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600', slug: 'kente-bead-stack' },
  { name: 'Crimson Waist Beads',      desc: 'Ceremonial Collection',      price: 'KSH 5,800',  tag: '',           img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600', slug: 'traditional-bead-set' },
];

const filters = ['All Creations', 'Bracelets', 'Necklaces', 'Waist Beads'];

const storyPillars = [
  { title: 'Protection',  desc: 'Black onyx represents strength and grounding energy passed through generations of our ancestors.' },
  { title: 'Abundance',   desc: 'Gold accents signify the richness of our history and the brilliance of our future yet to come.' },
  { title: 'Identity',    desc: 'Each pattern and knot is a visual language — telling a story of lineage and belonging.' },
  { title: 'Resilience',  desc: 'Crafted to endure. Each bead is a testament to the strength of the cultures that created them.' },
];

// ── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '64px 0 36px' }}>
    <div style={s.section}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 64, marginBottom: 52 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 13, letterSpacing: '0.04em' }}>57 ARTS & CUSTOMS</span>
          </div>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 270 }}>
            Crafting the pulse of the ancestors for the visionaries of tomorrow. Premium beadwork with a soul.
          </p>
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Collections</h4>
          {['Beads & Waistbands', 'Ancestral Pulse', 'Modern Minimalist', 'The Custom Lab'].map(item => (
            <p key={item} style={{ color: C.muted, fontSize: 13, marginBottom: 9, cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{item}</p>
          ))}
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Company</h4>
          {[['About Us', '/about'], ['Vendor Program', '/vendor'], ['Contact', '/contact']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: C.muted, fontSize: 11 }}>© 2024 57 Arts & Customs. All rights reserved. Nairobi, Kenya.</p>
        <div style={{ display: 'flex', gap: 22 }}>
          {['Privacy Policy', 'Terms of Service'].map(label => (
            <Link key={label} to="/contact" style={{ color: C.muted, fontSize: 11, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ── COMPONENT ─────────────────────────────────────────────────────────────────
const Beads = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Creations');
  const [wishlist, setWishlist] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const toggleWishlist = (e, slug) => {
    e.stopPropagation();
    setWishlist(p => p.includes(slug) ? p.filter(s => s !== slug) : [...p, slug]);
  };

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* ANNOUNCEMENT BAR */}
      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Ancestral Pulse Collection · Heritage beadwork for the modern visionary · M-Pesa accepted
      </div>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1600" alt="Beads Hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,10,0.95) 40%, rgba(10,10,10,0.5))' }} />
        {/* Vertical rule */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: C.border }} />

        <div style={{ ...s.section, position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 580 }}>
            <p style={s.eyebrow}>Ancestral Pulse Collection</p>
            <h1 style={{ color: C.cream, fontSize: 80, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.88, marginBottom: 24 }}>
              Traditional<br />Craft <span style={{ color: C.gold }}>&</span><br />Modern<br />Style
            </h1>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, maxWidth: 400, marginBottom: 36 }}>
              Experience the soul of ancestral artistry through a Gen Z lens.
              Elegant gold-infused beadwork crafted for the modern visionary.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={s.btnGold} onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
                Shop All Pieces
              </button>
              <Link to="/custom-order" style={s.btnGhost}>Commission Custom Beads</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 40, marginTop: 56, paddingTop: 40, borderTop: `1px solid ${C.border}` }}>
              {[['720+', 'Heritage Pieces'], ['48', 'Artisans'], ['12', 'Countries Shipped']].map(([num, label]) => (
                <div key={label}>
                  <p style={{ color: C.gold, fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{num}</p>
                  <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FILTER TABS + PRODUCTS */}
      <section id="products" style={{ padding: '80px 0' }}>
        <div style={s.section}>
          {/* Section header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <p style={s.eyebrow}>The Collection</p>
              <h2 style={s.h2}>Heritage Beadwork</h2>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  style={{
                    padding: '8px 18px', borderRadius: 8, fontSize: 11, fontWeight: 900, letterSpacing: '0.06em',
                    cursor: 'pointer', border: `1px solid ${activeFilter === f ? C.gold : C.border}`,
                    backgroundColor: activeFilter === f ? C.gold : 'transparent',
                    color: activeFilter === f ? '#000' : C.muted, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (activeFilter !== f) e.currentTarget.style.borderColor = C.bHov; }}
                  onMouseLeave={e => { if (activeFilter !== f) e.currentTarget.style.borderColor = C.border; }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {beadsProducts.map(product => {
              const isHov = hoveredCard === product.slug + product.name;
              const inWish = wishlist.includes(product.slug + product.name);
              return (
                <div key={product.name}
                  onMouseEnter={() => setHoveredCard(product.slug + product.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(`/product/${product.slug}`)}
                  style={{ cursor: 'pointer' }}>
                  <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 320, backgroundColor: C.surface, border: `1px solid ${isHov ? C.bHov : C.border}`, transition: 'border-color 0.2s', marginBottom: 14 }}>
                    <img src={product.img} alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: isHov ? 'scale(1.06)' : 'scale(1)' }} />

                    {product.tag && (
                      <span style={{ position: 'absolute', top: 12, left: 12, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 900, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.1em' }}>
                        {product.tag}
                      </span>
                    )}

                    <button onClick={e => toggleWishlist(e, product.slug + product.name)}
                      style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: 'rgba(10,10,10,0.8)', color: inWish ? '#e74c3c' : C.muted, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {inWish ? '♥' : '♡'}
                    </button>

                    {/* Hover overlay */}
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', opacity: isHov ? 1 : 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: C.cream, fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${C.gold}`, paddingBottom: 2 }}>View Details →</span>
                    </div>
                  </div>

                  <p style={{ color: isHov ? C.gold : C.cream, fontSize: 14, fontWeight: 900, marginBottom: 4, transition: 'color 0.2s' }}>{product.name}</p>
                  <p style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>{product.desc}</p>
                  <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>{product.price}</p>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/shop" style={{ ...s.btnGhost, fontSize: 11 }}>View All Heritage Pieces →</Link>
          </div>
        </div>
      </section>

      {/* THE STORY BEHIND THE PULSE */}
      <section style={{ padding: '80px 0', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={s.section}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <p style={s.eyebrow}>Our Heritage</p>
              <h2 style={{ ...s.h2, marginBottom: 20 }}>The Story Behind<br />The <span style={{ color: C.gold }}>Pulse</span></h2>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.9, marginBottom: 36 }}>
                In our culture, beads are more than ornamentation — they are a visual language.
                Each pattern, colour, and knot tells a story of lineage, protection, and identity.
                57 Arts & Customs reclaims this heritage for a new generation.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {storyPillars.map(pillar => (
                  <div key={pillar.title} style={{ paddingLeft: 16, borderLeft: `2px solid ${C.gold}` }}>
                    <h4 style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{pillar.title}</h4>
                    <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', height: 440, border: `1px solid ${C.border}` }}>
                <img src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=700" alt="Beads crafting"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* Floating stat card */}
              <div style={{ position: 'absolute', bottom: -20, left: -20, backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px' }}>
                <p style={{ color: C.gold, fontSize: 32, fontWeight: 900, lineHeight: 1 }}>98%</p>
                <p style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BESPOKE CTA */}
      <section style={{ padding: '80px 0' }}>
        <div style={s.section}>
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ height: 2, backgroundColor: C.gold }} />
            <div style={{ padding: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
              <div>
                <p style={s.eyebrow}>Your Story, Bespoke</p>
                <h2 style={{ ...s.h2, marginBottom: 14 }}>Design Your Own<br />Heritage Piece</h2>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.85, maxWidth: 380 }}>
                  Don't just wear history — design it. Use our interactive customiser to select symbols,
                  materials, and lengths that resonate with your personal journey.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link to="/custom-order" style={{ ...s.btnGold, textAlign: 'center', padding: '14px' }}>
                  Launch Customiser →
                </Link>
                <Link to="/artisan-chat" style={{ ...s.btnGhost, textAlign: 'center', padding: '14px' }}>
                  Speak with an Artisan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: '80px 0', borderTop: `1px solid ${C.border}` }}>
        <div style={s.section}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <p style={s.eyebrow}>Join The Syndicate</p>
            <h2 style={{ ...s.h2, marginBottom: 12 }}>Drop Alerts &<br />Heritage Stories</h2>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 28 }}>
              Get exclusive access to new collection drops, artisan spotlights, and cultural deep-dives.
            </p>
            {!subscribed ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', color: C.cream, fontSize: 13, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = C.bHov} onBlur={e => e.target.style.borderColor = C.border} />
                <button onClick={() => { if (email) setSubscribed(true); }} style={{ ...s.btnGold, padding: '12px 20px', borderRadius: 10 }}>
                  Join →
                </button>
              </div>
            ) : (
              <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>✓ You're in. First drop arrives Friday.</p>
              </div>
            )}
            <p style={{ color: C.dim, fontSize: 11, marginTop: 10 }}>No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Beads;