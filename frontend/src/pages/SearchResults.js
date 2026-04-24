import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';

// ── DESIGN TOKENS (matches Home.js) ──────────────────────────────────────────
const C = {
  bg:      '#0a0a0a',
  surface: '#111111',
  border:  '#1c1c1c',
  bHov:    '#2e2e2e',
  faint:   '#242424',
  cream:   '#f0ece4',
  muted:   '#606060',
  gold:    '#c9a84c',
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const aiRecommended = [1, 3, 5, 11]; // IDs of AI-recommended products
const categories  = ['All', 'Fashion', 'Furniture', 'Beads'];
const sortOptions = ['Latest Drop', 'Price: Low to High', 'Price: High to Low', 'Most Popular', 'AI Recommended'];
const popularTags = ['Denim', 'Custom Order', 'Beads', 'Furniture', 'Old Money', 'Limited Edition'];
const fallbackImage = 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500';

const normalizeProduct = (product) => ({
  id: product._id,
  name: product.name,
  price: `KSH ${Number(product.price || 0).toLocaleString()}`,
  priceNum: Number(product.price || 0),
  desc: product.description || 'Artisanal piece',
  category: product.category,
  tag: product.tag || (product.status === 'draft' ? 'Draft' : product.status === 'out_of_stock' ? 'Out of Stock' : 'Ready-Made'),
  img: product.images?.[0] || fallbackImage,
  slug: product.slug,
  inStock: product.inStock !== false,
});

// ── COMPONENT ─────────────────────────────────────────────────────────────────
const SearchResults = () => {
  const [searchParams]  = useSearchParams();
  const query           = searchParams.get('q') || '';
  const navigate        = useNavigate();
  const fileInputRef    = useRef(null);

  const [searchInput, setSearchInput]       = useState(query);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy]                 = useState('Latest Drop');
  const [wishlist, setWishlist]             = useState([]);
  const [priceMax, setPriceMax]             = useState(200000);
  const [currentPage, setCurrentPage]       = useState(1);
  const [searchMode, setSearchMode]         = useState('text'); // 'text' | 'visual'
  const [uploadedImage, setUploadedImage]   = useState(null);
  const [isAnalyzing, setIsAnalyzing]       = useState(false);
  const [showAIBadge, setShowAIBadge]       = useState(false);
  const [availability, setAvailability]     = useState({ readyMade: true, customOrders: true });
  const [products, setProducts]             = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productAPI.getAll(query ? { search: query } : {});
        setProducts((res.data?.products || []).map(normalizeProduct));
      } catch {
        setProducts([]);
      }
    };

    loadProducts();
    setCurrentPage(1);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
  };

  const toggleWishlist = (id) =>
    setWishlist(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result);
      setSearchMode('visual');
      setIsAnalyzing(true);
      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowAIBadge(true);
        setSortBy('AI Recommended');
      }, 2200);
    };
    reader.readAsDataURL(file);
  };

  const clearVisualSearch = () => {
    setUploadedImage(null);
    setSearchMode('text');
    setShowAIBadge(false);
    setSortBy('Latest Drop');
  };

  // Filter
  const priceToNum = (p) => typeof p === 'number' ? p : parseInt(String(p).replace(/[^0-9]/g, ''), 10);
  const filtered = products.filter(p => {
    const matchQ    = query === '' || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase());
    const matchCat  = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchPrice= priceToNum(p.price) <= priceMax;
    const isCustom  = p.tag === 'Custom Order' || p.tag === 'Bespoke Only';
    const isReady   = p.inStock && !isCustom;
    const matchAvail= (availability.readyMade && isReady) || (availability.customOrders && isCustom);
    return matchQ && matchCat && matchPrice && matchAvail;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return priceToNum(a.price) - priceToNum(b.price);
    if (sortBy === 'Price: High to Low') return priceToNum(b.price) - priceToNum(a.price);
    if (sortBy === 'AI Recommended') return (aiRecommended.includes(b.id) ? 1 : 0) - (aiRecommended.includes(a.id) ? 1 : 0);
    return 0;
  });

  const perPage = 9;
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh' }}>

      {/* ── SEARCH BAR ──────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '24px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[
              { mode: 'text',   label: 'Text Search' },
              { mode: 'visual', label: 'Visual Search (AI)' },
            ].map(({ mode, label }) => (
              <button key={mode} onClick={() => setSearchMode(mode)}
                style={{ padding: '6px 16px', borderRadius: 100, fontSize: 11, fontWeight: 900, letterSpacing: '0.06em', border: `1px solid ${searchMode === mode ? C.gold : C.border}`, backgroundColor: searchMode === mode ? 'rgba(201,168,76,0.1)' : 'transparent', color: searchMode === mode ? C.gold : C.muted, cursor: 'pointer', transition: 'all 0.2s' }}>
                {label}
              </button>
            ))}
          </div>

          {searchMode === 'text' ? (
            /* Text search */
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 720 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${C.border}`, borderRadius: 12, padding: '13px 16px', backgroundColor: C.bg }}>
                <svg width={14} height={14} fill="none" stroke={C.muted} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search products, categories, styles..."
                  style={{ background: 'none', border: 'none', outline: 'none', color: C.cream, fontSize: 14, width: '100%' }} autoFocus />
                {searchInput && (
                  <button type="button" onClick={() => setSearchInput('')} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14 }}>✕</button>
                )}
              </div>
              <button type="submit" style={{ backgroundColor: C.gold, color: '#000', border: 'none', borderRadius: 12, padding: '13px 24px', fontWeight: 900, fontSize: 13, cursor: 'pointer', letterSpacing: '0.04em' }}>
                Search
              </button>
            </form>
          ) : (
            /* Visual search */
            <div style={{ maxWidth: 720 }}>
              {!uploadedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: `2px dashed ${C.border}`, borderRadius: 14, padding: '40px 24px', textAlign: 'center', cursor: 'pointer', backgroundColor: C.bg, transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  <div style={{ width: 52, height: 52, borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width={22} height={22} fill="none" stroke={C.gold} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p style={{ color: C.cream, fontWeight: 900, fontSize: 14, marginBottom: 6 }}>Upload an image to find similar products</p>
                  <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
                    Our AI will analyse your image and find artisan pieces with similar style, colour, and form.
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20, backgroundColor: C.gold, color: '#000', padding: '10px 20px', borderRadius: 10, fontWeight: 900, fontSize: 12 }}>
                    <svg width={13} height={13} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose Image
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
                  <div style={{ position: 'relative', width: 100, height: 100, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={uploadedImage} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {isAnalyzing && (
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 24, height: 24, border: `2px solid ${C.gold}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    {isAnalyzing ? (
                      <>
                        <p style={{ color: C.cream, fontWeight: 900, fontSize: 13, marginBottom: 6 }}>Analysing your image...</p>
                        <p style={{ color: C.muted, fontSize: 12 }}>Our AI is scanning for style, colour, and form matches across 2,400+ artisan pieces.</p>
                        <div style={{ marginTop: 12, height: 3, backgroundColor: C.faint, borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: '70%', backgroundColor: C.gold, borderRadius: 2, animation: 'progress 2s ease-in-out' }} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <p style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>Visual match complete</p>
                          <span style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: C.gold, fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 100, border: `1px solid ${C.gold}`, letterSpacing: '0.08em' }}>AI</span>
                        </div>
                        <p style={{ color: C.muted, fontSize: 12, marginBottom: 12 }}>Showing {sorted.length} visually similar artisan pieces, ranked by AI match score.</p>
                        <button onClick={clearVisualSearch} style={{ backgroundColor: 'transparent', border: `1px solid ${C.border}`, color: C.muted, padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                          Clear & search again
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Popular tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <span style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Popular:</span>
            {popularTags.map(tag => (
              <button key={tag} onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                style={{ border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, padding: '4px 12px', borderRadius: 100, backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px', display: 'flex', gap: 40 }}>

        {/* SIDEBAR */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.gold, fontSize: 11, fontWeight: 900, textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            ← Back to Home
          </Link>

          {/* Categories */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Categories</p>
            {categories.map(cat => (
              <div key={cat} onClick={() => setActiveCategory(cat)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, marginBottom: 2, cursor: 'pointer', backgroundColor: activeCategory === cat ? 'rgba(201,168,76,0.08)' : 'transparent', border: `1px solid ${activeCategory === cat ? C.gold : 'transparent'}`, transition: 'all 0.2s' }}>
                <span style={{ color: activeCategory === cat ? C.gold : C.muted, fontSize: 13, fontWeight: 700 }}>{cat}</span>
              </div>
            ))}
          </div>

          {/* Availability */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Availability</p>
            {[{ key: 'readyMade', label: 'Ready-made' }, { key: 'customOrders', label: 'Custom Orders' }].map(({ key, label }) => (
              <div key={key} onClick={() => setAvailability(p => ({ ...p, [key]: !p[key] }))}
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `1px solid ${availability[key] ? C.gold : C.border}`, backgroundColor: availability[key] ? 'rgba(201,168,76,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                  {availability[key] && <span style={{ color: C.gold, fontSize: 10, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Price Range</p>
            <input type="range" min={5000} max={200000} step={5000} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))}
              style={{ width: '100%', accentColor: C.gold }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ color: C.muted, fontSize: 11 }}>KSH 5K</span>
              <span style={{ color: C.gold, fontSize: 11, fontWeight: 900 }}>KSH {(priceMax / 1000).toFixed(0)}K</span>
            </div>
          </div>

          {/* AI Features callout */}
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: C.gold, fontSize: 9, fontWeight: 900, padding: '3px 8px', borderRadius: 100, border: `1px solid rgba(201,168,76,0.3)`, letterSpacing: '0.1em' }}>AI</span>
              <p style={{ color: C.cream, fontWeight: 900, fontSize: 12 }}>Smart Recommendations</p>
            </div>
            <p style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, marginBottom: 12 }}>
              Let our AI suggest pieces based on your browsing history and style preferences.
            </p>
            <button onClick={() => setSortBy('AI Recommended')}
              style={{ width: '100%', backgroundColor: 'transparent', border: `1px solid ${C.border}`, color: C.cream, padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.04em' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.cream; }}>
              Show AI Picks →
            </button>
          </div>
        </div>

        {/* PRODUCTS */}
        <div style={{ flex: 1 }}>

          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <p style={{ color: C.muted, fontSize: 11, letterSpacing: '0.08em', marginBottom: 6 }}>Home › Search Results</p>
              <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 22, letterSpacing: '-0.01em' }}>
                {query ? <>Results for "<span style={{ color: C.gold }}>{query}</span>"</> : 'All Products'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <p style={{ color: C.muted, fontSize: 12 }}>Showing {sorted.length} pieces</p>
                {showAIBadge && (
                  <span style={{ backgroundColor: 'rgba(201,168,76,0.12)', color: C.gold, fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 100, border: `1px solid rgba(201,168,76,0.3)`, letterSpacing: '0.1em' }}>
                    AI VISUAL MATCH
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: C.muted, fontSize: 12 }}>Sort:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, color: C.cream, fontSize: 12, padding: '8px 12px', borderRadius: 8, outline: 'none', cursor: 'pointer' }}>
                {sortOptions.map(o => <option key={o} value={o} style={{ backgroundColor: C.surface }}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: '7px 16px', borderRadius: 100, fontSize: 11, fontWeight: 900, letterSpacing: '0.04em', border: `1px solid ${activeCategory === cat ? C.gold : C.border}`, backgroundColor: activeCategory === cat ? 'rgba(201,168,76,0.1)' : 'transparent', color: activeCategory === cat ? C.gold : C.muted, cursor: 'pointer', transition: 'all 0.2s' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {paginated.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 40 }}>
              {paginated.map(product => (
                <div key={product.id} onClick={() => navigate(`/product/${product.slug}`)} style={{ cursor: 'pointer' }}>
                  <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', height: 260, backgroundColor: C.surface, border: `1px solid ${aiRecommended.includes(product.id) && sortBy === 'AI Recommended' ? C.gold : C.border}`, marginBottom: 12, transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                    onMouseLeave={e => e.currentTarget.style.borderColor = aiRecommended.includes(product.id) && sortBy === 'AI Recommended' ? C.gold : C.border}>
                    <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 55%)' }} />

                    {/* Tag */}
                    {product.tag && (
                      <span style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: C.faint, color: C.cream, fontSize: 9, fontWeight: 900, padding: '4px 10px', borderRadius: 100, border: `1px solid ${C.border}`, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {product.tag}
                      </span>
                    )}

                    {/* AI badge */}
                    {aiRecommended.includes(product.id) && sortBy === 'AI Recommended' && (
                      <span style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(201,168,76,0.9)', color: '#000', fontSize: 9, fontWeight: 900, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.1em' }}>
                        AI PICK
                      </span>
                    )}

                    {/* Wishlist */}
                    <button onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
                      style={{ position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', border: `1px solid ${C.border}`, cursor: 'pointer', color: wishlist.includes(product.id) ? '#e05c5c' : C.cream, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {wishlist.includes(product.id) ? '♥' : '♡'}
                    </button>
                  </div>
                  <p style={{ color: C.cream, fontWeight: 800, fontSize: 13, marginBottom: 3, letterSpacing: '-0.01em' }}>{product.name}</p>
                  <p style={{ color: C.muted, fontSize: 11, marginBottom: 5 }}>{product.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: C.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{product.category}</span>
                    <span style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width={24} height={24} fill="none" stroke={C.muted} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 style={{ color: C.cream, fontWeight: 900, fontSize: 18, marginBottom: 8 }}>No results found</h3>
              <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>
                Nothing matched "<span style={{ color: C.cream }}>{query}</span>". Try a different search or browse all products.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button onClick={() => navigate('/search')}
                  style={{ border: `1px solid ${C.border}`, color: C.cream, padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 12, cursor: 'pointer', backgroundColor: 'transparent' }}>
                  Clear Search
                </button>
                <Link to="/shop" style={{ backgroundColor: C.gold, color: '#000', padding: '12px 24px', borderRadius: 10, fontWeight: 900, fontSize: 12, textDecoration: 'none' }}>
                  Browse All Products
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${currentPage === page ? C.gold : C.border}`, backgroundColor: currentPage === page ? C.gold : 'transparent', color: currentPage === page ? '#000' : C.muted, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>›</button>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}`, padding: '48px', marginTop: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>57</div>
            <span style={{ color: C.cream, fontWeight: 900, fontSize: 13 }}>57 ARTS & CUSTOMS</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['Fashion', '/fashion'], ['Furniture', '/furniture'], ['Beads', '/beads'], ['Custom Orders', '/custom-order']].map(([label, path]) => (
              <Link key={label} to={path} style={{ color: C.muted, fontSize: 12, textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = C.cream}
                onMouseLeave={e => e.target.style.color = C.muted}>{label}</Link>
            ))}
          </div>
          <p style={{ color: C.muted, fontSize: 11 }}>© 2024 57 Arts & Customs</p>
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progress { from { width: 0; } to { width: 70%; } }
      `}</style>
    </div>
  );
};

export default SearchResults;
