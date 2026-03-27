import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'fashion',
    icon: '👔',
    label: 'Fashion',
    desc: 'Bespoke apparel, statement pieces, and heritage-infused streetwear.',
    materials: [
      { id: 'organic-cotton', name: 'Organic Cotton', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300' },
      { id: 'aso-oke', name: 'Aso-Oke Hand-woven', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300' },
      { id: 'italian-velvet', name: 'Italian Velvet', img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300' },
      { id: 'selvedge-denim', name: '14oz Selvedge Denim', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300' },
      { id: 'belgian-linen', name: 'Belgian Linen', img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300' },
      { id: 'kente-cloth', name: 'Kente Cloth', img: 'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=300' },
    ],
    timeline: '2–4 Weeks',
    basePrice: 'KES 15,000',
  },
  {
    id: 'furniture',
    icon: '🪑',
    label: 'Furniture',
    desc: 'Custom carved wood, sculptural metalwork, and functional art.',
    materials: [
      { id: 'solid-mahogany', name: 'Solid Mahogany', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300' },
      { id: 'teak-wood', name: 'Teak Wood', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300' },
      { id: 'recycled-brass', name: 'Recycled Brass', img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300' },
      { id: 'walnut', name: 'Black Walnut', img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300' },
      { id: 'reclaimed-oak', name: 'Reclaimed Oak', img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300' },
      { id: 'cast-iron', name: 'Cast Iron', img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300' },
    ],
    timeline: '4–8 Weeks',
    basePrice: 'KES 45,000',
  },
  {
    id: 'beads',
    icon: '💎',
    label: 'Beads & Jewelry',
    desc: 'Intricate traditional beadwork, modern accents, and luxury accessories.',
    materials: [
      { id: 'obsidian', name: 'Genuine Obsidian', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300' },
      { id: 'gold-leaf', name: '24k Gold Leaf', img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=300' },
      { id: 'glass-beads', name: 'Venetian Glass Beads', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300' },
      { id: 'sterling-silver', name: 'Sterling Silver', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300' },
      { id: 'coral', name: 'Natural Coral', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300' },
      { id: 'turquoise', name: 'Turquoise Stone', img: 'https://images.unsplash.com/photo-1551651653-c5186a1524ba?w=300' },
    ],
    timeline: '1–3 Weeks',
    basePrice: 'KES 8,000',
  },
];

const aiRenders = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600',
];

const steps = [
  { num: '01', label: 'CATEGORY', desc: 'Define the craft' },
  { num: '02', label: 'VISION', desc: 'Sketch & Description' },
  { num: '03', label: 'MATERIALS', desc: 'Finishes & Textures' },
  { num: '04', label: 'REVIEW', desc: 'Confirm & Quote' },
];

const saveDraftToStorage = (draft) => {
  try {
    const existing = JSON.parse(localStorage.getItem('57arts_drafts') || '[]');
    const idx = existing.findIndex(d => d.id === draft.id);
    if (idx >= 0) {
      existing[idx] = draft;
    } else {
      existing.unshift(draft);
    }
    localStorage.setItem('57arts_drafts', JSON.stringify(existing));
  } catch (e) {
    console.error('Could not save draft', e);
  }
};

const CustomOrder = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [vision, setVision] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiRender, setAiRender] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedDraft, setSubmittedDraft] = useState(null);
  const [savedDraft, setSavedDraft] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [draftId] = useState(() => `draft_${Date.now()}`);

  const category = categories.find(c => c.id === selectedCategory);

  const toggleMaterial = (id) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(f => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      url: URL.createObjectURL(f),
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleGenerateRender = () => {
    if (!vision.trim()) return;
    setAiGenerating(true);
    setAiRender(null);
    setTimeout(() => {
      const render = aiRenders[Math.floor(Math.random() * aiRenders.length)];
      setAiRender(render);
      setAiGenerating(false);
    }, 2500);
  };

  const buildDraftObject = (status) => ({
    id: draftId,
    status,
    category: selectedCategory,
    categoryLabel: category?.label || '',
    categoryIcon: category?.icon || '',
    vision,
    materials: selectedMaterials,
    materialNames: category?.materials
      .filter(m => selectedMaterials.includes(m.id))
      .map(m => m.name) || [],
    aiRender,
    filesCount: uploadedFiles.length,
    timeline: category?.timeline || '',
    basePrice: category?.basePrice || '',
    savedAt: new Date().toISOString(),
  });

  const handleSaveDraft = () => {
    if (!selectedCategory) return;
    const draft = buildDraftObject('draft');
    saveDraftToStorage(draft);
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 3000);
  };

  const handleSubmit = () => {
    if (!selectedCategory || !vision.trim()) return;
    const draft = buildDraftObject('submitted');
    saveDraftToStorage(draft);
    setSubmittedDraft(draft);
    setSubmitted(true);
  };

  const progressPct = !selectedCategory ? 0
    : !vision ? 25
    : selectedMaterials.length === 0 ? 50
    : aiRender ? 100 : 75;

  // ── SUBMITTED PAGE ──
  if (submitted && submittedDraft) {
    return (
      <div
        className="min-h-screen text-white flex items-center justify-center px-8"
        style={{ backgroundColor: '#1a1500' }}
      >
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✦
          </div>
          <h1 className="text-white font-black text-3xl uppercase mb-2">Vision Submitted!</h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Your custom order brief has been sent to our master artisans.
            You'll receive a quote and timeline within{' '}
            <span className="text-yellow-400 font-black">24–48 hours</span>.
          </p>

          {/* Summary */}
          <div
            className="rounded-2xl border border-gray-800 p-6 mb-6 text-left"
            style={{ backgroundColor: '#1a1a00' }}
          >
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-4">
              Brief Summary
            </p>
            <div className="space-y-3">
              {[
                { label: 'Category', value: submittedDraft.categoryLabel },
                { label: 'Materials', value: `${submittedDraft.materials.length} selected` },
                { label: 'Files', value: `${submittedDraft.filesCount} uploaded` },
                { label: 'AI Render', value: submittedDraft.aiRender ? 'Generated ✓' : 'Not generated', green: !!submittedDraft.aiRender },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-500 text-xs">{row.label}</span>
                  <span className={`text-xs font-black ${row.green ? 'text-green-400' : 'text-white'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
                <span className="text-gray-500 text-xs">Est. Base Price</span>
                <span className="text-yellow-400 font-black text-lg">{submittedDraft.basePrice}+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Est. Timeline</span>
                <span className="text-white text-xs font-black">{submittedDraft.timeline}</span>
              </div>
            </div>
            {vision && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Your Vision</p>
                <p className="text-gray-300 text-xs leading-relaxed italic">"{vision}"</p>
              </div>
            )}
          </div>

          {/* What happens next */}
          <div
            className="rounded-2xl border border-yellow-900 p-5 mb-8 text-left"
            style={{ backgroundColor: '#2a2000' }}
          >
            <p className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-3">
              What Happens Next
            </p>
            <div className="space-y-3">
              {[
                'Artisan reviews your brief and vision',
                'You receive a detailed quote + timeline',
                'Approve quote and make payment',
                'Crafting begins — track progress live',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="bg-yellow-400 text-black font-black text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-gray-300 text-xs">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/vision-board"
              className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition text-center"
            >
              View Vision Board
            </Link>
            <Link
              to="/shop"
              className="flex-1 border border-gray-700 text-gray-300 py-3 rounded-xl font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* HERO */}
      <div
        style={{ backgroundColor: '#1a1a00' }}
        className="border-b border-gray-800 px-8 py-10 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 50%, #FFD700, transparent 60%)' }}
        />
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-px bg-yellow-400" />
              <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
                AI-Powered Creation
              </span>
            </div>
            <h1 className="text-5xl font-black uppercase leading-tight mb-3">
              Custom Design<br />
              <span className="text-yellow-400 italic">Studio.</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Co-create your masterpiece with AI-powered precision. Our bespoke
              process combines traditional African craftsmanship with
              future-forward generative design.
            </p>
            <Link
              to="/vision-board"
              className="inline-flex items-center gap-2 mt-4 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-xs font-black hover:border-yellow-400 hover:text-yellow-400 transition"
            >
              🎨 View My Vision Board
            </Link>
          </div>

          {/* Step indicators */}
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={`flex items-center gap-4 p-3 rounded-xl transition cursor-pointer ${
                  activeStep === i + 1
                    ? 'border border-yellow-900 bg-yellow-400 bg-opacity-5'
                    : 'opacity-40'
                }`}
                onClick={() => setActiveStep(i + 1)}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                  activeStep > i + 1
                    ? 'bg-yellow-400 text-black'
                    : activeStep === i + 1
                    ? 'border-2 border-yellow-400 text-yellow-400'
                    : 'border border-gray-700 text-gray-600'
                }`}>
                  {activeStep > i + 1 ? '✓' : s.num}
                </div>
                <div>
                  <p className={`font-black text-sm ${activeStep === i + 1 ? 'text-white' : 'text-gray-500'}`}>
                    {s.label}
                  </p>
                  <p className="text-gray-600 text-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10 space-y-12">

        {/* AI BANNER */}
        <div
          className="rounded-2xl p-5 border border-yellow-900 flex items-center gap-4"
          style={{ backgroundColor: '#2a2000' }}
        >
          <span className="text-yellow-400 text-xl">✦</span>
          <div className="flex-1">
            <p className="text-yellow-400 font-black text-sm mb-0.5">AI Design Assist</p>
            <p className="text-gray-400 text-sm">
              Our AI analyzes your vision, sketches, and preferences to suggest
              material harmonies and structural optimizations.
            </p>
          </div>
          <div className="w-32 flex-shrink-0">
            <div className="flex justify-between mb-1">
              <p className="text-gray-600 text-xs">Progress</p>
              <p className="text-yellow-400 text-xs font-black">{progressPct}%</p>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* STEP 1 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-yellow-400 text-black font-black text-xs px-2 py-1 rounded-lg">Step 1</span>
            <h2 className="text-white font-black text-xl">
              Choose your <span className="text-yellow-400">Canvas</span>
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedMaterials([]);
                  setActiveStep(2);
                }}
                className={`p-5 rounded-2xl border-2 text-left transition ${
                  selectedCategory === cat.id
                    ? 'border-yellow-400 bg-yellow-400 bg-opacity-5'
                    : 'border-gray-800 hover:border-gray-600'
                }`}
                style={{ backgroundColor: selectedCategory === cat.id ? undefined : '#1a1a00' }}
              >
                <span className="text-3xl block mb-3">{cat.icon}</span>
                <p className={`font-black text-base mb-2 ${selectedCategory === cat.id ? 'text-yellow-400' : 'text-white'}`}>
                  {cat.label}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">{cat.desc}</p>
                <div className="flex justify-between mt-4 pt-3 border-t border-gray-800">
                  <span className="text-gray-600 text-xs">{cat.timeline}</span>
                  <span className="text-yellow-400 text-xs font-black">{cat.basePrice}+</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-yellow-400 text-black font-black text-xs px-2 py-1 rounded-lg">Step 2</span>
            <h2 className="text-white font-black text-xl">
              Share your <span className="text-yellow-400">Vision</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                Describe Your Piece
              </label>
              <textarea
                value={vision}
                onChange={e => {
                  setVision(e.target.value);
                  if (e.target.value) setActiveStep(prev => Math.max(prev, 2));
                }}
                placeholder="Describe the vibe, the occasion, the story..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition resize-none placeholder-gray-700"
                style={{ backgroundColor: '#1a1a00' }}
              />
              <div className="flex justify-between mt-1">
                <p className="text-gray-700 text-xs">{vision.length} characters</p>
                {vision.length > 0 && vision.length < 30 && (
                  <p className="text-yellow-600 text-xs">Add more detail for better AI results</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Upload */}
              <div>
                <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                  Upload Inspiration
                </label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`rounded-xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
                    dragOver
                      ? 'border-yellow-400 bg-yellow-400 bg-opacity-5'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: '#1a1a00' }}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,.pdf"
                    onChange={e => handleFileUpload(e.target.files)}
                  />
                  <p className="text-3xl mb-2">🖼</p>
                  <p className="text-gray-400 text-sm font-black">
                    Drop sketches or moodboard images here
                  </p>
                  <p className="text-gray-600 text-xs mt-1">PNG, JPG, PDF up to 10MB</p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-xl border border-gray-800"
                        style={{ backgroundColor: '#2a2000' }}
                      >
                        <img src={f.url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-black truncate">{f.name}</p>
                          <p className="text-gray-600 text-xs">{f.size}</p>
                        </div>
                        <button
                          onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}
                          className="text-gray-600 hover:text-red-400 transition text-xs"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Render */}
              <div
                className="rounded-xl border border-yellow-900 p-4"
                style={{ backgroundColor: '#2a2000' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-400">✦</span>
                  <p className="text-yellow-400 font-black text-xs uppercase tracking-widest">
                    AI Visualization Engine
                  </p>
                </div>

                {!aiRender && !aiGenerating && (
                  <>
                    <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                      {vision.trim()
                        ? '"I can generate a 3D visualization based on your description. Would you like to see a draft?"'
                        : 'Add a description above to enable AI visualization.'
                      }
                    </p>
                    <button
                      onClick={handleGenerateRender}
                      disabled={!vision.trim()}
                      className="w-full bg-yellow-400 text-black py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Generate Draft Render
                    </button>
                  </>
                )}

                {aiGenerating && (
                  <div className="text-center py-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-yellow-400 animate-spin text-lg">⟳</span>
                      <p className="text-yellow-400 font-black text-xs">AI is visualizing your concept...</p>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full animate-pulse" style={{ width: '70%' }} />
                    </div>
                  </div>
                )}

                {aiRender && !aiGenerating && (
                  <div>
                    <div className="rounded-xl overflow-hidden mb-3" style={{ height: '140px' }}>
                      <img src={aiRender} alt="AI Render" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleGenerateRender}
                        className="flex-1 border border-yellow-400 text-yellow-400 py-2 rounded-xl font-black text-xs hover:bg-yellow-400 hover:text-black transition"
                      >
                        Regenerate
                      </button>
                      <button className="flex-1 bg-yellow-400 text-black py-2 rounded-xl font-black text-xs hover:bg-yellow-500 transition">
                        Use This →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3 */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-yellow-400 text-black font-black text-xs px-2 py-1 rounded-lg">Step 3</span>
            <h2 className="text-white font-black text-xl">
              Select <span className="text-yellow-400">Materials</span>
            </h2>
          </div>

          {!selectedCategory ? (
            <div
              className="rounded-2xl border border-dashed border-gray-700 p-10 text-center"
              style={{ backgroundColor: '#1a1a00' }}
            >
              <p className="text-3xl mb-3">🎨</p>
              <p className="text-gray-500 text-sm">
                ← Choose a canvas category first to see available materials
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-xs mb-5">
                Materials for{' '}
                <span className="text-yellow-400 font-black capitalize">{selectedCategory}</span>
                {' '}— select all that apply
              </p>
              <div className="grid grid-cols-4 gap-4">
                {category.materials.map(mat => (
                  <button
                    key={mat.id}
                    onClick={() => {
                      toggleMaterial(mat.id);
                      setActiveStep(prev => Math.max(prev, 3));
                    }}
                    className={`rounded-2xl overflow-hidden border-2 transition group ${
                      selectedMaterials.includes(mat.id)
                        ? 'border-yellow-400'
                        : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className="relative" style={{ height: '100px' }}>
                      <img
                        src={mat.img}
                        alt={mat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {selectedMaterials.includes(mat.id) && (
                        <div className="absolute inset-0 bg-yellow-400 bg-opacity-20 flex items-center justify-center">
                          <span className="bg-yellow-400 text-black w-7 h-7 rounded-full flex items-center justify-center font-black text-sm">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2" style={{ backgroundColor: '#1a1a00' }}>
                      <p className={`text-xs font-black text-center ${
                        selectedMaterials.includes(mat.id) ? 'text-yellow-400' : 'text-white'
                      }`}>
                        {mat.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* STICKY BOTTOM BAR */}
        <div
          className="sticky bottom-0 rounded-2xl border border-gray-800 p-5 flex items-center justify-between"
          style={{ backgroundColor: '#1a1a00' }}
        >
          <div className="flex items-center gap-6">
            <div>
              <p className="text-gray-500 text-xs">Timeline</p>
              <p className="text-white font-black text-sm">{category?.timeline || '—'}</p>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div>
              <p className="text-gray-500 text-xs">Starting at</p>
              <p className="text-yellow-400 font-black text-sm">{category?.basePrice || '—'}</p>
            </div>
            {selectedMaterials.length > 0 && (
              <>
                <div className="w-px h-8 bg-gray-800" />
                <div>
                  <p className="text-gray-500 text-xs">Materials</p>
                  <p className="text-white font-black text-sm">{selectedMaterials.length} selected</p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {savedDraft && (
              <span className="text-green-400 text-xs font-black animate-pulse">✓ Draft Saved!</span>
            )}
            <button
              onClick={handleSaveDraft}
              disabled={!selectedCategory}
              className="border border-gray-700 text-gray-300 px-5 py-3 rounded-xl font-black text-sm hover:border-yellow-400 hover:text-yellow-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedCategory || !vision.trim()}
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              SUBMIT VISION
              {(!selectedCategory || !vision.trim()) && (
                <span className="text-xs opacity-70">
                  {!selectedCategory ? '(pick category)' : '(add description)'}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* AI PROCESS */}
        <div className="py-8 text-center border-t border-gray-800">
          <h2 className="text-white font-black text-2xl mb-2">The AI Design Assist Process</h2>
          <p className="text-gray-500 text-sm mb-10">
            How we blend futuristic technology with ancestral craft to bring your imagination to life.
          </p>
          <div className="grid grid-cols-4 gap-5">
            {[
              { icon: '✍️', title: 'You Describe', desc: 'Share your vision, mood, references and inspiration' },
              { icon: '🧠', title: 'AI Analyzes', desc: 'Our model identifies patterns, materials and structural possibilities' },
              { icon: '🎨', title: 'Draft Generated', desc: 'A 3D visualization is rendered from your description' },
              { icon: '🤝', title: 'Artisan Refines', desc: 'Master craftsmen take the AI draft and bring it to life' },
            ].map(item => (
              <div
                key={item.title}
                className="rounded-2xl p-5 border border-gray-800"
                style={{ backgroundColor: '#1a1a00' }}
              >
                <span className="text-3xl block mb-3">{item.icon}</span>
                <p className="text-white font-black text-sm mb-2">{item.title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;