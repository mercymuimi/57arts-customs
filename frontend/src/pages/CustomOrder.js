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
  btnGold:  { backgroundColor: C.gold, color: '#000', padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em', display: 'inline-block', border: 'none', cursor: 'pointer' },
  btnGhost: { backgroundColor: 'transparent', color: C.cream, padding: '13px 26px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, letterSpacing: '0.04em', display: 'inline-block', cursor: 'pointer' },
  input:    { backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', color: C.cream, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' },
  card:     { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 },
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const categories = [
  {
    id: 'fashion', icon: '👔', label: 'Fashion',
    desc: 'Bespoke apparel, statement pieces, and heritage-infused streetwear.',
    timeline: '2–4 Weeks', basePrice: 'KES 15,000',
    materials: [
      { id: 'organic-cotton',  name: 'Organic Cotton',       img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300' },
      { id: 'aso-oke',        name: 'Aso-Oke Hand-woven',   img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300' },
      { id: 'italian-velvet', name: 'Italian Velvet',        img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300' },
      { id: 'selvedge-denim', name: '14oz Selvedge Denim',  img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300' },
      { id: 'belgian-linen',  name: 'Belgian Linen',         img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300' },
      { id: 'kente-cloth',    name: 'Kente Cloth',           img: 'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=300' },
    ],
  },
  {
    id: 'furniture', icon: '🪑', label: 'Furniture',
    desc: 'Custom carved wood, sculptural metalwork, and functional art.',
    timeline: '4–8 Weeks', basePrice: 'KES 45,000',
    materials: [
      { id: 'solid-mahogany', name: 'Solid Mahogany',   img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300' },
      { id: 'teak-wood',      name: 'Teak Wood',         img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300' },
      { id: 'recycled-brass', name: 'Recycled Brass',    img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300' },
      { id: 'walnut',         name: 'Black Walnut',       img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300' },
      { id: 'reclaimed-oak',  name: 'Reclaimed Oak',      img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300' },
      { id: 'cast-iron',      name: 'Cast Iron',          img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300' },
    ],
  },
  {
    id: 'beads', icon: '💎', label: 'Beads & Jewelry',
    desc: 'Intricate traditional beadwork, modern accents, and luxury accessories.',
    timeline: '1–3 Weeks', basePrice: 'KES 8,000',
    materials: [
      { id: 'obsidian',        name: 'Genuine Obsidian',     img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300' },
      { id: 'gold-leaf',       name: '24k Gold Leaf',         img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=300' },
      { id: 'glass-beads',     name: 'Venetian Glass Beads', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300' },
      { id: 'sterling-silver', name: 'Sterling Silver',       img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300' },
      { id: 'coral',           name: 'Natural Coral',         img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300' },
      { id: 'turquoise',       name: 'Turquoise Stone',       img: 'https://images.unsplash.com/photo-1551651653-c5186a1524ba?w=300' },
    ],
  },
];

const aiRenders = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600',
];

const steps = [
  { num: '01', label: 'CATEGORY',  desc: 'Define the craft' },
  { num: '02', label: 'VISION',    desc: 'Sketch & Description' },
  { num: '03', label: 'MATERIALS', desc: 'Finishes & Textures' },
  { num: '04', label: 'REVIEW',    desc: 'Confirm & Quote' },
];

const aiProcess = [
  { icon: '✍', title: 'You Describe', desc: 'Share your vision, mood, references and inspiration.' },
  { icon: '◎', title: 'AI Analyzes',  desc: 'Our model identifies patterns, materials and structural possibilities.' },
  { icon: '▣', title: 'Draft Generated', desc: 'A visual concept is rendered from your description.' },
  { icon: '✦', title: 'Artisan Refines', desc: 'Master craftsmen take the AI draft and bring it to life.' },
];

// ── SHARED FOOTER ─────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '64px 0 36px' }}>
    <div style={s.section}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 64, marginBottom: 52 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#000' }}>57</div>
              <span style={{ color: C.cream, fontWeight: 900, fontSize: 13, letterSpacing: '0.04em' }}>57 ARTS & CUSTOMS</span>
            </Link>
          </div>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, maxWidth: 270, marginBottom: 18 }}>
            Redefining luxury through artisanal craftsmanship and AI-powered creativity. Built for the bold generation.
          </p>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.muted, fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', textDecoration: 'none', border: `1px solid ${C.border}`, padding: '6px 14px', borderRadius: 8 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.bHov; e.currentTarget.style.color = C.cream; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            ← Back to Home
          </Link>
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Shop</h4>
          {[['Fashion', '/fashion'], ['Furniture', '/furniture'], ['Beads & Jewelry', '/beads'], ['Gallery', '/gallery']].map(([label, path]) => (
            <Link key={label} to={path} style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 9, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: C.cream, fontWeight: 900, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 18 }}>Company</h4>
          {[['About Us', '/about'], ['Vendor Program', '/vendor'], ['Affiliate', '/affiliate'], ['Contact', '/contact']].map(([label, path]) => (
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
const CustomOrder = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [vision,           setVision]           = useState('');
  const [selectedMaterials,setSelectedMaterials] = useState([]);
  const [uploadedFiles,    setUploadedFiles]    = useState([]);
  const [dragOver,         setDragOver]         = useState(false);
  const [aiGenerating,     setAiGenerating]     = useState(false);
  const [aiRender,         setAiRender]         = useState(null);
  const [submitted,        setSubmitted]        = useState(false);
  const [submittedDraft,   setSubmittedDraft]   = useState(null);
  const [savedDraft,       setSavedDraft]       = useState(false);
  const [activeStep,       setActiveStep]       = useState(1);
  const [hovMat,           setHovMat]           = useState(null);
  const [renderConfirmed,  setRenderConfirmed]  = useState(false);

  const category = categories.find(c => c.id === selectedCategory);

  const toggleMaterial = (id) =>
    setSelectedMaterials(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(f => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      url: URL.createObjectURL(f),
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleGenerateRender = () => {
    if (!vision.trim()) return;
    setAiGenerating(true); setAiRender(null);
    setTimeout(() => {
      setAiRender(aiRenders[Math.floor(Math.random() * aiRenders.length)]);
      setAiGenerating(false);
    }, 2500);
  };

  const handleSaveDraft = () => {
    if (!selectedCategory) return;
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 3000);
  };

  const handleSubmit = () => {
    if (!selectedCategory || !vision.trim()) return;
    setSubmittedDraft({ category: selectedCategory, categoryLabel: category?.label, categoryIcon: category?.icon, vision, materials: selectedMaterials, filesCount: uploadedFiles.length, aiRender, timeline: category?.timeline, basePrice: category?.basePrice });
    setSubmitted(true);
  };

  const progressPct = !selectedCategory ? 0 : !vision ? 25 : selectedMaterials.length === 0 ? 50 : aiRender ? 100 : 75;

  // ── SUBMITTED STATE ────────────────────────────────────────────────────────
  if (submitted && submittedDraft) {
    return (
      <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          {/* Icon */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>✦</div>
          <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 32, textTransform: 'uppercase', marginBottom: 8 }}>Vision Submitted!</h1>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 28 }}>
            Your custom order brief has been sent to our master artisans.
            You'll receive a quote within <span style={{ color: C.gold, fontWeight: 900 }}>24–48 hours</span>.
          </p>

          {/* Summary */}
          <div style={{ ...s.card, padding: 24, marginBottom: 16, textAlign: 'left' }}>
            <p style={{ ...s.eyebrow, marginBottom: 16 }}>Brief Summary</p>
            {[
              { label: 'Category',  value: submittedDraft.categoryLabel },
              { label: 'Materials', value: `${submittedDraft.materials.length} selected` },
              { label: 'Files',     value: `${submittedDraft.filesCount} uploaded` },
              { label: 'AI Render', value: submittedDraft.aiRender ? 'Generated ✓' : 'Not generated', green: !!submittedDraft.aiRender },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: C.muted, fontSize: 12 }}>{row.label}</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: row.green ? '#4ade80' : C.cream }}>{row.value}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: C.muted, fontSize: 12 }}>Est. Base Price</span>
              <span style={{ color: C.gold, fontWeight: 900, fontSize: 20 }}>{submittedDraft.basePrice}+</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ color: C.muted, fontSize: 12 }}>Est. Timeline</span>
              <span style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>{submittedDraft.timeline}</span>
            </div>
            {submittedDraft.vision && (
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 14, paddingTop: 14 }}>
                <p style={{ ...s.eyebrow, marginBottom: 6 }}>Your Vision</p>
                <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, fontStyle: 'italic' }}>"{submittedDraft.vision}"</p>
              </div>
            )}
          </div>

          {/* What happens next */}
          <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ height: 2, backgroundColor: C.gold, borderRadius: 2, marginBottom: 18 }} />
            <p style={s.eyebrow}>What Happens Next</p>
            {['Artisan reviews your brief and vision', 'You receive a detailed quote + timeline', 'Approve quote and make payment', 'Crafting begins — track progress live'].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < 3 ? 12 : 0 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: C.gold, color: '#000', fontWeight: 900, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p style={{ color: C.muted, fontSize: 12 }}>{text}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/vision-board" style={{ ...s.btnGold, flex: 1, textAlign: 'center', padding: '13px' }}>View Vision Board</Link>
            <Link to="/shop"         style={{ ...s.btnGhost, flex: 1, textAlign: 'center', padding: '13px' }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN FORM ──────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* ANNOUNCEMENT BAR */}
      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        AI-Powered Custom Design Studio · 3 categories · Master artisans · M-Pesa accepted
      </div>

      {/* HERO */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '64px 0' }}>
        <div style={s.section}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 20, height: 1, backgroundColor: C.gold }} />
                <p style={{ ...s.eyebrow, marginBottom: 0 }}>AI-Powered Creation</p>
              </div>
              <h1 style={{ color: C.cream, fontSize: 60, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: 20 }}>
                Custom<br />Design<br /><span style={{ color: C.gold }}>Studio.</span>
              </h1>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.85, maxWidth: 380, marginBottom: 24 }}>
                Co-create your masterpiece with AI-powered precision. Our bespoke process combines traditional African craftsmanship with future-forward generative design.
              </p>
              <Link to="/vision-board" style={{ ...s.btnGhost, fontSize: 11, padding: '10px 20px' }}>
                🎨 View My Vision Board
              </Link>
            </div>

            {/* Step tracker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {steps.map((step, i) => {
                const isActive = activeStep === i + 1;
                const isDone   = activeStep > i + 1;
                return (
                  <div key={step.num} onClick={() => setActiveStep(i + 1)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, cursor: 'pointer', border: `1px solid ${isActive ? C.gold : C.border}`, backgroundColor: isActive ? 'rgba(201,168,76,0.06)' : 'transparent', opacity: !isActive && !isDone ? 0.45 : 1, transition: 'all 0.2s' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11,
                      backgroundColor: isDone ? C.gold : 'transparent',
                      border: isDone ? 'none' : `2px solid ${isActive ? C.gold : C.border}`,
                      color: isDone ? '#000' : isActive ? C.gold : C.muted }}>
                      {isDone ? '✓' : step.num}
                    </div>
                    <div>
                      <p style={{ color: isActive ? C.cream : C.muted, fontWeight: 900, fontSize: 12, letterSpacing: '0.06em' }}>{step.label}</p>
                      <p style={{ color: C.dim, fontSize: 11, marginTop: 2 }}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* FORM BODY */}
      <div style={{ ...s.section, padding: '52px 48px 32px', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* AI PROGRESS BANNER */}
        <div style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontSize: 16, flexShrink: 0 }}>✦</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: C.gold, fontWeight: 900, fontSize: 12, marginBottom: 2 }}>AI Design Assist</p>
            <p style={{ color: C.muted, fontSize: 12 }}>Our AI analyzes your vision and preferences to suggest material harmonies and structural optimizations.</p>
          </div>
          <div style={{ width: 140, flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: C.muted, fontSize: 10 }}>Progress</span>
              <span style={{ color: C.gold, fontWeight: 900, fontSize: 10 }}>{progressPct}%</span>
            </div>
            <div style={{ height: 4, backgroundColor: C.border, borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: C.gold, borderRadius: 100, width: `${progressPct}%`, transition: 'width 0.7s ease' }} />
            </div>
          </div>
        </div>

        {/* STEP 1 — CATEGORY */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ backgroundColor: C.gold, color: '#000', fontWeight: 900, fontSize: 10, padding: '5px 10px', borderRadius: 7, letterSpacing: '0.08em' }}>Step 1</span>
            <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 22 }}>Choose your <span style={{ color: C.gold }}>Canvas</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {categories.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSelectedMaterials([]); setActiveStep(2); }}
                  style={{ padding: 24, borderRadius: 16, border: `2px solid ${active ? C.gold : C.border}`, backgroundColor: active ? 'rgba(201,168,76,0.06)' : C.surface, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = C.bHov; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = C.border; }}>
                  <span style={{ fontSize: 32, display: 'block', marginBottom: 14 }}>{cat.icon}</span>
                  <p style={{ color: active ? C.gold : C.cream, fontWeight: 900, fontSize: 15, marginBottom: 8 }}>{cat.label}</p>
                  <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>{cat.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                    <span style={{ color: C.dim, fontSize: 11 }}>{cat.timeline}</span>
                    <span style={{ color: C.gold, fontWeight: 900, fontSize: 11 }}>From {cat.basePrice}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2 — VISION */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ backgroundColor: C.gold, color: '#000', fontWeight: 900, fontSize: 10, padding: '5px 10px', borderRadius: 7, letterSpacing: '0.08em' }}>Step 2</span>
            <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 22 }}>Describe your <span style={{ color: C.gold }}>Vision</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Text area */}
            <div>
              <textarea
                value={vision}
                onChange={e => { setVision(e.target.value); if (e.target.value && activeStep < 3) setActiveStep(3); }}
                placeholder="Describe the vibe, dimensions, colours, and cultural references you have in mind. The more detail, the better our AI can assist..."
                rows={8}
                style={{ ...s.input, resize: 'none', lineHeight: 1.7 }}
                onFocus={e => e.target.style.borderColor = C.bHov}
                onBlur={e => e.target.style.borderColor = C.border}
              />
              <p style={{ color: C.dim, fontSize: 11, marginTop: 6 }}>{vision.length} characters</p>

              {/* AI Generate button */}
              <button onClick={handleGenerateRender} disabled={!vision.trim()}
                style={{ ...s.btnGold, marginTop: 14, width: '100%', padding: '12px', borderRadius: 10, opacity: vision.trim() ? 1 : 0.4, cursor: vision.trim() ? 'pointer' : 'not-allowed', textAlign: 'center', boxSizing: 'border-box' }}>
                {aiGenerating ? '⟳ Generating Concept...' : '✦ Generate AI Concept Render'}
              </button>
            </div>

            {/* File upload + AI render */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Drag & drop */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }}
                style={{ border: `2px dashed ${dragOver ? C.gold : C.border}`, borderRadius: 14, padding: '28px 20px', textAlign: 'center', backgroundColor: dragOver ? 'rgba(201,168,76,0.05)' : C.faint, transition: 'all 0.2s', cursor: 'pointer' }}
                onClick={() => document.getElementById('file-input').click()}>
                <input id="file-input" type="file" multiple hidden onChange={e => handleFileUpload(e.target.files)} />
                <p style={{ fontSize: 28, marginBottom: 8 }}>📎</p>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, marginBottom: 4 }}>Drop reference images or sketches</p>
                <p style={{ color: C.muted, fontSize: 11 }}>PNG, JPG, PDF — up to 10MB each</p>
              </div>

              {uploadedFiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {uploadedFiles.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                      <span style={{ color: C.gold, fontSize: 12 }}>✓</span>
                      <span style={{ color: C.cream, fontSize: 11, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                      <span style={{ color: C.muted, fontSize: 10 }}>{f.size}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* AI render preview */}
              {aiGenerating && (
                <div style={{ ...s.card, padding: 20, textAlign: 'center' }}>
                  <p style={{ color: C.gold, fontWeight: 900, fontSize: 12, marginBottom: 12 }}>⟳ AI is visualising your concept...</p>
                  <div style={{ height: 4, backgroundColor: C.border, borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: C.gold, borderRadius: 100, width: '70%', animation: 'pulse 1.5s infinite' }} />
                  </div>
                </div>
              )}
              {aiRender && !aiGenerating && (
                <div style={{ ...s.card, border: renderConfirmed ? `2px solid ${C.gold}` : `1px solid ${C.border}`, transition: 'border-color 0.3s' }}>
                  <div style={{ position: 'relative', borderRadius: '14px 14px 0 0', overflow: 'hidden', height: 160 }}>
                    <img src={aiRender} alt="AI Concept Render" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {renderConfirmed && (
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#000', fontWeight: 900 }}>✓</div>
                      </div>
                    )}
                  </div>
                  {renderConfirmed && (
                    <div style={{ padding: '8px 14px', backgroundColor: 'rgba(201,168,76,0.08)', borderBottom: `1px solid ${C.border}` }}>
                      <p style={{ color: C.gold, fontWeight: 900, fontSize: 11, textAlign: 'center', letterSpacing: '0.06em' }}>✓ Render confirmed — attached to your brief</p>
                    </div>
                  )}
                  <div style={{ padding: '12px 14px', display: 'flex', gap: 8 }}>
                    <button onClick={() => { setRenderConfirmed(false); handleGenerateRender(); }}
                      style={{ ...s.btnGhost, flex: 1, textAlign: 'center', padding: '9px', fontSize: 11 }}>Regenerate</button>
                    <button
                      onClick={() => {
                        setRenderConfirmed(true);
                        setActiveStep(prev => Math.max(prev, 4));
                        // scroll to Step 3 materials section
                        setTimeout(() => {
                          const el = document.getElementById('step3-materials');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 200);
                      }}
                      style={{
                        ...s.btnGold, flex: 1, textAlign: 'center', padding: '9px', fontSize: 11,
                        backgroundColor: renderConfirmed ? '#1a3a1a' : C.gold,
                        color: renderConfirmed ? C.green : '#000',
                      }}>
                      {renderConfirmed ? '✓ Confirmed!' : 'Use This →'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 3 — MATERIALS */}
        <div id="step3-materials">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ backgroundColor: C.gold, color: '#000', fontWeight: 900, fontSize: 10, padding: '5px 10px', borderRadius: 7, letterSpacing: '0.08em' }}>Step 3</span>
            <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 22 }}>Select <span style={{ color: C.gold }}>Materials</span></h2>
          </div>

          {!selectedCategory ? (
            <div style={{ ...s.card, padding: 48, textAlign: 'center', border: `2px dashed ${C.border}` }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>🎨</p>
              <p style={{ color: C.muted, fontSize: 13 }}>← Choose a canvas category first to see available materials</p>
            </div>
          ) : (
            <>
              <p style={{ color: C.muted, fontSize: 12, marginBottom: 20 }}>
                Materials for <span style={{ color: C.gold, fontWeight: 900 }}>{category.label}</span> — select all that apply
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                {category.materials.map(mat => {
                  const selected = selectedMaterials.includes(mat.id);
                  const hov = hovMat === mat.id;
                  return (
                    <button key={mat.id}
                      onClick={() => { toggleMaterial(mat.id); setActiveStep(prev => Math.max(prev, 3)); }}
                      onMouseEnter={() => setHovMat(mat.id)}
                      onMouseLeave={() => setHovMat(null)}
                      style={{ borderRadius: 12, overflow: 'hidden', border: `2px solid ${selected ? C.gold : hov ? C.bHov : C.border}`, cursor: 'pointer', padding: 0, transition: 'border-color 0.15s', backgroundColor: 'transparent' }}>
                      <div style={{ position: 'relative', height: 90, overflow: 'hidden' }}>
                        <img src={mat.img} alt={mat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hov ? 'scale(1.07)' : 'scale(1)' }} />
                        {selected && (
                          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: C.gold, color: '#000', fontWeight: 900, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '8px 6px', backgroundColor: C.surface }}>
                        <p style={{ color: selected ? C.gold : C.cream, fontSize: 10, fontWeight: 900, textAlign: 'center', lineHeight: 1.3 }}>{mat.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* AI PROCESS SECTION */}
        <div style={{ paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p style={s.eyebrow}>How It Works</p>
            <h2 style={{ color: C.cream, fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>The AI Design Assist Process</h2>
            <p style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>How we blend futuristic technology with ancestral craft.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {aiProcess.map((item, i) => (
              <div key={item.title} style={{ ...s.card, padding: 22, position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', top: 32, right: -8, width: 16, height: 1, backgroundColor: C.border, zIndex: 1 }} />}
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, fontSize: 18, marginBottom: 14 }}>{item.icon}</div>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 8 }}>{item.title}</p>
                <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div style={{ position: 'sticky', bottom: 0, backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div>
            <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Timeline</p>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 14 }}>{category?.timeline || '—'}</p>
          </div>
          <div style={{ width: 1, height: 32, backgroundColor: C.border }} />
          <div>
            <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Starting at</p>
            <p style={{ color: C.gold, fontWeight: 900, fontSize: 14 }}>{category?.basePrice || '—'}</p>
          </div>
          {selectedMaterials.length > 0 && (
            <>
              <div style={{ width: 1, height: 32, backgroundColor: C.border }} />
              <div>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Materials</p>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 14 }}>{selectedMaterials.length} selected</p>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {savedDraft && <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 900 }}>✓ Draft Saved!</span>}
          <button onClick={handleSaveDraft} disabled={!selectedCategory}
            style={{ ...s.btnGhost, padding: '11px 20px', fontSize: 11, opacity: selectedCategory ? 1 : 0.4, cursor: selectedCategory ? 'pointer' : 'not-allowed' }}>
            Save Draft
          </button>
          <button onClick={handleSubmit} disabled={!selectedCategory || !vision.trim()}
            style={{ ...s.btnGold, padding: '11px 24px', fontSize: 11, letterSpacing: '0.08em', opacity: selectedCategory && vision.trim() ? 1 : 0.4, cursor: selectedCategory && vision.trim() ? 'pointer' : 'not-allowed' }}>
            SUBMIT VISION →
            {(!selectedCategory || !vision.trim()) && (
              <span style={{ opacity: 0.7, marginLeft: 6, fontSize: 10 }}>
                {!selectedCategory ? '(pick category)' : '(add description)'}
              </span>
            )}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomOrder;