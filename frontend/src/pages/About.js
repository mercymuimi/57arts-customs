import React from 'react';
import { Link } from 'react-router-dom';

const C = {
  bg: '#0a0a0a', surface: '#111111', border: '#1c1c1c', bHov: '#2e2e2e',
  faint: '#242424', cream: '#f0ece4', muted: '#606060', gold: '#c9a84c',
};
const s = {
  section: { maxWidth: 1200, margin: '0 auto', padding: '0 48px' },
  eyebrow: { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 },
  h2: { color: C.cream, fontSize: 40, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 },
};

const team = [
  { name: 'Amara Osei', role: 'Founder & Creative Director', initials: 'AO', bio: 'Former architect turned marketplace builder. Spent 7 years designing buildings before realising she wanted to build ecosystems.' },
  { name: 'Julian M.',  role: 'Head of Artisan Relations',   initials: 'JM', bio: 'Master woodworker with 20 years of craft. Bridges the gap between traditional technique and modern commerce.' },
  { name: 'Adaeze N.',  role: 'AI & Product Lead',           initials: 'AN', bio: 'ML engineer and textile obsessive. Built the visual search and recommendation engine from the ground up.' },
  { name: 'Kofi A.',    role: 'Head of Vendor Growth',       initials: 'KA', bio: 'Serial entrepreneur. Helped 50+ African artisans take their craft from local markets to global platforms.' },
];

const values = [
  { title: 'Heritage First',   desc: 'Every piece connects to a tradition. We build tools that honour craft knowledge, not replace it.', icon: '◈' },
  { title: 'Maker Economics',  desc: 'Artisans keep the majority of every sale. Fair compensation is not a feature — it is the model.', icon: '◇' },
  { title: 'Open AI',          desc: 'Our recommendation and pricing AI is transparent. Vendors see exactly how their products are ranked.', icon: '◉' },
  { title: 'African Scale',    desc: 'Built for Nairobi, Lagos, Accra, Dakar. M-Pesa native. Kiswahili and Pidgin supported.', icon: '△' },
];

const milestones = [
  { year: '2022', event: 'Founded in Nairobi by Amara Osei and Julian M.' },
  { year: '2023', event: 'First 100 artisans onboarded. KSH 4M in commissions processed.' },
  { year: '2023', event: 'Visual search AI launched. 87% match accuracy on first run.' },
  { year: '2024', event: '340+ vendors, 2,400+ products, 12,000+ orders. Expanding to Lagos and Accra.' },
];

const About = () => (
  <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

    {/* ── HERO ─────────────────────────────────────────────────────────────── */}
    <section style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400" alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.97) 55%, rgba(10,10,10,0.5))' }} />
      <div style={{ ...s.section, position: 'relative', zIndex: 1, padding: '80px 48px' }}>
        <p style={s.eyebrow}>Our Origin</p>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 700 }}>
          Tradition<br />Meets<br /><span style={{ color: C.gold, fontStyle: 'italic' }}>Technology.</span>
        </h1>
        <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.85, maxWidth: 420, marginBottom: 36 }}>
          We aren't just building a marketplace. We're building the infrastructure for African artisanal craft to reach the world — powered by AI, rooted in heritage.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/shop" style={{ backgroundColor: C.cream, color: '#000', padding: '13px 28px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none', letterSpacing: '0.04em' }}>
            Shop the Collections
          </Link>
          <Link to="/vendor" style={{ backgroundColor: 'transparent', color: C.cream, padding: '13px 28px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em' }}>
            Join as Artisan
          </Link>
        </div>
      </div>
    </section>

    {/* ── MISSION ──────────────────────────────────────────────────────────── */}
    <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface, padding: '80px 0' }}>
      <div style={{ ...s.section, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <p style={s.eyebrow}>Our Mission</p>
          <h2 style={{ ...s.h2, marginBottom: 20 }}>Empowering the<br />Makers of Africa.</h2>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.85, marginBottom: 20 }}>
            In a world that mass-produces everything, we exist to preserve the value of the handmade. Every piece on 57 Arts & Customs carries the fingerprints of the person who made it.
          </p>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.85, marginBottom: 32 }}>
            We provide artisans with technology they couldn't afford to build themselves — AI pricing, visual search, affiliate marketing, and a global storefront — so they can focus on the craft.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[{ v: '340+', l: 'Active Artisans' }, { v: 'KSH 4M+', l: 'Commissions Paid' }, { v: '98%', l: 'Satisfaction' }, { v: '50+', l: 'Countries Reached' }].map(({ v, l }) => (
              <div key={l} style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px' }}>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 24, letterSpacing: '-0.02em' }}>{v}</p>
                <p style={{ color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderRadius: 16, overflow: 'hidden', height: 480, border: `1px solid ${C.border}` }}>
          <img src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=700" alt="Artisan at work"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </section>

    {/* ── VALUES ───────────────────────────────────────────────────────────── */}
    <section style={{ padding: '80px 0' }}>
      <div style={s.section}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={s.eyebrow}>What We Stand For</p>
          <h2 style={s.h2}>Our Values</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {values.map(v => (
            <div key={v.title} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <span style={{ color: C.gold, fontSize: 18, display: 'block', marginBottom: 16 }}>{v.icon}</span>
              <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>{v.title}</h3>
              <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.75 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── THE CRAFT ────────────────────────────────────────────────────────── */}
    <section style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '80px 0' }}>
      <div style={s.section}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={s.eyebrow}>Mastery in Detail</p>
          <h2 style={s.h2}>The Craft</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { title: 'Heritage',   desc: 'Decades of manual mastery preserved in every stitch, carving, and bead threaded.',     img: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600' },
            { title: 'Precision',  desc: 'Micron-level accuracy. Materials sourced, tested, and approved before a single cut.',   img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600' },
            { title: 'Uniqueness', desc: 'No two pieces are alike. Each carries the unique signature of the hand that made it.', img: 'https://images.unsplash.com/photo-1493106819501-8f9e5ce02e5d?w=600' },
          ].map(item => (
            <div key={item.title} style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ height: 220, overflow: 'hidden' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              </div>
              <div style={{ padding: 22 }}>
                <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 16, textTransform: 'uppercase', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── TIMELINE ─────────────────────────────────────────────────────────── */}
    <section style={{ padding: '80px 0' }}>
      <div style={s.section}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={s.eyebrow}>How Far We've Come</p>
          <h2 style={s.h2}>Our Story</h2>
        </div>
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ position: 'absolute', left: 60, top: 0, bottom: 0, width: 1, backgroundColor: C.border }} />
          {milestones.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 32, marginBottom: 40, position: 'relative' }}>
              <div style={{ width: 120, flexShrink: 0, textAlign: 'right', paddingTop: 2 }}>
                <span style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>{m.year}</span>
              </div>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: C.gold, flexShrink: 0, marginTop: 4, border: `3px solid ${C.bg}`, boxSizing: 'border-box' }} />
              <div style={{ flex: 1, backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 18px' }}>
                <p style={{ color: C.cream, fontSize: 13, lineHeight: 1.7 }}>{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── TEAM ─────────────────────────────────────────────────────────────── */}
    <section style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '80px 0' }}>
      <div style={s.section}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={s.eyebrow}>The People Behind It</p>
          <h2 style={s.h2}>Our Team</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {team.map(person => (
            <div key={person.name} style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: C.cream, marginBottom: 16 }}>
                {person.initials}
              </div>
              <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 14, marginBottom: 4 }}>{person.name}</h3>
              <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>{person.role}</p>
              <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>{person.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ──────────────────────────────────────────────────────────────── */}
    <section style={{ padding: '80px 0' }}>
      <div style={s.section}>
        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ height: 2, backgroundColor: C.gold }} />
          <div style={{ padding: '60px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
            <div>
              <p style={s.eyebrow}>Ready to Start?</p>
              <h2 style={{ ...s.h2, marginBottom: 12 }}>Join the Platform.</h2>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 400 }}>
                Whether you're a buyer looking for something unique or an artisan ready to take your craft global — 57 Arts & Customs was built for you.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
              <Link to="/shop" style={{ backgroundColor: C.cream, color: '#000', padding: '13px 28px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none', letterSpacing: '0.04em', textAlign: 'center' }}>
                Shop the Collections
              </Link>
              <Link to="/vendor" style={{ backgroundColor: 'transparent', color: C.cream, padding: '13px 28px', borderRadius: 10, fontWeight: 900, fontSize: 13, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em', textAlign: 'center' }}>
                Become an Artisan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
    <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
          <span style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>57 ARTS & CUSTOMS</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Home', '/'], ['Shop', '/shop'], ['Gallery', '/gallery'], ['Contact', '/contact'], ['Vendors', '/vendor']].map(([l, p]) => (
            <Link key={l} to={p} style={{ color: C.muted, fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream}
              onMouseLeave={e => e.target.style.color = C.muted}>{l}</Link>
          ))}
        </div>
        <p style={{ color: C.muted, fontSize: 11 }}>© 2024 57 Arts & Customs. Nairobi, Kenya.</p>
      </div>
    </footer>
  </div>
);

export default About;