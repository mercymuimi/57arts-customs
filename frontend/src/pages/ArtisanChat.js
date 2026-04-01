import React, { useState, useRef, useEffect } from 'react';
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
  gold:    '#c9a84c',
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const artisanConversations = [
  {
    id: 1,
    artisan: 'Master Julian',
    avatar: 'MJ',
    order: '#57-992: Hand-carved Gold Frame',
    status: 'Active Now',
    preview: 'Is the varnish dried yet?',
    time: '2m ago',
    unread: 2,
    messages: [
      { id: 1, from: 'artisan', text: "Hello! I've just finished the preliminary sanding on the #57-992 frame. The texture is perfect for the gold leaf application we discussed.", time: '10:42 AM', read: true },
      { id: 2, from: 'user',    text: "That sounds amazing, Julian! Do you have any photos of the progress?", time: '10:45 AM', read: true },
      { id: 3, from: 'artisan', text: "Absolutely. Take a look at the detail on the corner carvings. I'm using a slightly different chisel for the filigree to give it more depth.", time: '10:52 AM', read: true, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
      { id: 4, from: 'user',    text: 'Wow that depth is incredible! How much longer before the gold leaf phase?', time: '11:01 AM', read: true },
      { id: 5, from: 'artisan', text: 'Is the varnish dried yet?', time: '2m ago', read: false },
    ],
  },
  {
    id: 2,
    artisan: 'Expert Sarah',
    avatar: 'ES',
    order: 'Material selection for desk',
    status: 'Away',
    preview: 'I sent the oak swatches today.',
    time: '1h ago',
    unread: 0,
    messages: [
      { id: 1, from: 'artisan', text: "I've selected three oak variants for your desk top. The quarter-sawn option will give you the most striking grain pattern.", time: 'Yesterday', read: true },
      { id: 2, from: 'user',    text: 'Please go with the quarter-sawn. Can you send swatches?', time: 'Yesterday', read: true },
      { id: 3, from: 'artisan', text: 'I sent the oak swatches today.', time: '1h ago', read: true },
    ],
  },
  {
    id: 3,
    artisan: 'Marcus V.',
    avatar: 'MV',
    order: 'Metal Engraving Kit',
    status: 'Offline',
    preview: 'Draft 2 is ready for review.',
    time: 'Yesterday',
    unread: 1,
    messages: [
      { id: 1, from: 'artisan', text: 'Draft 2 of your engraving kit layout is ready. I made the adjustments you requested on the handle grip.', time: 'Yesterday', read: false },
    ],
  },
];

const aiSuggestedPrompts = [
  'What custom furniture styles do you offer?',
  'How long does a custom order take?',
  'Can I see examples of past beadwork?',
  'What payment methods do you accept?',
  'How do I track my order?',
  'Tell me about your fashion collections',
];

const aiAutoReplies = {
  'custom furniture': "We offer a wide range of custom furniture styles — from Afro-modern minimalism to heritage teak carvings. You can browse our Furniture collection or start a custom order with your brief and one of our artisans will reach out within 24 hours.",
  'how long': "Custom orders typically take 3–8 weeks depending on complexity. Simple pieces like jewellery take 1–2 weeks, while bespoke furniture can take 6–8 weeks. You'll receive progress updates from your artisan throughout.",
  'beadwork': "Absolutely! Our beadwork artisans specialise in Fulani, Maasai, and Kente-inspired heritage pieces, as well as contemporary geometric designs. Check out the Beads & Jewelry section or browse our Gallery for examples.",
  'payment': "We accept M-Pesa, Visa, Mastercard, and bank transfer. For custom orders over KSH 20,000, we take a 50% deposit upfront and the remainder on completion.",
  'track': "Head to Order Tracking in your account dashboard to see real-time updates on your order, including artisan progress photos and shipping status.",
  'fashion': "Our fashion range spans five categories: Old Money (quiet luxury), Streetwear (heavy-duty culture), Official Wear (power dressing), Resort Wear (coastline-ready), and Avant-Garde (wearable art). Each category has both ready-made and custom options.",
  'default': "Great question! I can help with product recommendations, custom order guidance, sizing, materials, artisan information, and order tracking. What would you like to know more about?",
};

const getAIReply = (input) => {
  const lower = input.toLowerCase();
  for (const [key, reply] of Object.entries(aiAutoReplies)) {
    if (key !== 'default' && lower.includes(key)) return reply;
  }
  return aiAutoReplies['default'];
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
const ArtisanChat = () => {
  const [mode, setMode]                     = useState('ai');          // 'ai' | 'artisan'
  const [activeConvo, setActiveConvo]       = useState(artisanConversations[0]);
  const [artisanMessages, setArtisanMessages] = useState(artisanConversations[0].messages);
  const [aiMessages, setAiMessages]         = useState([
    { id: 1, from: 'ai', text: "Hi! I'm your 57 Arts AI concierge. I can help you find the perfect piece, guide you through a custom order, or answer any questions about our artisans and collections. What are you looking for today?", time: 'Now' }
  ]);
  const [input, setInput]                   = useState('');
  const [searchQuery, setSearchQuery]       = useState('');
  const [isTyping, setIsTyping]             = useState(false);
  const fileInputRef                        = useRef(null);
  const messagesEndRef                      = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, artisanMessages]);

  const handleSelectConvo = (convo) => {
    setActiveConvo(convo);
    setArtisanMessages(convo.messages);
    setInput('');
  };

  const sendArtisanMessage = () => {
    if (!input.trim()) return;
    const msg = { id: artisanMessages.length + 1, from: 'user', text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false };
    setArtisanMessages(p => [...p, msg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const replies = ["I'll get back to you shortly on that!", "Great question — let me check on that for you.", "Noted! I'll update you with photos soon.", "Working on it right now, should be done by end of day."];
      setArtisanMessages(p => [...p, { id: p.length + 1, from: 'artisan', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false }]);
      setIsTyping(false);
    }, 1600);
  };

  const sendAIMessage = (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    const userMsg = { id: aiMessages.length + 1, from: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAiMessages(p => [...p, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const reply = getAIReply(userText);
      setAiMessages(p => [...p, { id: p.length + 1, from: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = () => mode === 'ai' ? sendAIMessage() : sendArtisanMessage();
  const handleKey  = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const filteredConvos = artisanConversations.filter(c =>
    c.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.order.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = mode === 'ai' ? aiMessages : artisanMessages;

  return (
    <div style={{ backgroundColor: C.bg, color: C.cream, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '16px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Link to="/" style={{ color: C.muted, fontSize: 11, textDecoration: 'none' }}>Home</Link>
              <span style={{ color: C.muted }}>›</span>
              <span style={{ color: C.gold, fontSize: 11 }}>
                {mode === 'ai' ? 'AI Concierge' : 'Artisan Messages'}
              </span>
            </div>
            <h1 style={{ color: C.cream, fontWeight: 900, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {mode === 'ai' ? '57 AI Concierge' : 'Artisan Messages'}
            </h1>
          </div>

          {/* Mode switcher */}
          <div style={{ display: 'flex', gap: 0, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', backgroundColor: C.faint }}>
            {[
              { key: 'ai',      label: 'AI Concierge' },
              { key: 'artisan', label: 'My Artisans'  },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => { setMode(key); setInput(''); }}
                style={{ padding: '9px 20px', fontSize: 12, fontWeight: 900, letterSpacing: '0.04em', border: 'none', backgroundColor: mode === key ? C.cream : 'transparent', color: mode === key ? '#000' : C.muted, cursor: 'pointer', transition: 'all 0.2s' }}>
                {key === 'ai' && <span style={{ marginRight: 6, fontSize: 10, backgroundColor: C.gold, color: '#000', padding: '2px 6px', borderRadius: 4, fontWeight: 900 }}>AI</span>}
                {label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ position: 'relative', width: 36, height: 36, border: `1px solid ${C.border}`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', cursor: 'pointer' }}>
              <svg width={16} height={16} fill="none" stroke={C.muted} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span style={{ position: 'absolute', top: -4, right: -4, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 900, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </button>
            <Link to="/profile" style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000', fontSize: 11, textDecoration: 'none' }}>AJ</Link>
          </div>
        </div>
      </div>

      {/* ── CHAT LAYOUT ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', height: 'calc(100vh - 81px)' }}>

        {/* SIDEBAR */}
        <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${C.border}`, backgroundColor: C.surface, display: 'flex', flexDirection: 'column' }}>

          {mode === 'ai' ? (
            /* AI mode sidebar — suggested prompts */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Suggested Questions</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {aiSuggestedPrompts.map(prompt => (
                    <button key={prompt} onClick={() => sendAIMessage(prompt)}
                      style={{ textAlign: 'left', padding: '10px 12px', borderRadius: 9, border: `1px solid ${C.border}`, backgroundColor: C.bg, color: C.muted, fontSize: 12, cursor: 'pointer', lineHeight: 1.5, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.cream; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI capabilities */}
              <div style={{ padding: 16, flex: 1 }}>
                <p style={{ color: C.muted, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>I Can Help With</p>
                {[
                  { icon: '◈', label: 'Product recommendations' },
                  { icon: '◇', label: 'Custom order guidance'   },
                  { icon: '◉', label: 'Sizing & materials'      },
                  { icon: '△', label: 'Artisan introductions'   },
                  { icon: '○', label: 'Order tracking'          },
                ].map(({ icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ color: C.gold, fontSize: 12, flexShrink: 0 }}>{icon}</span>
                    <span style={{ color: C.muted, fontSize: 12 }}>{label}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: 16, borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setAiMessages([{ id: 1, from: 'ai', text: "Hi! I'm your 57 Arts AI concierge. What are you looking for today?", time: 'Now' }])}
                  style={{ width: '100%', backgroundColor: 'transparent', border: `1px solid ${C.border}`, color: C.muted, padding: '10px', borderRadius: 9, fontSize: 11, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.04em' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.bHov; e.currentTarget.style.color = C.cream; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                  Clear Conversation
                </button>
              </div>
            </div>
          ) : (
            /* Artisan mode sidebar — conversation list */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: 12, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${C.border}`, borderRadius: 9, padding: '9px 12px', backgroundColor: C.bg }}>
                  <svg width={13} height={13} fill="none" stroke={C.muted} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search conversations..."
                    style={{ background: 'none', border: 'none', outline: 'none', color: C.cream, fontSize: 12, width: '100%' }} />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredConvos.map(convo => (
                  <button key={convo.id} onClick={() => handleSelectConvo(convo)}
                    style={{ width: '100%', padding: 14, textAlign: 'left', border: 'none', borderBottom: `1px solid ${C.border}`, backgroundColor: activeConvo.id === convo.id ? 'rgba(201,168,76,0.05)' : 'transparent', borderLeft: activeConvo.id === convo.id ? `2px solid ${C.gold}` : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 9, backgroundColor: C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: C.cream }}>
                          {convo.avatar}
                        </div>
                        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, borderRadius: '50%', border: `2px solid ${C.surface}`, backgroundColor: convo.status === 'Active Now' ? '#4caf50' : convo.status === 'Away' ? C.gold : C.faint }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{convo.artisan}</p>
                          <span style={{ color: C.muted, fontSize: 10, flexShrink: 0, marginLeft: 6 }}>{convo.time}</span>
                        </div>
                        <p style={{ color: C.gold, fontSize: 10, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{convo.order}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ color: C.muted, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{convo.preview}</p>
                          {convo.unread > 0 && (
                            <span style={{ marginLeft: 6, backgroundColor: C.gold, color: '#000', fontSize: 9, fontWeight: 900, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {convo.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ padding: 12, borderTop: `1px solid ${C.border}` }}>
                <Link to="/custom-order" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.gold, color: '#000', padding: '11px', borderRadius: 9, fontWeight: 900, fontSize: 12, textDecoration: 'none', letterSpacing: '0.04em' }}>
                  + New Custom Inquiry
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* CHAT WINDOW */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: C.bg }}>

          {/* Chat header */}
          <div style={{ padding: '14px 24px', borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {mode === 'ai' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: C.gold, fontWeight: 900, fontSize: 12 }}>AI</span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ color: C.cream, fontWeight: 900, fontSize: 14 }}>57 AI Concierge</p>
                    <span style={{ backgroundColor: 'rgba(76,175,80,0.15)', color: '#4caf50', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 100 }}>● Always Online</span>
                  </div>
                  <p style={{ color: C.muted, fontSize: 11 }}>Powered by AI · Styling & product advice</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: C.cream }}>
                  {activeConvo.avatar}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ color: C.cream, fontWeight: 900, fontSize: 14 }}>{activeConvo.artisan}</p>
                    <span style={{ backgroundColor: activeConvo.status === 'Active Now' ? 'rgba(76,175,80,0.15)' : 'rgba(100,100,100,0.15)', color: activeConvo.status === 'Active Now' ? '#4caf50' : C.muted, fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 100 }}>
                      {activeConvo.status === 'Active Now' ? '●' : '○'} {activeConvo.status}
                    </span>
                  </div>
                  <p style={{ color: C.gold, fontSize: 11 }}>{activeConvo.order}</p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              {[
                <path key="phone" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
                <path key="info" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
              ].map((path, i) => (
                <button key={i} style={{ width: 36, height: 36, border: `1px solid ${C.border}`, borderRadius: 9, backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <svg width={15} height={15} fill="none" stroke={C.muted} viewBox="0 0 24 24">{path}</svg>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Date divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
              <span style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 12px', border: `1px solid ${C.border}`, borderRadius: 100, textTransform: 'uppercase' }}>
                {mode === 'ai' ? 'Today' : 'Project Started · Oct 24, 2023'}
              </span>
              <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
            </div>

            {currentMessages.map(msg => {
              const isUser = msg.from === 'user';
              const isAI   = msg.from === 'ai';
              return (
                <div key={msg.id} style={{ display: 'flex', gap: 10, flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                  {/* Avatar */}
                  {!isUser && (
                    <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: isAI ? C.faint : C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: isAI ? C.gold : C.cream, flexShrink: 0 }}>
                      {isAI ? 'AI' : activeConvo.avatar.charAt(0)}
                    </div>
                  )}

                  <div style={{ maxWidth: '65%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                    {/* Image attachment */}
                    {msg.img && (
                      <img src={msg.img} alt="Progress" style={{ width: '100%', maxWidth: 260, borderRadius: 10, border: `1px solid ${C.border}` }} />
                    )}
                    {/* Bubble */}
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: isUser ? C.cream : C.surface,
                      border: `1px solid ${isUser ? 'transparent' : C.border}`,
                      color: isUser ? '#000' : C.cream,
                      fontSize: 13,
                      lineHeight: 1.65,
                    }}>
                      {msg.text}
                    </div>
                    {/* Time + read */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexDirection: isUser ? 'row-reverse' : 'row' }}>
                      <span style={{ color: C.muted, fontSize: 10 }}>{msg.time}</span>
                      {isUser && <span style={{ color: C.muted, fontSize: 10 }}>{msg.read ? '✓✓' : '✓'}</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: C.gold }}>
                  {mode === 'ai' ? 'AI' : activeConvo.avatar.charAt(0)}
                </div>
                <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.muted, animation: `bounce 1s ${delay}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '14px 24px', borderTop: `1px solid ${C.border}`, backgroundColor: C.surface }}>
            {/* AI quick actions */}
            {mode === 'ai' && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                {['Recommend a piece', 'Start custom order', 'Track my order'].map(action => (
                  <button key={action} onClick={() => sendAIMessage(action)}
                    style={{ padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, border: `1px solid ${C.border}`, backgroundColor: 'transparent', color: C.muted, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                    {action}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              {/* Attachment (artisan mode only) */}
              {mode === 'artisan' && (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} />
                  <button onClick={() => fileInputRef.current?.click()}
                    style={{ width: 38, height: 38, flexShrink: 0, border: `1px solid ${C.border}`, borderRadius: 9, backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                    <svg width={15} height={15} fill="none" stroke={C.muted} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                </>
              )}

              {/* Text input */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 8, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 14px', backgroundColor: C.bg, transition: 'border-color 0.2s' }}
                onFocus={() => {}} >
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder={mode === 'ai' ? 'Ask me anything about 57 Arts...' : `Message ${activeConvo.artisan.split(' ')[0]}...`}
                  rows={1} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: C.cream, fontSize: 13, resize: 'none', maxHeight: 96, lineHeight: 1.5 }} />
              </div>

              {/* Send */}
              <button onClick={handleSend} disabled={!input.trim()}
                style={{ width: 38, height: 38, flexShrink: 0, border: 'none', borderRadius: 9, backgroundColor: input.trim() ? C.gold : C.faint, cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <svg width={15} height={15} fill="none" stroke={input.trim() ? '#000' : C.muted} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ArtisanChat;