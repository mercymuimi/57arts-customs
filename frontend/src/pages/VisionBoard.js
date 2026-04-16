import React, { useState, useEffect } from 'react';
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
  green:   '#4ade80',
  blue:    '#60a5fa',
  red:     '#f87171',
};

const s = {
  section:  { maxWidth: 1200, margin: '0 auto', padding: '0 48px' },
  eyebrow:  { color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 },
  btnGold:  { backgroundColor: C.gold, color: '#000', padding: '10px 20px', borderRadius: 9, fontWeight: 900, fontSize: 11, border: 'none', cursor: 'pointer', letterSpacing: '0.04em', textDecoration: 'none', display: 'inline-block' },
  btnGhost: { backgroundColor: 'transparent', color: C.cream, padding: '10px 20px', borderRadius: 9, fontWeight: 900, fontSize: 11, border: `1px solid ${C.border}`, cursor: 'pointer', letterSpacing: '0.04em', textDecoration: 'none', display: 'inline-block' },
  card:     { backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 },
};

// ── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  draft:         { label: 'Draft',          color: C.muted,  bg: C.faint,                        border: C.border,                     dot: C.dim   },
  submitted:     { label: 'Submitted',      color: C.blue,   bg: 'rgba(96,165,250,0.08)',         border: 'rgba(96,165,250,0.3)',        dot: C.blue  },
  quote_received:{ label: 'Quote Received', color: C.gold,   bg: 'rgba(201,168,76,0.08)',         border: 'rgba(201,168,76,0.3)',        dot: C.gold  },
  in_production: { label: 'In Production',  color: C.green,  bg: 'rgba(74,222,128,0.08)',         border: 'rgba(74,222,128,0.3)',        dot: C.green },
};

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_DRAFTS = [
  {
    id: 'mock_1', status: 'in_production', category: 'furniture', categoryLabel: 'Furniture', categoryIcon: '🪑',
    vision: 'A hand-carved teak throne with gold leaf detailing on the armrests, inspired by Yoruba royal furniture.',
    materialNames: ['Teak Wood', '24k Gold Leaf', 'Recycled Brass'],
    aiRender: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600',
    filesCount: 2, timeline: '4–8 Weeks', basePrice: 'KES 45,000',
    savedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'mock_2', status: 'quote_received', category: 'fashion', categoryLabel: 'Fashion', categoryIcon: '👔',
    vision: 'Oversized agbada-style jacket with neon geometric patterns and traditional Yoruba motifs.',
    materialNames: ['Aso-Oke Hand-woven', 'Kente Cloth'],
    aiRender: null, filesCount: 1, timeline: '2–4 Weeks', basePrice: 'KES 15,000',
    savedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'mock_3', status: 'draft', category: 'beads', categoryLabel: 'Beads & Jewelry', categoryIcon: '💎',
    vision: 'Multi-strand obsidian and gold waist beads with silver spacers.',
    materialNames: ['Genuine Obsidian', 'Sterling Silver'],
    aiRender: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
    filesCount: 0, timeline: '1–3 Weeks', basePrice: 'KES 8,000',
    savedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ── STATUS BADGE ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 100, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
      <span style={{ color: cfg.color, fontSize: 10, fontWeight: 900, letterSpacing: '0.06em' }}>{cfg.label}</span>
    </div>
  );
};

// ── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '52px 0 32px', marginTop: 32 }}>
    <div style={s.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
          <span style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>57 ARTS & CUSTOMS</span>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['New Order', '/custom-order'], ['Track Orders', '/order-tracking'], ['Contact', '/contact'], ['← Home', '/']].map(([label, path]) => (
            <Link key={label} to={path} style={{ color: C.muted, fontSize: 12, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
        <p style={{ color: C.dim, fontSize: 11 }}>© 2024 57 Arts & Customs.</p>
      </div>
    </div>
  </footer>
);

// ── COMPONENT ─────────────────────────────────────────────────────────────────
const VisionBoard = () => {
  const [drafts, setDrafts]               = useState([]);
  const [filter, setFilter]               = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [view, setView]                   = useState('grid');
  const [hovCard, setHovCard]             = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('57arts_drafts') || '[]');
      setDrafts([...stored, ...MOCK_DRAFTS]);
    } catch {
      setDrafts(MOCK_DRAFTS);
    }
  }, []);

  const handleDelete = (id) => {
    try {
      const stored = JSON.parse(localStorage.getItem('57arts_drafts') || '[]');
      localStorage.setItem('57arts_drafts', JSON.stringify(stored.filter(d => d.id !== id)));
    } catch (e) { console.error(e); }
    setDrafts(prev => prev.filter(d => d.id !== id));
    setDeleteConfirm(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    try {
      const stored = JSON.parse(localStorage.getItem('57arts_drafts') || '[]');
      localStorage.setItem('57arts_drafts', JSON.stringify(stored.map(d => d.id === id ? { ...d, status: newStatus } : d)));
    } catch (e) { console.error(e); }
  };

  const filtered = filter === 'all' ? drafts : drafts.filter(d => d.status === filter);
  const counts = {
    all:           drafts.length,
    draft:         drafts.filter(d => d.status === 'draft').length,
    submitted:     drafts.filter(d => d.status === 'submitted').length,
    quote_received:drafts.filter(d => d.status === 'quote_received').length,
    in_production: drafts.filter(d => d.status === 'in_production').length,
  };

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* ANNOUNCEMENT BAR */}
      <div style={{ backgroundColor: C.gold, color: '#000', fontSize: 11, fontWeight: 900, textAlign: 'center', padding: '7px 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Your Creative Studio · Track custom order progress · Manage your visions
      </div>

      {/* HEADER */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '52px 0 36px' }}>
        <div style={s.section}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.muted, marginBottom: 24 }}>
            <Link to="/" style={{ color: C.muted, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.gold} onMouseLeave={e => e.target.style.color = C.muted}>Home</Link>
            <span>›</span>
            <Link to="/custom-order" style={{ color: C.muted, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = C.gold} onMouseLeave={e => e.target.style.color = C.muted}>Custom Order</Link>
            <span>›</span>
            <span style={{ color: C.gold, fontWeight: 700 }}>Vision Board</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 20, height: 1, backgroundColor: C.gold }} />
                <p style={{ ...s.eyebrow, marginBottom: 0 }}>My Creative Studio</p>
              </div>
              <h1 style={{ color: C.cream, fontSize: 52, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: 10 }}>
                Vision <span style={{ color: C.gold }}>Board</span>
              </h1>
              <p style={{ color: C.muted, fontSize: 13 }}>
                {drafts.length} piece{drafts.length !== 1 ? 's' : ''} in your creative pipeline
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* View toggle */}
              <div style={{ display: 'flex', backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 9, overflow: 'hidden' }}>
                {[['▦', 'grid', 'Grid'], ['≡', 'list', 'List']].map(([icon, key, label]) => (
                  <button key={key} onClick={() => setView(key)}
                    style={{ padding: '8px 14px', fontSize: 11, fontWeight: 900, border: 'none', cursor: 'pointer', transition: 'all 0.15s', backgroundColor: view === key ? C.gold : 'transparent', color: view === key ? '#000' : C.muted }}>
                    {icon} {label}
                  </button>
                ))}
              </div>
              <Link to="/custom-order" style={{ ...s.btnGold, display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px' }}>
                + New Vision
              </Link>
            </div>
          </div>

          {/* Status summary dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: cfg.dot }} />
                <span style={{ color: C.muted, fontSize: 11 }}>{cfg.label}</span>
                <span style={{ color: cfg.color, fontWeight: 900, fontSize: 11 }}>{counts[key] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...s.section, padding: '36px 48px 64px' }}>

        {/* FILTER TABS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
          {[
            { key: 'all',           label: 'All Visions'    },
            { key: 'draft',         label: 'Drafts'         },
            { key: 'submitted',     label: 'Submitted'      },
            { key: 'quote_received',label: 'Quote Received' },
            { key: 'in_production', label: 'In Production'  },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 9, fontSize: 11, fontWeight: 900, cursor: 'pointer', transition: 'all 0.15s', border: `1px solid ${filter === tab.key ? C.gold : C.border}`, backgroundColor: filter === tab.key ? C.gold : C.faint, color: filter === tab.key ? '#000' : C.muted }}
              onMouseEnter={e => { if (filter !== tab.key) { e.currentTarget.style.borderColor = C.bHov; e.currentTarget.style.color = C.cream; } }}
              onMouseLeave={e => { if (filter !== tab.key) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; } }}>
              {tab.label}
              <span style={{ backgroundColor: filter === tab.key ? 'rgba(0,0,0,0.2)' : C.surface, color: filter === tab.key ? '#000' : C.dim, fontSize: 10, fontWeight: 900, padding: '1px 7px', borderRadius: 100 }}>
                {counts[tab.key] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div style={{ ...s.card, padding: 64, textAlign: 'center', border: `2px dashed ${C.border}` }}>
            <p style={{ fontSize: 44, marginBottom: 16 }}>🎨</p>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 18, marginBottom: 8 }}>No visions here yet</p>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 24, lineHeight: 1.7 }}>
              {filter === 'all'
                ? 'Start your first custom order brief and save it as a draft.'
                : `No ${filter.replace('_', ' ')} pieces found.`}
            </p>
            <Link to="/custom-order" style={s.btnGold}>+ Create New Vision</Link>
          </div>
        )}

        {/* GRID VIEW */}
        {view === 'grid' && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {filtered.map(draft => {
              const isHov = hovCard === draft.id;
              return (
                <div key={draft.id}
                  onMouseEnter={() => setHovCard(draft.id)}
                  onMouseLeave={() => setHovCard(null)}
                  style={{ backgroundColor: C.surface, border: `1px solid ${isHov ? C.bHov : C.border}`, borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s' }}>

                  {/* Image / render */}
                  <div style={{ position: 'relative', height: 170, backgroundColor: C.faint, overflow: 'hidden' }}>
                    {draft.aiRender ? (
                      <img src={draft.aiRender} alt="AI Render"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: isHov ? 'scale(1.06)' : 'scale(1)' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 36, marginBottom: 8 }}>{draft.categoryIcon}</span>
                        <p style={{ color: C.dim, fontSize: 11 }}>No render generated</p>
                      </div>
                    )}
                    {/* Status badge overlay */}
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <StatusBadge status={draft.status} />
                    </div>
                    {/* AI badge */}
                    {draft.aiRender && (
                      <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 900, padding: '3px 8px', borderRadius: 100, letterSpacing: '0.08em' }}>
                        ✦ AI
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '18px 18px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                          <span style={{ fontSize: 14 }}>{draft.categoryIcon}</span>
                          <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{draft.categoryLabel}</p>
                        </div>
                        <p style={{ color: C.dim, fontSize: 10 }}>{timeAgo(draft.savedAt)}</p>
                      </div>
                      <p style={{ color: C.gold, fontWeight: 900, fontSize: 12 }}>{draft.basePrice}+</p>
                    </div>

                    {/* Vision snippet */}
                    {draft.vision && (
                      <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.65, marginBottom: 12, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        "{draft.vision}"
                      </p>
                    )}

                    {/* Materials */}
                    {draft.materialNames.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                        {draft.materialNames.slice(0, 3).map(m => (
                          <span key={m} style={{ color: C.muted, fontSize: 10, padding: '3px 8px', borderRadius: 100, border: `1px solid ${C.border}`, backgroundColor: C.faint }}>{m}</span>
                        ))}
                        {draft.materialNames.length > 3 && (
                          <span style={{ color: C.dim, fontSize: 10, padding: '3px 8px', borderRadius: 100, border: `1px solid ${C.border}`, backgroundColor: C.faint }}>+{draft.materialNames.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
                      {draft.status === 'draft' && (<>
                        <Link to="/custom-order"
                          style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 900, padding: '8px', borderRadius: 8, border: `1px solid ${C.border}`, color: C.muted, textDecoration: 'none', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                          Edit
                        </Link>
                        <button onClick={() => handleStatusChange(draft.id, 'submitted')}
                          style={{ flex: 1, fontSize: 11, fontWeight: 900, padding: '8px', borderRadius: 8, backgroundColor: C.gold, color: '#000', border: 'none', cursor: 'pointer' }}>
                          Submit
                        </button>
                      </>)}
                      {draft.status === 'submitted' && (
                        <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: C.muted, padding: '8px' }}>
                          ⏳ Awaiting quote...
                        </div>
                      )}
                      {draft.status === 'quote_received' && (<>
                        <button
                          style={{ flex: 1, fontSize: 11, fontWeight: 900, padding: '8px', borderRadius: 8, backgroundColor: 'transparent', color: C.gold, border: `1px solid ${C.gold}`, cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.gold; e.currentTarget.style.color = '#000'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.gold; }}>
                          View Quote
                        </button>
                        <button onClick={() => handleStatusChange(draft.id, 'in_production')}
                          style={{ flex: 1, fontSize: 11, fontWeight: 900, padding: '8px', borderRadius: 8, backgroundColor: C.gold, color: '#000', border: 'none', cursor: 'pointer' }}>
                          Approve
                        </button>
                      </>)}
                      {draft.status === 'in_production' && (
                        <Link to="/order-tracking"
                          style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 900, padding: '8px', borderRadius: 8, backgroundColor: 'rgba(74,222,128,0.1)', color: C.green, border: `1px solid rgba(74,222,128,0.3)`, textDecoration: 'none' }}>
                          Track Order →
                        </Link>
                      )}
                      <button onClick={() => setDeleteConfirm(draft.id)}
                        style={{ width: 32, height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 12, transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.5)'; e.currentTarget.style.color = C.red; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* New vision card */}
            <Link to="/custom-order"
              style={{ border: `2px dashed ${C.border}`, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, minHeight: 320, textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.backgroundColor = 'transparent'; }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: `2px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: C.dim, marginBottom: 12, transition: 'all 0.2s' }}>+</div>
              <p style={{ color: C.dim, fontWeight: 900, fontSize: 13, transition: 'color 0.2s' }}>New Vision</p>
            </Link>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(draft => (
              <div key={draft.id}
                style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 18, padding: '18px 20px', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>

                {/* Thumbnail */}
                <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0, backgroundColor: C.faint }}>
                  {draft.aiRender
                    ? <img src={draft.aiRender} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{draft.categoryIcon}</div>
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>{draft.categoryLabel}</p>
                    <StatusBadge status={draft.status} />
                  </div>
                  {draft.vision && (
                    <p style={{ color: C.muted, fontSize: 12, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{draft.vision}"</p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <span style={{ color: C.dim, fontSize: 11 }}>{timeAgo(draft.savedAt)}</span>
                    <span style={{ color: C.dim }}>·</span>
                    <span style={{ color: C.dim, fontSize: 11 }}>{draft.materialNames.length} materials</span>
                    <span style={{ color: C.dim }}>·</span>
                    <span style={{ color: C.gold, fontWeight: 900, fontSize: 11 }}>{draft.basePrice}+</span>
                  </div>
                </div>

                {/* List actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {draft.status === 'draft' && (<>
                    <Link to="/custom-order"
                      style={{ fontSize: 11, fontWeight: 900, padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, color: C.muted, textDecoration: 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                      Edit
                    </Link>
                    <button onClick={() => handleStatusChange(draft.id, 'submitted')}
                      style={{ fontSize: 11, fontWeight: 900, padding: '7px 14px', borderRadius: 8, backgroundColor: C.gold, color: '#000', border: 'none', cursor: 'pointer' }}>
                      Submit
                    </button>
                  </>)}
                  {draft.status === 'submitted' && <span style={{ color: C.muted, fontSize: 11 }}>⏳ Awaiting quote</span>}
                  {draft.status === 'quote_received' && (
                    <button style={{ fontSize: 11, fontWeight: 900, padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.gold}`, color: C.gold, backgroundColor: 'transparent', cursor: 'pointer' }}>
                      View Quote
                    </button>
                  )}
                  {draft.status === 'in_production' && (
                    <Link to="/order-tracking"
                      style={{ fontSize: 11, fontWeight: 900, padding: '7px 14px', borderRadius: 8, backgroundColor: 'rgba(74,222,128,0.1)', color: C.green, border: `1px solid rgba(74,222,128,0.3)`, textDecoration: 'none' }}>
                      Track →
                    </Link>
                  )}
                  <button onClick={() => setDeleteConfirm(draft.id)}
                    style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 12 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(248,113,113,0.5)'; e.currentTarget.style.color = C.red; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
          <div style={{ ...s.card, padding: 36, maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <p style={{ fontSize: 36, marginBottom: 16 }}>🗑</p>
            <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 18, textTransform: 'uppercase', marginBottom: 10 }}>Delete this vision?</h3>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.75, marginBottom: 24 }}>
              This action cannot be undone. Your brief and AI render will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '12px', borderRadius: 10, fontWeight: 900, fontSize: 12, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.cream, cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.bHov; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                style={{ flex: 1, padding: '12px', borderRadius: 10, fontWeight: 900, fontSize: 12, border: 'none', backgroundColor: C.red, color: '#000', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default VisionBoard;