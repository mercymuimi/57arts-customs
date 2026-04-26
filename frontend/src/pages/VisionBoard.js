import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg:       '#08080a',
  surface:  '#0f0f12',
  card:     '#13131a',
  border:   '#1e1e28',
  bHov:     '#2a2a38',
  faint:    '#1a1a22',
  cream:    '#f4f0e8',
  muted:    '#5a5a72',
  dim:      '#2e2e3e',
  gold:     '#c8a45a',
  goldSoft: '#e8c87a',
  green:    '#3fd98a',
  blue:     '#5b9cf6',
  red:      '#f06a6a',
  purple:   '#9b7fe8',
};

const s = {
  section:  { maxWidth: 1280, margin: '0 auto', padding: '0 40px' },
  eyebrow:  { color: C.gold, fontSize: 9, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 6 },
  btnGold:  { backgroundColor: C.gold, color: '#000', padding: '11px 22px', borderRadius: 8, fontWeight: 800, fontSize: 11, border: 'none', cursor: 'pointer', letterSpacing: '0.06em', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' },
  btnGhost: { backgroundColor: 'transparent', color: C.cream, padding: '11px 22px', borderRadius: 8, fontWeight: 800, fontSize: 11, border: `1px solid ${C.border}`, cursor: 'pointer', letterSpacing: '0.06em', textDecoration: 'none', display: 'inline-block' },
};

const STATUS_CONFIG = {
  draft:          { label: 'Draft',          color: C.muted,  bg: 'rgba(90,90,114,0.12)',   border: 'rgba(90,90,114,0.3)',   dot: C.muted,  step: 0 },
  pending:        { label: 'Submitted',      color: C.blue,   bg: 'rgba(91,156,246,0.10)',  border: 'rgba(91,156,246,0.3)',  dot: C.blue,   step: 1 },
  submitted:      { label: 'Submitted',      color: C.blue,   bg: 'rgba(91,156,246,0.10)',  border: 'rgba(91,156,246,0.3)',  dot: C.blue,   step: 1 },
  quoted:         { label: 'Quote Received', color: C.gold,   bg: 'rgba(200,164,90,0.10)',  border: 'rgba(200,164,90,0.3)',  dot: C.gold,   step: 2 },
  quote_received: { label: 'Quote Received', color: C.gold,   bg: 'rgba(200,164,90,0.10)',  border: 'rgba(200,164,90,0.3)',  dot: C.gold,   step: 2 },
  approved:       { label: 'Approved',       color: C.gold,   bg: 'rgba(200,164,90,0.10)',  border: 'rgba(200,164,90,0.3)',  dot: C.gold,   step: 2 },
  in_progress:    { label: 'In Production',  color: C.green,  bg: 'rgba(63,217,138,0.08)',  border: 'rgba(63,217,138,0.3)',  dot: C.green,  step: 3 },
  in_production:  { label: 'In Production',  color: C.green,  bg: 'rgba(63,217,138,0.08)',  border: 'rgba(63,217,138,0.3)',  dot: C.green,  step: 3 },
  delivered:      { label: 'Delivered',      color: C.green,  bg: 'rgba(63,217,138,0.08)',  border: 'rgba(63,217,138,0.3)',  dot: C.green,  step: 4 },
  cancelled:      { label: 'Cancelled',      color: C.red,    bg: 'rgba(240,106,106,0.08)', border: 'rgba(240,106,106,0.3)', dot: C.red,    step: -1 },
};

const TIMELINE_STEPS = ['Draft', 'Submitted', 'Quote', 'Production', 'Delivered'];
const CATEGORY_ICONS = { fashion: '👔', furniture: '🪑', beads: '💎' };

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// ── INJECT CSS ────────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById('vb-styles')) return;
  const el = document.createElement('style');
  el.id = 'vb-styles';
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;700&display=swap');

    .vb-root * { box-sizing: border-box; }

    .vb-card {
      background: ${C.card};
      border: 1px solid ${C.border};
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
      animation: cardIn 0.4s ease both;
    }
    .vb-card:hover {
      border-color: ${C.bHov};
      transform: translateY(-3px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    .vb-list-row {
      background: ${C.card};
      border: 1px solid ${C.border};
      border-radius: 14px;
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 18px 22px;
      transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
      animation: cardIn 0.4s ease both;
    }
    .vb-list-row:hover {
      border-color: ${C.bHov};
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.4);
    }

    @keyframes cardIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position: 600px 0; }
    }
    .vb-skeleton {
      border-radius: 16px;
      height: 340px;
      background: linear-gradient(90deg, ${C.card} 25%, ${C.faint} 50%, ${C.card} 75%);
      background-size: 1200px 100%;
      animation: shimmer 1.4s infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    .vb-spinner {
      width: 36px; height: 36px;
      border: 2px solid ${C.border};
      border-top-color: ${C.gold};
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .vb-btn-icon {
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 8px;
      border: 1px solid ${C.border}; background: transparent;
      color: ${C.muted}; cursor: pointer; font-size: 13px;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
      flex-shrink: 0;
    }
    .vb-btn-icon:hover { border-color: rgba(240,106,106,0.5); color: ${C.red}; background: rgba(240,106,106,0.06); }

    .vb-progress-bar {
      height: 3px; background: ${C.dim}; border-radius: 100px; overflow: hidden; margin-top: 6px;
    }
    .vb-progress-fill {
      height: 100%; border-radius: 100px;
      background: linear-gradient(90deg, ${C.gold}, ${C.goldSoft});
      transition: width 0.5s ease;
    }

    .vb-filter-btn {
      display: flex; align-items: center; gap: 7px;
      padding: 8px 16px; border-radius: 100px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 700;
      cursor: pointer; transition: all 0.15s;
      border: 1px solid ${C.border};
      background: transparent; color: ${C.muted};
      white-space: nowrap;
    }
    .vb-filter-btn:hover { border-color: ${C.bHov}; color: ${C.cream}; }
    .vb-filter-btn.active { border-color: ${C.gold}; background: ${C.gold}; color: #000; }
    .vb-filter-btn .count {
      background: rgba(0,0,0,0.15); color: inherit;
      font-size: 10px; font-weight: 800;
      padding: 1px 7px; border-radius: 100px;
    }
    .vb-filter-btn:not(.active) .count { background: ${C.surface}; color: ${C.dim}; }

    .vb-search {
      background: ${C.faint}; border: 1px solid ${C.border}; border-radius: 10px;
      color: ${C.cream}; font-family: 'DM Sans', sans-serif; font-size: 13px;
      padding: 10px 14px 10px 38px; outline: none; width: 240px;
      transition: border-color 0.2s, width 0.3s;
    }
    .vb-search:focus { border-color: ${C.gold}; width: 290px; }
    .vb-search::placeholder { color: ${C.muted}; }

    .vb-modal-backdrop {
      position: fixed; inset: 0; z-index: 200;
      background: rgba(0,0,0,0.88);
      display: flex; align-items: center; justify-content: center;
      padding: 24px;
      animation: fadeIn 0.18s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .vb-modal {
      background: ${C.card}; border: 1px solid ${C.border};
      border-radius: 20px; padding: 40px; max-width: 400px; width: 100%;
      text-align: center;
      animation: scaleIn 0.2s ease;
    }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }

    .vb-action-btn {
      flex: 1; font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 800;
      padding: 9px; border-radius: 9px;
      cursor: pointer; transition: all 0.15s; text-align: center;
      letter-spacing: 0.04em;
    }

    .vb-tag {
      color: ${C.muted}; font-size: 10px; font-weight: 700;
      padding: 3px 9px; border-radius: 100px;
      border: 1px solid ${C.border}; background: ${C.faint};
    }

    .vb-drag { cursor: grab; }
    .vb-drag:active { cursor: grabbing; }
    .vb-dragging { opacity: 0.4; transform: scale(0.97); }
    .vb-drag-over { border-color: ${C.gold} !important; box-shadow: 0 0 0 2px rgba(200,164,90,0.2); }

    /* Scrollbar */
    .vb-root ::-webkit-scrollbar { width: 4px; }
    .vb-root ::-webkit-scrollbar-track { background: transparent; }
    .vb-root ::-webkit-scrollbar-thumb { background: ${C.dim}; border-radius: 4px; }
  `;
  document.head.appendChild(el);
};

// ── STATUS BADGE ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 100, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
      <span style={{ color: cfg.color, fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif" }}>{cfg.label}</span>
    </div>
  );
};

// ── ORDER TIMELINE ────────────────────────────────────────────────────────────
const OrderTimeline = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const step = cfg.step;
  const cancelled = status === 'cancelled';
  if (cancelled) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0 4px' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.red }} />
      <span style={{ color: C.red, fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Order cancelled</span>
    </div>
  );
  const pct = Math.max(0, (step / (TIMELINE_STEPS.length - 1)) * 100);
  return (
    <div style={{ paddingTop: 10, paddingBottom: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        {TIMELINE_STEPS.map((label, i) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: i <= step ? C.gold : C.dim,
              border: i === step ? `2px solid ${C.goldSoft}` : '2px solid transparent',
              boxShadow: i === step ? `0 0 8px ${C.gold}` : 'none',
              transition: 'all 0.3s',
              flexShrink: 0,
            }} />
            <span style={{ color: i <= step ? C.gold : C.muted, fontSize: 8, fontWeight: i === step ? 800 : 500, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="vb-progress-bar">
        <div className="vb-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ── CARD ACTIONS ──────────────────────────────────────────────────────────────
const CardActions = ({ draft, onStatusChange, onDelete }) => (
  <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
    {draft.status === 'draft' && (<>
      <Link to="/custom-order"
        className="vb-action-btn"
        style={{ border: `1px solid ${C.border}`, color: C.muted, background: 'transparent', textDecoration: 'none' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
        Edit
      </Link>
      <button className="vb-action-btn" onClick={() => onStatusChange(draft.id, 'submitted')}
        style={{ border: 'none', background: C.gold, color: '#000' }}>
        Submit
      </button>
    </>)}
    {draft.status === 'submitted' && (
      <div style={{ flex: 1, textAlign: 'center', color: C.muted, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>⏳ Awaiting quote…</div>
    )}
    {draft.status === 'quote_received' && (<>
      <button className="vb-action-btn"
        style={{ border: `1px solid ${C.gold}`, color: C.gold, background: 'transparent' }}
        onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = '#000'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold; }}>
        View Quote
      </button>
      <button className="vb-action-btn" onClick={() => onStatusChange(draft.id, 'in_production')}
        style={{ border: 'none', background: C.gold, color: '#000' }}>
        Approve
      </button>
    </>)}
    {draft.status === 'in_production' && (
      <Link to="/order-tracking" className="vb-action-btn"
        style={{ background: 'rgba(63,217,138,0.1)', color: C.green, border: `1px solid rgba(63,217,138,0.3)`, textDecoration: 'none' }}>
        Track Order →
      </Link>
    )}
    {draft.status === 'delivered' && (
      <div className="vb-action-btn" style={{ background: 'rgba(63,217,138,0.08)', color: C.green, border: `1px solid rgba(63,217,138,0.2)` }}>
        ✓ Delivered
      </div>
    )}
    <button className="vb-btn-icon" onClick={() => onDelete(draft.id)}>✕</button>
  </div>
);

// ── SKELETON LOADER ───────────────────────────────────────────────────────────
const SkeletonGrid = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="vb-skeleton" style={{ animationDelay: `${i * 0.08}s` }} />
    ))}
  </div>
);

// ── FOOTER ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '52px 0 32px', marginTop: 48 }}>
    <div style={s.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000', fontFamily: "'Playfair Display', serif" }}>57</div>
          <span style={{ color: C.cream, fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em' }}>57 ARTS & CUSTOMS</span>
        </Link>
        <div style={{ display: 'flex', gap: 28 }}>
          {[['New Order', '/custom-order'], ['Track Orders', '/order-tracking'], ['Contact', '/contact'], ['← Home', '/']].map(([label, path]) => (
            <Link key={label} to={path} style={{ color: C.muted, fontSize: 12, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = C.cream} onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
          ))}
        </div>
        <p style={{ color: C.dim, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>© 2024 57 Arts & Customs.</p>
      </div>
    </div>
  </footer>
);

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const VisionBoard = () => {
  const [drafts, setDrafts]           = useState([]);
  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [view, setView]               = useState('grid');
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [dragId, setDragId]           = useState(null);
  const [dragOverId, setDragOverId]   = useState(null);
  const dragNode = useRef(null);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    api.get('/custom-orders/my-orders')
      .then(r => {
        const normalized = r.data.map(o => ({
          id:            o._id,
          status:        o.orderStatus || 'pending',
          category:      o.category,
          categoryLabel: o.categoryLabel || o.category,
          categoryIcon:  CATEGORY_ICONS[o.category] || '✦',
          vision:        o.vision,
          materialNames: o.materials || [],
          aiRender:      o.aiRender || null,
          filesCount:    o.filesCount || 0,
          timeline:      o.timeline || '—',
          basePrice:     o.basePrice || '—',
          savedAt:       o.createdAt,
          orderNumber:   o.orderNumber,
        }));
        setDrafts(normalized);
      })
      .catch(err => {
        console.error('VisionBoard fetch error:', err);
        setError('Failed to load your visions. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
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

  // Drag handlers
  const onDragStart = (e, id) => {
    setDragId(id);
    dragNode.current = e.currentTarget;
    setTimeout(() => { if (dragNode.current) dragNode.current.classList.add('vb-dragging'); }, 0);
  };
  const onDragEnd = () => {
    setDragId(null); setDragOverId(null);
    if (dragNode.current) dragNode.current.classList.remove('vb-dragging');
  };
  const onDragOver = (e, id) => { e.preventDefault(); setDragOverId(id); };
  const onDrop = (e, targetId) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    setDrafts(prev => {
      const arr = [...prev];
      const from = arr.findIndex(d => d.id === dragId);
      const to   = arr.findIndex(d => d.id === targetId);
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
    setDragId(null); setDragOverId(null);
  };

  const counts = {
    all:            drafts.length,
    draft:          drafts.filter(d => d.status === 'draft').length,
    submitted:      drafts.filter(d => ['submitted','pending'].includes(d.status)).length,
    quote_received: drafts.filter(d => ['quote_received','quoted'].includes(d.status)).length,
    in_production:  drafts.filter(d => ['in_production','in_progress'].includes(d.status)).length,
    delivered:      drafts.filter(d => d.status === 'delivered').length,
  };

  const filtered = drafts
    .filter(d => filter === 'all' || d.status === filter || (filter === 'submitted' && d.status === 'pending') || (filter === 'quote_received' && d.status === 'quoted') || (filter === 'in_production' && d.status === 'in_progress'))
    .filter(d => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (d.categoryLabel || '').toLowerCase().includes(q)
          || (d.vision || '').toLowerCase().includes(q)
          || (d.orderNumber || '').toLowerCase().includes(q);
    });

  const FILTERS = [
    { key: 'all',            label: 'All' },
    { key: 'draft',          label: 'Drafts' },
    { key: 'submitted',      label: 'Submitted' },
    { key: 'quote_received', label: 'Quote Received' },
    { key: 'in_production',  label: 'In Production' },
    { key: 'delivered',      label: 'Delivered' },
  ];

  return (
    <div className="vb-root" style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ANNOUNCEMENT BAR */}
      <div style={{ background: `linear-gradient(90deg, #1a1408, ${C.gold}22, #1a1408)`, borderBottom: `1px solid ${C.border}`, color: C.gold, fontSize: 10, fontWeight: 800, textAlign: 'center', padding: '8px 16px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        ✦ &nbsp; Your Creative Studio &nbsp;·&nbsp; Track Order Progress &nbsp;·&nbsp; Manage Your Visions &nbsp; ✦
      </div>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, padding: '52px 0 40px' }}>
        <div style={s.section}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.muted, marginBottom: 32 }}>
            <Link to="/" style={{ color: C.muted, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = C.gold} onMouseLeave={e => e.target.style.color = C.muted}>Home</Link>
            <span style={{ color: C.dim }}>›</span>
            <Link to="/custom-order" style={{ color: C.muted, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = C.gold} onMouseLeave={e => e.target.style.color = C.muted}>Custom Order</Link>
            <span style={{ color: C.dim }}>›</span>
            <span style={{ color: C.gold, fontWeight: 700 }}>Vision Board</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <p style={s.eyebrow}>My Creative Studio</p>
              <h1 style={{ color: C.cream, fontSize: 56, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.92, marginBottom: 14, fontFamily: "'Playfair Display', serif" }}>
                Vision<br /><span style={{ color: C.gold, fontStyle: 'italic' }}>Board.</span>
              </h1>
              <p style={{ color: C.muted, fontSize: 13, fontWeight: 400 }}>
                {loading ? 'Loading your pipeline…' : `${drafts.length} piece${drafts.length !== 1 ? 's' : ''} in your creative pipeline`}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
              {/* Stats row */}
              {!loading && !error && (
                <div style={{ display: 'flex', gap: 16 }}>
                  {[
                    { label: 'Active', value: drafts.filter(d => ['submitted','pending','quote_received','in_production','in_progress'].includes(d.status)).length, color: C.blue },
                    { label: 'Delivered', value: counts.delivered, color: C.green },
                    { label: 'Drafts', value: counts.draft, color: C.muted },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ textAlign: 'center', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 20px' }}>
                      <div style={{ color, fontSize: 28, fontWeight: 900, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{value}</div>
                      <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginTop: 4, textTransform: 'uppercase' }}>{label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* View toggle */}
                <div style={{ display: 'flex', background: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
                  {[['▦', 'grid'], ['≡', 'list']].map(([icon, key]) => (
                    <button key={key} onClick={() => setView(key)}
                      style={{ padding: '9px 15px', fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: view === key ? C.gold : 'transparent', color: view === key ? '#000' : C.muted, fontFamily: "'DM Sans', sans-serif" }}>
                      {icon}
                    </button>
                  ))}
                </div>
                <Link to="/custom-order" style={{ ...s.btnGold }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.goldSoft; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.gold; }}>
                  + New Vision
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ ...s.section, padding: '36px 40px 80px' }}>

        {/* SEARCH + FILTERS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, fontSize: 14, pointerEvents: 'none' }}>⌕</span>
            <input
              className="vb-search"
              type="text"
              placeholder="Search orders, visions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: 1, height: 28, background: C.border, flexShrink: 0 }} />

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTERS.map(tab => (
              <button key={tab.key} className={`vb-filter-btn${filter === tab.key ? ' active' : ''}`}
                onClick={() => setFilter(tab.key)}>
                {tab.label}
                <span className="count">{counts[tab.key] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && <SkeletonGrid />}

        {/* ERROR STATE */}
        {!loading && error && (
          <div style={{ background: 'rgba(240,106,106,0.06)', border: `1px solid rgba(240,106,106,0.2)`, borderRadius: 16, padding: 48, textAlign: 'center', animation: 'cardIn 0.4s ease' }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>⚠️</p>
            <p style={{ color: C.red, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{error}</p>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Check your connection and try again.</p>
            <button onClick={() => window.location.reload()}
              style={{ ...s.btnGold, background: C.red, color: '#fff' }}>
              Retry
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ background: C.card, border: `2px dashed ${C.border}`, borderRadius: 20, padding: 80, textAlign: 'center', animation: 'cardIn 0.4s ease' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>{search ? '🔍' : '🎨'}</div>
            <h2 style={{ color: C.cream, fontWeight: 900, fontSize: 22, marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>
              {search ? 'No matches found' : 'Your canvas awaits'}
            </h2>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
              {search
                ? `No visions match "${search}". Try a different keyword.`
                : filter === 'all'
                  ? 'Start your first custom order brief and let your creativity take shape.'
                  : `No ${filter.replace(/_/g, ' ')} pieces in your pipeline.`}
            </p>
            {!search && (
              <Link to="/custom-order" style={s.btnGold}>+ Create Your First Vision</Link>
            )}
            {search && (
              <button onClick={() => setSearch('')} style={{ ...s.btnGhost, border: `1px solid ${C.border}` }}>
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* GRID VIEW */}
        {!loading && !error && view === 'grid' && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {filtered.map((draft, idx) => (
              <div key={draft.id}
                className={`vb-card vb-drag${dragOverId === draft.id ? ' vb-drag-over' : ''}`}
                style={{ animationDelay: `${idx * 0.06}s` }}
                draggable
                onDragStart={e => onDragStart(e, draft.id)}
                onDragEnd={onDragEnd}
                onDragOver={e => onDragOver(e, draft.id)}
                onDrop={e => onDrop(e, draft.id)}>

                {/* Image / render */}
                <div style={{ position: 'relative', height: 180, backgroundColor: C.faint, overflow: 'hidden', flexShrink: 0 }}>
                  {draft.aiRender ? (
                    <img src={draft.aiRender} alt="AI Render"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(ellipse at 50% 60%, ${C.faint} 0%, ${C.card} 100%)` }}>
                      <span style={{ fontSize: 40, marginBottom: 8, opacity: 0.6 }}>{draft.categoryIcon}</span>
                      <p style={{ color: C.dim, fontSize: 10, fontWeight: 600 }}>No render yet</p>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <StatusBadge status={draft.status} />
                  </div>
                  {draft.aiRender && (
                    <div style={{ position: 'absolute', top: 12, right: 12, background: C.gold, color: '#000', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 100, letterSpacing: '0.1em' }}>
                      ✦ AI
                    </div>
                  )}
                  {draft.orderNumber && (
                    <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: C.muted, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, letterSpacing: '0.06em' }}>
                      #{draft.orderNumber}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '18px 18px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Title row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                        <span style={{ fontSize: 15 }}>{draft.categoryIcon}</span>
                        <p style={{ color: C.cream, fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>{draft.categoryLabel}</p>
                      </div>
                      <p style={{ color: C.muted, fontSize: 10, fontWeight: 500 }}>{timeAgo(draft.savedAt)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: C.gold, fontWeight: 800, fontSize: 13, fontFamily: "'Playfair Display', serif" }}>{draft.basePrice !== '—' ? `KES ${draft.basePrice}+` : '—'}</p>
                      {draft.timeline && draft.timeline !== '—' && (
                        <p style={{ color: C.muted, fontSize: 10 }}>{draft.timeline}</p>
                      )}
                    </div>
                  </div>

                  {/* Vision snippet */}
                  {draft.vision && (
                    <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', borderLeft: `2px solid ${C.dim}`, paddingLeft: 10 }}>
                      "{draft.vision}"
                    </p>
                  )}

                  {/* Materials */}
                  {draft.materialNames.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {draft.materialNames.slice(0, 3).map(m => (
                        <span key={m} className="vb-tag">{m}</span>
                      ))}
                      {draft.materialNames.length > 3 && (
                        <span className="vb-tag">+{draft.materialNames.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Timeline progress */}
                  <OrderTimeline status={draft.status} />

                  {/* Actions */}
                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                    <CardActions draft={draft} onStatusChange={handleStatusChange} onDelete={() => setDeleteConfirm(draft.id)} />
                  </div>
                </div>
              </div>
            ))}

            {/* New vision card */}
            <Link to="/custom-order"
              style={{ border: `2px dashed ${C.border}`, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, minHeight: 340, textDecoration: 'none', transition: 'all 0.25s', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = 'rgba(200,164,90,0.03)'; e.currentTarget.querySelector('.plus-icon').style.borderColor = C.gold; e.currentTarget.querySelector('.plus-icon').style.color = C.gold; e.currentTarget.querySelector('.plus-label').style.color = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelector('.plus-icon').style.borderColor = C.dim; e.currentTarget.querySelector('.plus-icon').style.color = C.dim; e.currentTarget.querySelector('.plus-label').style.color = C.muted; }}>
              <div className="plus-icon" style={{ width: 52, height: 52, borderRadius: '50%', border: `1.5px dashed ${C.dim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: C.dim, marginBottom: 14, transition: 'all 0.25s' }}>+</div>
              <p className="plus-label" style={{ color: C.muted, fontWeight: 800, fontSize: 13, marginBottom: 6, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.25s' }}>New Vision</p>
              <p style={{ color: C.dim, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>Start a custom order</p>
            </Link>
          </div>
        )}

        {/* LIST VIEW */}
        {!loading && !error && view === 'list' && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((draft, idx) => (
              <div key={draft.id}
                className={`vb-list-row vb-drag${dragOverId === draft.id ? ' vb-drag-over' : ''}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
                draggable
                onDragStart={e => onDragStart(e, draft.id)}
                onDragEnd={onDragEnd}
                onDragOver={e => onDragOver(e, draft.id)}
                onDrop={e => onDrop(e, draft.id)}>

                {/* Thumbnail */}
                <div style={{ width: 68, height: 68, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: C.faint }}>
                  {draft.aiRender
                    ? <img src={draft.aiRender} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{draft.categoryIcon}</div>}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <p style={{ color: C.cream, fontWeight: 700, fontSize: 14 }}>{draft.categoryLabel}</p>
                    <StatusBadge status={draft.status} />
                    {draft.orderNumber && <span style={{ color: C.dim, fontSize: 10 }}>#{draft.orderNumber}</span>}
                  </div>
                  {draft.vision && (
                    <p style={{ color: C.muted, fontSize: 12, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>"{draft.vision}"</p>
                  )}
                  <OrderTimeline status={draft.status} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <span style={{ color: C.dim, fontSize: 11 }}>{timeAgo(draft.savedAt)}</span>
                    <span style={{ color: C.dim }}>·</span>
                    <span style={{ color: C.dim, fontSize: 11 }}>{draft.materialNames.length} materials</span>
                    {draft.basePrice !== '—' && (<><span style={{ color: C.dim }}>·</span><span style={{ color: C.gold, fontWeight: 800, fontSize: 11 }}>KES {draft.basePrice}+</span></>)}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ flexShrink: 0 }}>
                  <CardActions draft={draft} onStatusChange={handleStatusChange} onDelete={() => setDeleteConfirm(draft.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="vb-modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="vb-modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 44, marginBottom: 18 }}>🗑</div>
            <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 20, fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>Delete this vision?</h3>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 28 }}>
              This cannot be undone. Your brief and AI render will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '13px', borderRadius: 10, fontWeight: 800, fontSize: 12, border: `1px solid ${C.border}`, background: 'transparent', color: C.cream, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                style={{ flex: 1, padding: '13px', borderRadius: 10, fontWeight: 800, fontSize: 12, border: 'none', background: C.red, color: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
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