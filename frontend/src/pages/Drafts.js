import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDrafts } from '../context/DraftContext';

const statusConfig = {
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
    bg: 'bg-blue-900 bg-opacity-30',
    border: 'border-blue-800',
    dot: 'bg-blue-400',
  },
  quote_received: {
    label: 'Quote Received',
    color: 'text-yellow-400',
    bg: 'bg-yellow-900 bg-opacity-30',
    border: 'border-yellow-800',
    dot: 'bg-yellow-400',
  },
  in_production: {
    label: 'In Production',
    color: 'text-green-400',
    bg: 'bg-green-900 bg-opacity-30',
    border: 'border-green-800',
    dot: 'bg-green-400',
  },
};

const timeAgo = (date) => {
  if (!date) return '—';
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const Drafts = () => {
  const { drafts, deleteDraft, submitDraft } = useDrafts();
  const [filter, setFilter]             = useState('all');
  const [view, setView]                 = useState('grid');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedQuote, setExpandedQuote] = useState(null);

  const filters = [
    { key: 'all',           label: 'All',           count: drafts.length },
    { key: 'draft',         label: 'Drafts',         count: drafts.filter(d => d.status === 'draft').length },
    { key: 'submitted',     label: 'Submitted',      count: drafts.filter(d => d.status === 'submitted').length },
    { key: 'quote_received',label: 'Quotes',         count: drafts.filter(d => d.quoteReceived).length },
    { key: 'in_production', label: 'In Production',  count: drafts.filter(d => d.status === 'in_production').length },
  ];

  const filtered = filter === 'all'
    ? drafts
    : filter === 'quote_received'
    ? drafts.filter(d => d.quoteReceived)
    : drafts.filter(d => d.status === filter);

  const getStatus = (draft) => {
    if (draft.status === 'in_production') return 'in_production';
    if (draft.quoteReceived)              return 'quote_received';
    return draft.status;
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* HEADER */}
      <div style={{ backgroundColor: '#1a1a00' }} className="border-b border-gray-800 px-8 py-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #FFD700, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            <span>›</span>
            <Link to="/profile" className="hover:text-yellow-400 transition">My Account</Link>
            <span>›</span>
            <span className="text-yellow-400">Vision Board</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase leading-tight mb-1">
                My Vision <span className="text-yellow-400 italic">Board.</span>
              </h1>
              <p className="text-gray-400 text-sm">
                All your custom order briefs, drafts, and active commissions in one place.
              </p>
            </div>
            <Link
              to="/custom-order"
              className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
            >
              + New Vision
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-5">
            {[
              { label: 'Total Briefs',      value: drafts.length },
              { label: 'In Production',     value: drafts.filter(d => d.status === 'in_production').length },
              { label: 'Quotes Pending',    value: drafts.filter(d => d.status === 'submitted' && !d.quoteReceived).length },
              { label: 'Quotes Received',   value: drafts.filter(d => d.quoteReceived).length },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div>
                  <p className="text-white font-black text-xl leading-none">{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                </div>
                {i < 3 && <div className="w-px h-8 bg-gray-800" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* FILTERS + VIEW TOGGLE */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl font-black text-xs transition flex items-center gap-2 ${
                  filter === f.key
                    ? 'bg-yellow-400 text-black'
                    : 'border border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400'
                }`}
                style={filter !== f.key ? { backgroundColor: '#1a1a00' } : {}}
              >
                {f.label}
                <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center ${
                  filter === f.key ? 'bg-black text-yellow-400' : 'bg-gray-800 text-gray-400'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {['grid', 'list'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                  view === v
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-gray-700 text-gray-600 hover:border-gray-500'
                }`}
                style={{ backgroundColor: '#1a1a00' }}
              >
                {v === 'grid' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1V2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V2zM1 7a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1V7zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V7zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V7zM1 12a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2zm5 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div
            className="rounded-2xl border border-dashed border-gray-700 p-16 text-center"
            style={{ backgroundColor: '#1a1a00' }}
          >
            <p className="text-5xl mb-4">✦</p>
            <h3 className="text-white font-black text-xl mb-2">No visions here yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Start a new custom order brief and save it as a draft to see it here.
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
        {filtered.length > 0 && view === 'grid' && (
          <div className="grid grid-cols-3 gap-5">
            {filtered.map(draft => {
              const status = getStatus(draft);
              const sc = statusConfig[status] || statusConfig.draft;
              return (
                <div
                  key={draft.id}
                  className="rounded-2xl border border-gray-800 overflow-hidden flex flex-col group hover:border-gray-700 transition"
                  style={{ backgroundColor: '#1a1a00' }}
                >
                  {/* Image */}
                  <div className="relative" style={{ height: '160px', backgroundColor: '#2a2000' }}>
                    {draft.aiRender ? (
                      <img src={draft.aiRender} alt="AI Render"
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <span className="text-5xl mb-2">{draft.categoryIcon || '✦'}</span>
                        <p className="text-gray-600 text-xs">No render yet</p>
                      </div>
                    )}
                    <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black ${sc.color} ${sc.bg} ${sc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-black text-black"
                      style={{ backgroundColor: '#FFD700' }}>
                      {draft.categoryIcon} {draft.categoryLabel}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-white text-sm leading-relaxed line-clamp-2 mb-3 flex-1">
                      {draft.vision || <span className="text-gray-600 italic">No description yet...</span>}
                    </p>

                    {/* Materials */}
                    {draft.materialNames?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {draft.materialNames.slice(0, 3).map(m => (
                          <span key={m}
                            className="text-xs px-2 py-0.5 rounded-full border border-gray-700 text-gray-400"
                            style={{ backgroundColor: '#2a2000' }}>
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

                    {/* Quote */}
                    {draft.quoteReceived && draft.quote && (
                      <button
                        onClick={() => setExpandedQuote(expandedQuote === draft.id ? null : draft.id)}
                        className="w-full mb-3 p-3 rounded-xl border border-yellow-900 text-left hover:border-yellow-400 transition"
                        style={{ backgroundColor: '#2a2000' }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-yellow-400 font-black text-xs">✦ Quote Received</p>
                            <p className="text-white font-black text-sm">{draft.quote.amount}</p>
                            <p className="text-gray-500 text-xs">by {draft.quote.artisan}</p>
                          </div>
                          <span className="text-yellow-400 text-xs mt-0.5">
                            {expandedQuote === draft.id ? '▲' : '▼'}
                          </span>
                        </div>
                        {expandedQuote === draft.id && (
                          <div className="mt-2 pt-2 border-t border-yellow-900">
                            <p className="text-gray-300 text-xs italic leading-relaxed">
                              "{draft.quote.message}"
                            </p>
                          </div>
                        )}
                      </button>
                    )}

                    {/* Meta */}
                    <div className="flex justify-between items-center mb-4 text-xs text-gray-600">
                      <span>{draft.basePrice}+</span>
                      <span>{draft.timeline}</span>
                      <span>Saved {timeAgo(draft.savedAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {draft.status === 'draft' && (
                        <>
                          <Link to="/custom-order"
                            className="flex-1 border border-gray-700 text-gray-300 py-2 rounded-xl font-black text-xs text-center hover:border-yellow-400 hover:text-yellow-400 transition">
                            Edit
                          </Link>
                          <button
                            onClick={() => submitDraft(draft.id)}
                            className="flex-1 bg-yellow-400 text-black py-2 rounded-xl font-black text-xs hover:bg-yellow-500 transition">
                            Submit
                          </button>
                        </>
                      )}
                      {draft.status === 'submitted' && !draft.quoteReceived && (
                        <div className="flex-1 flex items-center justify-center gap-2 border border-gray-700 text-gray-500 py-2 rounded-xl text-xs font-black">
                          <span className="animate-pulse">●</span> Awaiting Quote
                        </div>
                      )}
                      {draft.quoteReceived && draft.status !== 'in_production' && (
                        <button className="flex-1 bg-yellow-400 text-black py-2 rounded-xl font-black text-xs hover:bg-yellow-500 transition">
                          Accept Quote →
                        </button>
                      )}
                      {draft.status === 'in_production' && (
                        <Link to="/order-tracking"
                          className="flex-1 bg-green-500 bg-opacity-20 border border-green-800 text-green-400 py-2 rounded-xl font-black text-xs text-center hover:bg-opacity-30 transition">
                          Track Order →
                        </Link>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(draft.id)}
                        className="w-9 h-9 flex-shrink-0 border border-gray-800 rounded-xl flex items-center justify-center text-gray-600 hover:border-red-500 hover:text-red-400 transition text-xs">
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
              className="rounded-2xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center p-10 hover:border-yellow-400 hover:bg-yellow-400 hover:bg-opacity-5 transition group"
              style={{ minHeight: '300px' }}
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition">✦</span>
              <p className="text-gray-500 font-black text-sm group-hover:text-yellow-400 transition">
                New Vision
              </p>
            </Link>
          </div>
        )}

        {/* LIST VIEW */}
        {filtered.length > 0 && view === 'list' && (
          <div className="space-y-3">
            {filtered.map(draft => {
              const status = getStatus(draft);
              const sc = statusConfig[status] || statusConfig.draft;
              return (
                <div
                  key={draft.id}
                  className="rounded-2xl border border-gray-800 p-5 flex items-center gap-5 hover:border-gray-700 transition"
                  style={{ backgroundColor: '#1a1a00' }}
                >
                  <div
                    className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: '#2a2000' }}
                  >
                    {draft.aiRender
                      ? <img src={draft.aiRender} alt="" className="w-full h-full object-cover" />
                      : <span className="text-2xl">{draft.categoryIcon || '✦'}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-black text-sm">{draft.categoryLabel}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-black ${sc.color} ${sc.bg} ${sc.border}`}>
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs truncate mb-1">{draft.vision}</p>
                    <div className="flex items-center gap-3 text-gray-600 text-xs">
                      <span>{draft.materialNames?.length || 0} materials</span>
                      <span>·</span>
                      <span>{draft.basePrice}+</span>
                      <span>·</span>
                      <span>Saved {timeAgo(draft.savedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {draft.status === 'draft' && (
                      <>
                        <Link to="/custom-order"
                          className="border border-gray-700 text-gray-300 px-3 py-2 rounded-xl font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition">
                          Edit
                        </Link>
                        <button
                          onClick={() => submitDraft(draft.id)}
                          className="bg-yellow-400 text-black px-3 py-2 rounded-xl font-black text-xs hover:bg-yellow-500 transition">
                          Submit
                        </button>
                      </>
                    )}
                    {draft.status === 'submitted' && !draft.quoteReceived && (
                      <span className="text-gray-500 text-xs font-black animate-pulse">● Awaiting Quote</span>
                    )}
                    {draft.quoteReceived && draft.status !== 'in_production' && (
                      <button className="bg-yellow-400 text-black px-3 py-2 rounded-xl font-black text-xs hover:bg-yellow-500 transition">
                        Accept Quote
                      </button>
                    )}
                    {draft.status === 'in_production' && (
                      <Link to="/order-tracking"
                        className="bg-green-500 bg-opacity-20 border border-green-800 text-green-400 px-3 py-2 rounded-xl font-black text-xs hover:bg-opacity-30 transition">
                        Track →
                      </Link>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(draft.id)}
                      className="w-8 h-8 border border-gray-800 rounded-xl flex items-center justify-center text-gray-600 hover:border-red-500 hover:text-red-400 transition text-xs">
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
          <div className="rounded-2xl border border-gray-800 p-8 max-w-sm w-full text-center"
            style={{ backgroundColor: '#1a1a00' }}>
            <p className="text-3xl mb-4">🗑</p>
            <h3 className="text-white font-black text-lg mb-2">Delete this vision?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This draft will be permanently removed from your vision board.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-xl font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition">
                Cancel
              </button>
              <button
                onClick={() => { deleteDraft(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black text-sm hover:bg-red-600 transition">
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
            <Link to="/custom-order" className="hover:text-yellow-400 transition">Custom Orders</Link>
            <Link to="/shop"         className="hover:text-yellow-400 transition">Shop</Link>
            <Link to="/contact"      className="hover:text-yellow-400 transition">Contact</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2024 57 Arts & Customs.</p>
        </div>
      </footer>
    </div>
  );
};

export default Drafts;