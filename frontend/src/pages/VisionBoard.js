import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'text-gray-400',
    bg: 'bg-gray-800',
    border: 'border-gray-700',
    dot: 'bg-gray-500',
  },
  submitted: {
    label: 'Submitted',
    color: 'text-blue-400',
    bg: 'bg-blue-900 bg-opacity-40',
    border: 'border-blue-800',
    dot: 'bg-blue-400',
  },
  quote_received: {
    label: 'Quote Received',
    color: 'text-yellow-400',
    bg: 'bg-yellow-900 bg-opacity-40',
    border: 'border-yellow-800',
    dot: 'bg-yellow-400',
  },
  in_production: {
    label: 'In Production',
    color: 'text-green-400',
    bg: 'bg-green-900 bg-opacity-40',
    border: 'border-green-800',
    dot: 'bg-green-400',
  },
};

const MOCK_DRAFTS = [
  {
    id: 'mock_1',
    status: 'in_production',
    category: 'furniture',
    categoryLabel: 'Furniture',
    categoryIcon: '🪑',
    vision: 'A hand-carved teak throne with gold leaf detailing on the armrests, inspired by Yoruba royal furniture.',
    materials: ['teak-wood', 'gold-leaf', 'recycled-brass'],
    materialNames: ['Teak Wood', '24k Gold Leaf', 'Recycled Brass'],
    aiRender: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600',
    filesCount: 2,
    timeline: '4–8 Weeks',
    basePrice: 'KES 45,000',
    savedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'mock_2',
    status: 'quote_received',
    category: 'fashion',
    categoryLabel: 'Fashion',
    categoryIcon: '👔',
    vision: 'Oversized agbada-style jacket with neon geometric patterns and traditional Yoruba motifs.',
    materials: ['aso-oke', 'kente-cloth'],
    materialNames: ['Aso-Oke Hand-woven', 'Kente Cloth'],
    aiRender: null,
    filesCount: 1,
    timeline: '2–4 Weeks',
    basePrice: 'KES 15,000',
    savedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'mock_3',
    status: 'draft',
    category: 'beads',
    categoryLabel: 'Beads & Jewelry',
    categoryIcon: '💎',
    vision: 'Multi-strand obsidian and gold waist beads with silver spacers.',
    materials: ['obsidian', 'sterling-silver'],
    materialNames: ['Genuine Obsidian', 'Sterling Silver'],
    aiRender: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
    filesCount: 0,
    timeline: '1–3 Weeks',
    basePrice: 'KES 8,000',
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

const VisionBoard = () => {
  const [drafts, setDrafts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [view, setView] = useState('grid');

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
      const updated = stored.filter(d => d.id !== id);
      localStorage.setItem('57arts_drafts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setDrafts(prev => prev.filter(d => d.id !== id));
    setDeleteConfirm(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    try {
      const stored = JSON.parse(localStorage.getItem('57arts_drafts') || '[]');
      const updated = stored.map(d => d.id === id ? { ...d, status: newStatus } : d);
      localStorage.setItem('57arts_drafts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = filter === 'all'
    ? drafts
    : drafts.filter(d => d.status === filter);

  const counts = {
    all: drafts.length,
    draft: drafts.filter(d => d.status === 'draft').length,
    submitted: drafts.filter(d => d.status === 'submitted').length,
    quote_received: drafts.filter(d => d.status === 'quote_received').length,
    in_production: drafts.filter(d => d.status === 'in_production').length,
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* HEADER */}
      <div
        style={{ backgroundColor: '#1a1a00' }}
        className="border-b border-gray-800 px-8 py-8 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #FFD700, transparent 55%)' }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            <span>›</span>
            <Link to="/custom-order" className="hover:text-yellow-400 transition">Custom Order</Link>
            <span>›</span>
            <span className="text-yellow-400">Vision Board</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-px bg-yellow-400" />
                <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
                  My Creative Studio
                </span>
              </div>
              <h1 className="text-4xl font-black uppercase leading-none">
                Vision <span className="text-yellow-400 italic">Board</span>
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                {drafts.length} piece{drafts.length !== 1 ? 's' : ''} in your creative pipeline
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div
                className="flex items-center border border-gray-700 rounded-xl overflow-hidden"
                style={{ backgroundColor: '#2a2000' }}
              >
                <button
                  onClick={() => setView('grid')}
                  className={`px-3 py-2 text-xs font-black transition ${
                    view === 'grid' ? 'bg-yellow-400 text-black' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  ▦ Grid
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-3 py-2 text-xs font-black transition ${
                    view === 'list' ? 'bg-yellow-400 text-black' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  ≡ List
                </button>
              </div>

              <Link
                to="/custom-order"
                className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
              >
                + New Vision
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-6">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-gray-500 text-xs">{cfg.label}</span>
                <span className={`font-black text-xs ${cfg.color}`}>{counts[key] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* FILTER TABS */}
        <div className="flex items-center gap-2 mb-8 border-b border-gray-800 pb-4">
          {[
            { key: 'all', label: 'All Visions' },
            { key: 'draft', label: 'Drafts' },
            { key: 'submitted', label: 'Submitted' },
            { key: 'quote_received', label: 'Quote Received' },
            { key: 'in_production', label: 'In Production' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition ${
                filter === tab.key
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-500 hover:text-white border border-gray-800 hover:border-gray-600'
              }`}
              style={filter !== tab.key ? { backgroundColor: '#1a1a00' } : {}}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                filter === tab.key ? 'bg-black bg-opacity-20 text-black' : 'bg-gray-800 text-gray-500'
              }`}>
                {counts[tab.key] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div
            className="rounded-2xl border border-dashed border-gray-700 p-16 text-center"
            style={{ backgroundColor: '#1a1a00' }}
          >
            <p className="text-5xl mb-4">🎨</p>
            <p className="text-white font-black text-lg mb-2">No visions here yet</p>
            <p className="text-gray-500 text-sm mb-6">
              {filter === 'all'
                ? 'Start your first custom order brief and save it as a draft.'
                : `No ${filter.replace('_', ' ')} pieces found.`
              }
            </p>
            <Link
              to="/custom-order"
              className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
            >
              + Create New Vision
            </Link>
          </div>
        )}

        {/* GRID VIEW */}
        {view === 'grid' && filtered.length > 0 && (
          <div className="grid grid-cols-3 gap-5">
            {filtered.map(draft => {
              const cfg = STATUS_CONFIG[draft.status] || STATUS_CONFIG.draft;
              return (
                <div
                  key={draft.id}
                  className="rounded-2xl border border-gray-800 overflow-hidden flex flex-col group hover:border-gray-600 transition"
                  style={{ backgroundColor: '#1a1a00' }}
                >
                  {/* Image / AI Render */}
                  <div className="relative" style={{ height: '160px', backgroundColor: '#2a2000' }}>
                    {draft.aiRender ? (
                      <img
                        src={draft.aiRender}
                        alt="AI Render"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <span className="text-4xl mb-2">{draft.categoryIcon}</span>
                        <p className="text-gray-700 text-xs">No render generated</p>
                      </div>
                    )}

                    {/* Status badge */}
                    <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      <span className={`text-xs font-black ${cfg.color}`}>{cfg.label}</span>
                    </div>

                    {/* AI render badge */}
                    {draft.aiRender && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full">
                        ✦ AI
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{draft.categoryIcon}</span>
                          <p className="text-white font-black text-sm">{draft.categoryLabel}</p>
                        </div>
                        <p className="text-gray-600 text-xs mt-0.5">{timeAgo(draft.savedAt)}</p>
                      </div>
                      <p className="text-yellow-400 font-black text-xs">{draft.basePrice}+</p>
                    </div>

                    {/* Vision snippet */}
                    {draft.vision && (
                      <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2 italic">
                        "{draft.vision}"
                      </p>
                    )}

                    {/* Materials */}
                    {draft.materialNames.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {draft.materialNames.slice(0, 3).map(m => (
                          <span
                            key={m}
                            className="text-xs px-2 py-0.5 rounded-full border border-gray-700 text-gray-400"
                            style={{ backgroundColor: '#2a2000' }}
                          >
                            {m}
                          </span>
                        ))}
                        {draft.materialNames.length > 3 && (
                          <span className="text-xs px-2 py-0.5 rounded-full border border-gray-700 text-gray-600"
                            style={{ backgroundColor: '#2a2000' }}>
                            +{draft.materialNames.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-t border-gray-800 flex gap-2">
                      {draft.status === 'draft' && (
                        <>
                          <Link
                            to="/custom-order"
                            className="flex-1 text-center text-xs font-black py-2 rounded-xl border border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400 transition"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleStatusChange(draft.id, 'submitted')}
                            className="flex-1 text-xs font-black py-2 rounded-xl bg-yellow-400 text-black hover:bg-yellow-500 transition"
                          >
                            Submit
                          </button>
                        </>
                      )}
                      {draft.status === 'submitted' && (
                        <div className="flex-1 text-center text-xs text-gray-500 py-2">
                          ⏳ Awaiting quote...
                        </div>
                      )}
                      {draft.status === 'quote_received' && (
                        <>
                          <button className="flex-1 text-xs font-black py-2 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition">
                            View Quote
                          </button>
                          <button
                            onClick={() => handleStatusChange(draft.id, 'in_production')}
                            className="flex-1 text-xs font-black py-2 rounded-xl bg-yellow-400 text-black hover:bg-yellow-500 transition"
                          >
                            Approve
                          </button>
                        </>
                      )}
                      {draft.status === 'in_production' && (
                        <Link
                          to="/order-tracking"
                          className="flex-1 text-center text-xs font-black py-2 rounded-xl bg-green-500 bg-opacity-20 text-green-400 border border-green-800 hover:bg-opacity-30 transition"
                        >
                          Track Order →
                        </Link>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(draft.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-800 text-gray-600 hover:border-red-500 hover:text-red-400 transition text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* New vision card */}
            <Link
              to="/custom-order"
              className="rounded-2xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center p-8 hover:border-yellow-400 hover:bg-yellow-400 hover:bg-opacity-5 transition group"
              style={{ minHeight: '320px' }}
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center mb-3 group-hover:border-yellow-400 transition text-2xl text-gray-700 group-hover:text-yellow-400">
                +
              </div>
              <p className="text-gray-600 font-black text-sm group-hover:text-yellow-400 transition">
                New Vision
              </p>
            </Link>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(draft => {
              const cfg = STATUS_CONFIG[draft.status] || STATUS_CONFIG.draft;
              return (
                <div
                  key={draft.id}
                  className="rounded-2xl border border-gray-800 p-5 flex items-center gap-5 hover:border-gray-600 transition"
                  style={{ backgroundColor: '#1a1a00' }}
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: '#2a2000' }}>
                    {draft.aiRender ? (
                      <img src={draft.aiRender} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {draft.categoryIcon}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-white font-black text-sm">{draft.categoryLabel}</p>
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span className={`text-xs font-black ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    </div>
                    {draft.vision && (
                      <p className="text-gray-500 text-xs truncate italic">"{draft.vision}"</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-700 text-xs">{timeAgo(draft.savedAt)}</span>
                      <span className="text-gray-700 text-xs">·</span>
                      <span className="text-gray-700 text-xs">{draft.materialNames.length} materials</span>
                      <span className="text-gray-700 text-xs">·</span>
                      <span className="text-yellow-600 text-xs font-black">{draft.basePrice}+</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {draft.status === 'draft' && (
                      <>
                        <Link to="/custom-order"
                          className="text-xs font-black px-3 py-2 rounded-xl border border-gray-700 text-gray-300 hover:border-yellow-400 hover:text-yellow-400 transition">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleStatusChange(draft.id, 'submitted')}
                          className="text-xs font-black px-3 py-2 rounded-xl bg-yellow-400 text-black hover:bg-yellow-500 transition">
                          Submit
                        </button>
                      </>
                    )}
                    {draft.status === 'submitted' && (
                      <span className="text-gray-500 text-xs">⏳ Awaiting quote</span>
                    )}
                    {draft.status === 'quote_received' && (
                      <button className="text-xs font-black px-3 py-2 rounded-xl border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition">
                        View Quote
                      </button>
                    )}
                    {draft.status === 'in_production' && (
                      <Link to="/order-tracking"
                        className="text-xs font-black px-3 py-2 rounded-xl bg-green-500 bg-opacity-20 text-green-400 border border-green-800 hover:bg-opacity-30 transition">
                        Track →
                      </Link>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(draft.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-800 text-gray-600 hover:border-red-500 hover:text-red-400 transition text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
          <div
            className="rounded-2xl border border-gray-700 p-8 max-w-sm w-full text-center"
            style={{ backgroundColor: '#1a1a00' }}
          >
            <p className="text-3xl mb-4">🗑</p>
            <h3 className="text-white font-black text-lg mb-2">Delete this vision?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone. Your brief and AI render will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-xl font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black text-sm hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0d0d00' }} className="border-t border-yellow-900 px-8 py-8 mt-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
            <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/custom-order" className="hover:text-yellow-400 transition">New Order</Link>
            <Link to="/order-tracking" className="hover:text-yellow-400 transition">Track Orders</Link>
            <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2024 57 Arts & Customs.</p>
        </div>
      </footer>
    </div>
  );
};

export default VisionBoard;