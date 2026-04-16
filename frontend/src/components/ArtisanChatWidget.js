import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const C = {
  bg:      '#08080a',
  surface: '#111111',
  surface2:'#161616',
  border:  '#1c1c1c',
  bHov:    '#2e2e2e',
  faint:   '#242424',
  cream:   '#f0ece4',
  muted:   '#606060',
  dim:     '#333333',
  gold:    '#c9a84c',
};

const BASE = 'http://localhost:5000/api';

// ── Quick reply suggestions per context ──────────────────────────────────────
const QUICK_REPLIES = [
  'Show me Fashion picks',
  'What Furniture is trending?',
  'Recommend some Beads',
  'How do custom orders work?',
  'What are your best sellers?',
  'Tell me about the Artisan program',
];

// ── Typing indicator ──────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '12px 16px' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 6, height: 6, borderRadius: '50%', backgroundColor: C.muted,
        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
      }} />
    ))}
  </div>
);

// ── Product card inside chat ──────────────────────────────────────────────────
const ChatProductCard = ({ product, onNavigate }) => (
  <div
    onClick={() => onNavigate(`/product/${product.slug}`)}
    style={{ display: 'flex', gap: 10, padding: '10px', backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.2s', marginTop: 8 }}
    onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
  >
    <img src={product.img} alt={product.name} style={{ width: 52, height: 52, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
      <p style={{ color: C.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{product.category}</p>
      <p style={{ color: C.gold, fontWeight: 900, fontSize: 12 }}>KSH {product.price?.toLocaleString()}</p>
    </div>
    <div style={{ color: C.muted, fontSize: 16, alignSelf: 'center' }}>›</div>
  </div>
);

// ── Message bubble ────────────────────────────────────────────────────────────
const MessageBubble = ({ msg, onNavigate }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
      {!isUser && (
        <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000', flexShrink: 0, marginRight: 8, marginTop: 2 }}>
          AI
        </div>
      )}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          backgroundColor: isUser ? C.gold : C.surface2,
          color: isUser ? '#000' : C.cream,
          borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          padding: '11px 14px',
          fontSize: 13,
          lineHeight: 1.65,
          border: isUser ? 'none' : `1px solid ${C.border}`,
        }}>
          {msg.content}
        </div>
        {/* Product cards attached to message */}
        {msg.products && msg.products.length > 0 && (
          <div style={{ marginTop: 4 }}>
            {msg.products.map((p, i) => (
              <ChatProductCard key={i} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        )}
        <p style={{ color: C.dim, fontSize: 10, marginTop: 4, textAlign: isUser ? 'right' : 'left' }}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// ── Main Widget ───────────────────────────────────────────────────────────────
const ArtisanChatWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [typing,    setTyping]    = useState(false);
  const [recs,      setRecs]      = useState([]);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // ── Initialize chat ──
  useEffect(() => {

    // Welcome message
    setMessages([{
      role:      'assistant',
      content:   `Hi${user?.name ? ` ${user.name.split(' ')[0]}` : ''}! 👋 I'm your 57 Arts AI concierge. I can help you discover artisan pieces, answer questions about custom orders, or recommend products based on your taste.\n\nWhat are you looking for today?`,
      timestamp: new Date(),
      products:  [],
    }]);

    // Load initial recommendations
    loadRecommendations();
  }, [user]);

  // ── Auto-scroll to bottom ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // ── Load AI product recommendations for sidebar ──
  const loadRecommendations = async () => {
    try {
      const res = await axios.get(`${BASE}/ai/recommendations?n=4`);
      setRecs(res.data.recommendations || []);
    } catch { setRecs([]); }
  };

  // ── Build AI response based on user input ──
  const getAIResponse = useCallback(async (userMessage) => {
    const msg = userMessage.toLowerCase();

    // ── Keyword routing ──
    const isFashion   = msg.includes('fashion') || msg.includes('jacket') || msg.includes('cloth') || msg.includes('wear') || msg.includes('blazer') || msg.includes('denim') || msg.includes('hoodie') || msg.includes('sandal');
    const isFurniture = msg.includes('furniture') || msg.includes('chair') || msg.includes('table') || msg.includes('stool') || msg.includes('sofa') || msg.includes('teak') || msg.includes('wood');
    const isBeads     = msg.includes('bead') || msg.includes('jewel') || msg.includes('necklace') || msg.includes('cowrie') || msg.includes('obsidian') || msg.includes('gold');
    const isCustom    = msg.includes('custom') || msg.includes('commission') || msg.includes('bespoke') || msg.includes('order') || msg.includes('make');
    const isBestSell  = msg.includes('best') || msg.includes('popular') || msg.includes('trending') || msg.includes('top');
    const isArtisan   = msg.includes('artisan') || msg.includes('vendor') || msg.includes('seller') || msg.includes('join') || msg.includes('sell');
    const isShipping  = msg.includes('ship') || msg.includes('deliver') || msg.includes('how long') || msg.includes('when');
    const isPrice     = msg.includes('price') || msg.includes('cost') || msg.includes('cheap') || msg.includes('afford') || msg.includes('ksh');
    const isReturn    = msg.includes('return') || msg.includes('refund') || msg.includes('exchange');
    const isGreet     = msg.match(/^(hi|hello|hey|hei|jambo|habari|sup|yo)\b/);

    let category  = null;
    let fetchRecs = false;
    let text      = '';

    if (isGreet) {
      text = `Hey! Great to see you here. I'm your personal stylist and curator for 57 Arts & Customs. I can:\n\n• Recommend artisan pieces tailored to your taste\n• Help you start a custom commission\n• Answer any questions about our products\n\nWhat can I help you with?`;
    } else if (isFashion) {
      category  = 'Fashion';
      fetchRecs = true;
      text = `Great taste! Here are our top Fashion picks right now — hand-selected by the AI based on what's trending with buyers like you:`;
    } else if (isFurniture) {
      category  = 'Furniture';
      fetchRecs = true;
      text = `Our Furniture collection features hand-carved masterpieces by master craftsmen. Here are the top pieces:`;
    } else if (isBeads) {
      category  = 'Beads';
      fetchRecs = true;
      text = `Our Beads & Jewelry collection draws from ancestral techniques and heritage designs. Here are some standout pieces:`;
    } else if (isCustom) {
      text = `Absolutely! Custom orders are our speciality. Here's how it works:\n\n1. **Browse** existing pieces for inspiration\n2. **Submit** your custom order with material, size and style preferences\n3. **Get matched** with an artisan who specialises in your request\n4. **Track progress** with photos at each stage\n5. **Receive** your one-of-a-kind piece with a certificate of authenticity\n\nDelivery typically takes 2–4 weeks depending on complexity. Ready to start?`;
    } else if (isBestSell) {
      fetchRecs = true;
      text = `Here are the most popular pieces on 57 Arts right now — ranked by what our community is loving:`;
    } else if (isArtisan) {
      text = `Joining as an artisan vendor is free and takes minutes!\n\n✦ Set up your own storefront\n✦ AI-powered pricing recommendations\n✦ Monthly M-Pesa payouts\n✦ Real-time sales analytics\n✦ Access to thousands of buyers across Africa\n\nOver 340 artisans are already selling on the platform. Click below to get started!`;
    } else if (isShipping) {
      text = `Shipping times depend on the product type:\n\n• **Ready-made items** — 2–5 business days\n• **Custom orders** — 2–4 weeks\n• **Furniture** — 3–4 weeks\n\nWe ship to 50+ countries with full tracking. Free shipping on orders over KSH 50,000!`;
    } else if (isPrice) {
      text = `Our prices range from KSH 1,500 for fashion accessories to KSH 175,000 for premium custom furniture.\n\nAll prices are set by the artisan and reflect the quality of materials and craftsmanship. We accept M-Pesa and card payments.`;
    } else if (isReturn) {
      text = `We offer a 14-day returns policy on all ready-made items. Custom-commissioned pieces can be returned only if they don't match the agreed specifications.\n\nTo start a return, contact us through the Order Tracking page with your order number.`;
    } else {
      // Default: show popular recommendations
      fetchRecs = true;
      text = `I'm not sure I caught that — but here are some of our most-loved pieces you might enjoy:`;
    }

    // Fetch products if needed
    let products = [];
    if (fetchRecs) {
      try {
        const params = category ? `?category=${category}&n=3` : `?n=3`;
        const res = await axios.get(`${BASE}/ai/recommendations${params}`);
        products = res.data.recommendations || [];
        // Update sidebar recs too
        if (!category) setRecs(products);
      } catch { products = []; }
    }

    return { text, products };
  }, []);

  // ── Send message ──
  const sendMessage = useCallback(async (text) => {
    const content = text || input.trim();
    if (!content) return;
    setInput('');

    // Add user message
    const userMsg = { role: 'user', content, timestamp: new Date(), products: [] };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    // Save to backend (fire and forget)
    axios.post(`${BASE}/ai/interactions`, {
      user_id:    user?.id || 'guest',
      product_id: 'chat',
      action:     'view',
    }).catch(() => {});

    // Simulate realistic typing delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    try {
      const { text: responseText, products } = await getAIResponse(content);
      const botMsg = {
        role:      'assistant',
        content:   responseText,
        timestamp: new Date(),
        products,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        role:      'assistant',
        content:   'Sorry, I had trouble processing that. Please try again!',
        timestamp: new Date(),
        products:  [],
      }]);
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  }, [input, user, getAIResponse]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', color: C.cream }}>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#000' }}>AI</div>
          <div>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 14, letterSpacing: '-0.01em' }}>Artisan Chat</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4ade80' }} />
              <p style={{ color: C.muted, fontSize: 11 }}>AI Concierge · Online</p>
            </div>
          </div>
        </div>
        <Link to="/" style={{ color: C.muted, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 14px', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.bHov; e.currentTarget.style.color = C.cream; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
          ← Back to Shop
        </Link>
      </div>

      {/* ── BODY ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 0, maxWidth: 1100, margin: '0 auto', minHeight: 'calc(100vh - 65px)' }}>

        {/* LEFT: Chat area */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.border}` }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 8px' }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} onNavigate={navigate} />
            ))}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000', marginRight: 8 }}>AI</div>
                <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: '14px 14px 14px 4px' }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div style={{ padding: '8px 24px', display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: `1px solid ${C.border}` }}>
            {QUICK_REPLIES.map(qr => (
              <button key={qr} onClick={() => sendMessage(qr)}
                style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 100, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
                {qr}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, backgroundColor: C.surface }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me about products, custom orders, or anything..."
                rows={1}
                style={{ flex: 1, backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 16px', color: C.cream, fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto' }}
                onFocus={e => e.target.style.borderColor = C.bHov}
                onBlur={e => e.target.style.borderColor = C.border}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || typing}
                style={{ width: 42, height: 42, borderRadius: 11, border: 'none', backgroundColor: input.trim() && !typing ? C.gold : C.faint, color: input.trim() && !typing ? '#000' : C.dim, fontSize: 16, cursor: input.trim() && !typing ? 'pointer' : 'not-allowed', flexShrink: 0, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ↑
              </button>
            </div>
            <p style={{ color: C.dim, fontSize: 10, marginTop: 8, textAlign: 'center' }}>Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>

        {/* RIGHT: Sidebar — AI picks */}
        <div style={{ padding: '24px 20px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>✦ AI Picks</p>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 14 }}>Trending Now</p>
          </div>

          {recs.length > 0 ? recs.map((p, i) => (
            <div key={i} onClick={() => navigate(`/product/${p.slug}`)}
              style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 12, cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.bHov}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <img src={p.img} alt={p.name} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
              <div style={{ padding: '10px 12px' }}>
                <p style={{ color: C.muted, fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{p.category}</p>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</p>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 12 }}>KSH {p.price?.toLocaleString()}</p>
              </div>
            </div>
          )) : (
            <div style={{ color: C.muted, fontSize: 12, textAlign: 'center', padding: '20px 0' }}>Loading picks...</div>
          )}

          {/* Links */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/shop" style={{ backgroundColor: C.gold, color: '#000', padding: '11px', borderRadius: 10, fontWeight: 900, fontSize: 11, textDecoration: 'none', textAlign: 'center', letterSpacing: '0.04em', display: 'block' }}>
              Browse All Products →
            </Link>
            <Link to="/custom-order" style={{ backgroundColor: 'transparent', color: C.cream, padding: '11px', borderRadius: 10, fontWeight: 900, fontSize: 11, textDecoration: 'none', textAlign: 'center', letterSpacing: '0.04em', display: 'block', border: `1px solid ${C.border}` }}>
              Start Custom Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanChatWidget;