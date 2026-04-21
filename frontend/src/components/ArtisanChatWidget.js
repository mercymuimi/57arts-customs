import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const C = {
  bg: '#08080a', surface: '#111111', surface2: '#161616',
  border: '#1c1c1c', bHov: '#2e2e2e', faint: '#1a1a1a',
  cream: '#f0ece4', muted: '#606060', dim: '#2a2a2a',
  gold: '#c9a84c', green: '#4ade80', red: '#f87171',
};

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getSessionId() {
  const key = '57arts_chat_session';
  let sid = sessionStorage.getItem(key);
  if (!sid) { sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`; sessionStorage.setItem(key, sid); }
  return sid;
}
const SESSION_ID = getSessionId();

const QUICK_REPLIES = [
  { label: '👗 Fashion',         msg: 'Show me your best Fashion pieces',     category: 'fashion' },
  { label: '🪑 Furniture',       msg: 'What Furniture is trending?',           category: 'furniture' },
  { label: '📿 Beadwork',        msg: 'Show me Beads and jewellery',           category: 'beads' },
  { label: '🎨 Custom order',    msg: 'How do custom orders work?',            category: null },
  { label: '💳 Payments',        msg: 'What payment methods do you accept?',   category: null },
  { label: '🚚 Shipping',        msg: 'Tell me about shipping and delivery',   category: null },
  { label: '🔗 Affiliates',      msg: 'Tell me about the affiliate program',   category: null },
  { label: '↩️ Returns',         msg: 'What is your return policy?',           category: null },
];

// ── Typing dots ───────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '14px 18px' }}>
    {[0,1,2].map(i => (
      <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: C.gold, opacity: 0.7, animation: `chatBounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
    ))}
  </div>
);

// ── Product card in chat ──────────────────────────────────────────────────────
const ProductCard = ({ product, onNavigate }) => (
  <div onClick={() => onNavigate(`/product/${product.slug}`)}
    style={{ display: 'flex', gap: 12, padding: 12, backgroundColor: C.faint, border: `1px solid ${C.border}`, borderRadius: 12, cursor: 'pointer', marginTop: 8, transition: 'border-color 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
    <img src={product.img || product.images?.[0] || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200'}
      alt={product.name}
      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200'; }}
      style={{ width: 58, height: 58, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
      <p style={{ color: C.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{product.category}</p>
      <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>KES {Number(product.price).toLocaleString()}</p>
    </div>
    <div style={{ color: C.gold, fontSize: 20, alignSelf: 'center', flexShrink: 0 }}>›</div>
  </div>
);

// ── Render text with bold + clickable links ───────────────────────────────────
// Handles: **bold**, /shop, /custom-order, /contact etc.
const FormattedText = ({ text, onNavigate }) => {
  // Route patterns we want clickable — maps display text to actual route
  const ROUTE_MAP = {
    '/shop':          '/shop',
    '/fashion':       '/fashion',
    '/furniture':     '/furniture',
    '/beads':         '/beads',
    '/custom-order':  '/custom-order',
    '/contact':       '/contact',
    '/vendor':        '/vendor',
    '/affiliate':     '/affiliate',
    '/order-tracking':'/order-tracking',
    '/register':      '/register',
    '/login':         '/login',
    '/profile':       '/profile',
    '/artisan-chat':  '/artisan-chat',
  };

  const renderLine = (line, lineIdx) => {
    if (line === '') return <div key={lineIdx} style={{ height: 5 }} />;

    // Tokenize: split on **bold** and known /routes
    const routePattern = Object.keys(ROUTE_MAP).map(r => r.replace(/\//g, '\\/')).join('|');
    const tokenRegex = new RegExp(`(\\*\\*[^*]+\\*\\*|${routePattern})`, 'g');
    const tokens = line.split(tokenRegex).filter(t => t !== undefined);

    return (
      <p key={lineIdx} style={{ margin: '2px 0', lineHeight: 1.75 }}>
        {tokens.map((token, ti) => {
          // Bold
          if (token.startsWith('**') && token.endsWith('**')) {
            return <strong key={ti} style={{ color: C.gold, fontWeight: 900 }}>{token.slice(2, -2)}</strong>;
          }
          // Known route
          if (ROUTE_MAP[token]) {
            return (
              <button key={ti} onClick={() => onNavigate(ROUTE_MAP[token])}
                style={{ background: 'none', border: 'none', color: C.gold, fontWeight: 700, cursor: 'pointer', padding: '0 1px', fontSize: 'inherit', textDecoration: 'underline', fontFamily: 'inherit', lineHeight: 'inherit' }}>
                {token}
              </button>
            );
          }
          return <span key={ti}>{token}</span>;
        })}
      </p>
    );
  };

  return <div>{text.split('\n').map((line, i) => renderLine(line, i))}</div>;
};

// ── Shop CTA button at bottom of product responses ───────────────────────────
const ShopButton = ({ category, onNavigate }) => {
  const route = category ? `/shop?category=${category}` : '/shop';
  const label = category ? `Browse all ${category} →` : 'Browse full collection →';
  return (
    <button onClick={() => onNavigate(route)}
      style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(201,168,76,0.12)', border: `1px solid ${C.gold}`, color: C.gold, padding: '9px 16px', borderRadius: 10, fontWeight: 900, fontSize: 11, cursor: 'pointer', letterSpacing: '0.04em', width: '100%', justifyContent: 'center' }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.2)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.12)'}>
      🛍️ {label}
    </button>
  );
};

// ── Message bubble ────────────────────────────────────────────────────────────
const MessageBubble = ({ msg, onNavigate }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 20, alignItems: 'flex-end', gap: 8 }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.gold}, #a07830)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000', flexShrink: 0 }}>
          AI
        </div>
      )}
      <div style={{ maxWidth: '76%' }}>
        <div style={{
          backgroundColor: isUser ? C.gold : C.surface2,
          color: isUser ? '#000' : C.cream,
          borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
          padding: '12px 16px', fontSize: 13, lineHeight: 1.65,
          border: isUser ? 'none' : `1px solid ${C.border}`,
          boxShadow: isUser ? '0 2px 12px rgba(201,168,76,0.15)' : 'none',
        }}>
          {isUser
            ? msg.content
            : <FormattedText text={msg.content} onNavigate={onNavigate} />
          }
        </div>
        {/* Product cards */}
        {!isUser && msg.products?.length > 0 && (
          <div style={{ maxWidth: 360 }}>
            {msg.products.map((p, i) => <ProductCard key={i} product={p} onNavigate={onNavigate} />)}
            <ShopButton category={msg.category} onNavigate={onNavigate} />
          </div>
        )}
        <p style={{ color: C.muted, fontSize: 10, marginTop: 4, textAlign: isUser ? 'right' : 'left', opacity: 0.6 }}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: C.faint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: C.gold, flexShrink: 0 }}>
          {msg.userName?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
const ArtisanChatWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState('');
  const [typing,      setTyping]      = useState(false);
  const [recs,        setRecs]        = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [error,       setError]       = useState('');
  const [showQuick,   setShowQuick]   = useState(true);

  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const messagesRef = useRef([]);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // ── Welcome ──
  useEffect(() => {
    const firstName = user?.name?.split(' ')[0];
    setMessages([{
      role: 'assistant',
      content: `Hi${firstName ? ` ${firstName}` : ''}! 👋 I'm your **57 Arts AI Concierge**.\n\nI can help you discover handcrafted artisan pieces, answer questions about custom orders, shipping, payments, and more.\n\nWhat are you looking for today?`,
      timestamp: new Date(),
      products: [],
    }]);
    loadRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const loadRecommendations = async () => {
    setRecsLoading(true);
    try {
      const params = user?.id ? `?user_id=${user.id}&n=4` : '?n=4';
      const res = await axios.get(`${BASE}/ai/recommendations${params}`);
      setRecs(res.data.recommendations || []);
    } catch { setRecs([]); }
    finally { setRecsLoading(false); }
  };

  // ── Call backend ──
  const getAIResponse = useCallback(async (userMessage) => {
    const history = messagesRef.current.slice(-10).map(m => ({ role: m.role, content: m.content }));
    try {
      const res = await axios.post(`${BASE}/ai/chat`, {
        message: userMessage,
        user_id: user?.id || 'guest',
        session_id: SESSION_ID,
        history,
      });
      return {
        text:     res.data?.response || "Sorry, I couldn't get a response right now.",
        products: res.data?.products || [],
        intent:   res.data?.intent || '',
      };
    } catch {
      return { text: "I'm having a little trouble right now — please try again in a moment! 🙏", products: [], intent: '' };
    }
  }, [user]);

  const sendMessage = useCallback(async (text, category = null) => {
    const content = (text || input).trim();
    if (!content || typing) return;

    setInput('');
    setShowQuick(false);
    setError('');
    if (inputRef.current) inputRef.current.style.height = 'auto';

    setMessages(prev => [...prev, {
      role: 'user', content,
      timestamp: new Date(), products: [],
      userName: user?.name || 'You',
    }]);
    setTyping(true);

    axios.post(`${BASE}/ai/interactions`, { user_id: user?.id || 'guest', product_id: 'chat', action: 'view' }).catch(() => {});

    await new Promise(r => setTimeout(r, 500 + Math.random() * 400));

    try {
      const { text: responseText, products, intent } = await getAIResponse(content);

      // Determine category for the shop button
      const catFromIntent = { fashion: 'fashion', furniture: 'furniture', beads: 'beads' }[intent] || category;

      setMessages(prev => [...prev, {
        role: 'assistant', content: responseText,
        timestamp: new Date(), products,
        category: catFromIntent, // used for "Browse all fashion →" button
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant', content: 'Sorry, I had trouble with that. Please try again!',
        timestamp: new Date(), products: [],
      }]);
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  }, [input, typing, user, getAIResponse]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    sessionStorage.removeItem('57arts_chat_session');
    const newSid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('57arts_chat_session', newSid);
    const firstName = user?.name?.split(' ')[0];
    setMessages([{
      role: 'assistant',
      content: `Chat cleared! Hi${firstName ? ` ${firstName}` : ''}! 👋 How can I help you today?`,
      timestamp: new Date(), products: [],
    }]);
    setShowQuick(true);
    setError('');
  };

  const canSend = input.trim().length > 0 && !typing;

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh', color: C.cream, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-8px); opacity: 1; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
      `}</style>

      {/* HEADER */}
      <div style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${C.gold}, #a07830)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#000', boxShadow: '0 2px 12px rgba(201,168,76,0.3)' }}>AI</div>
          <div>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 14 }}>57 Arts AI Concierge</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: typing ? C.gold : C.green, transition: 'all 0.3s', boxShadow: typing ? `0 0 6px ${C.gold}` : `0 0 6px ${C.green}` }} />
              <p style={{ color: C.muted, fontSize: 11 }}>{typing ? 'Thinking…' : 'AI Concierge · Online'}</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={clearChat}
            style={{ background: 'none', border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.bHov; e.currentTarget.style.color = C.cream; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            🗑 Clear
          </button>
          <Link to="/" style={{ color: C.muted, fontSize: 12, textDecoration: 'none', border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 14px', fontWeight: 700 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.bHov; e.currentTarget.style.color = C.cream; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            ← Shop
          </Link>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', flex: 1, maxWidth: 1140, margin: '0 auto', width: '100%', minHeight: 'calc(100vh - 69px)' }}>

        {/* LEFT: Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: `1px solid ${C.border}` }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 12px' }}>
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} onNavigate={navigate} />)}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.gold}, #a07830)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#000' }}>AI</div>
                <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: '4px 18px 18px 18px' }}>
                  <TypingDots />
                </div>
              </div>
            )}
            {error && (
              <div style={{ backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
                <p style={{ color: C.red, fontSize: 12 }}>{error}</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {showQuick && (
            <div style={{ padding: '12px 28px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {QUICK_REPLIES.map(qr => (
                <button key={qr.msg} onClick={() => !typing && sendMessage(qr.msg, qr.category)} disabled={typing}
                  style={{ backgroundColor: C.faint, border: `1px solid ${C.border}`, color: typing ? C.dim : C.muted, fontSize: 11, fontWeight: 700, padding: '7px 13px', borderRadius: 100, cursor: typing ? 'not-allowed' : 'pointer', opacity: typing ? 0.5 : 1, transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { if (!typing) { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.08)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = typing ? C.dim : C.muted; e.currentTarget.style.backgroundColor = C.faint; }}>
                  {qr.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '16px 28px', borderTop: `1px solid ${C.border}`, backgroundColor: C.surface }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Ask about products, custom orders, shipping..." rows={1}
                style={{ width: '100%', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: '13px 16px', color: C.cream, fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, maxHeight: 130, overflowY: 'auto', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e  => e.target.style.borderColor = C.bHov}
                onBlur={e   => e.target.style.borderColor = C.border}
                onInput={e  => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px'; }} />
              <button onClick={() => sendMessage()} disabled={!canSend}
                style={{ width: 46, height: 46, borderRadius: 13, border: 'none', backgroundColor: canSend ? C.gold : C.faint, color: canSend ? '#000' : C.dim, fontSize: 18, cursor: canSend ? 'pointer' : 'not-allowed', flexShrink: 0, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: canSend ? '0 2px 12px rgba(201,168,76,0.3)' : 'none' }}>
                {typing ? '…' : '↑'}
              </button>
            </div>
            <p style={{ color: C.dim, fontSize: 10, marginTop: 8, textAlign: 'center' }}>Enter to send · Shift+Enter for new line</p>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div style={{ padding: '24px 20px', overflowY: 'auto', backgroundColor: C.faint }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: C.gold, fontSize: 10, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>✦ AI Picks</p>
            <p style={{ color: C.cream, fontWeight: 900, fontSize: 15 }}>Curated for you</p>
          </div>

          {recsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: 120, backgroundColor: C.dim }} />
                  <div style={{ padding: 12 }}>
                    <div style={{ height: 10, width: '60%', backgroundColor: C.dim, borderRadius: 4, marginBottom: 8 }} />
                    <div style={{ height: 10, width: '40%', backgroundColor: C.dim, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : recs.length > 0 ? recs.map((p, i) => (
            <div key={i} onClick={() => navigate(`/product/${p.slug}`)}
              style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 12, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}>
              <img src={p.img || p.images?.[0] || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300'}
                alt={p.name}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300'; }}
                style={{ width: '100%', height: 130, objectFit: 'cover' }} />
              <div style={{ padding: '10px 12px' }}>
                <p style={{ color: C.muted, fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{p.category}</p>
                <p style={{ color: C.cream, fontWeight: 900, fontSize: 12, marginBottom: 5, lineHeight: 1.3 }}>{p.name}</p>
                <p style={{ color: C.gold, fontWeight: 900, fontSize: 13 }}>KES {Number(p.price).toLocaleString()}</p>
              </div>
            </div>
          )) : (
            <div style={{ color: C.muted, fontSize: 12, textAlign: 'center', padding: '20px 0' }}>
              <p>No picks yet</p>
              <p style={{ fontSize: 11, marginTop: 4 }}>Browse our shop below</p>
            </div>
          )}

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: '👗 Browse Fashion',    route: '/fashion' },
              { label: '🪑 Browse Furniture',  route: '/furniture' },
              { label: '📿 Browse Beadwork',   route: '/beads' },
            ].map(btn => (
              <button key={btn.route} onClick={() => navigate(btn.route)}
                style={{ backgroundColor: 'transparent', color: C.cream, padding: '10px', borderRadius: 10, fontWeight: 900, fontSize: 11, textAlign: 'center', display: 'block', border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.cream; }}>
                {btn.label}
              </button>
            ))}
            <button onClick={() => navigate('/shop')}
              style={{ backgroundColor: C.gold, color: '#000', padding: '12px', borderRadius: 10, fontWeight: 900, fontSize: 11, textAlign: 'center', display: 'block', border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px rgba(201,168,76,0.2)', width: '100%' }}>
              Browse All Products →
            </button>
          </div>

          <div style={{ marginTop: 16, padding: '12px', backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, textAlign: 'center' }}>
            <p style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>Smart responses by</p>
            <p style={{ color: C.gold, fontWeight: 900, fontSize: 11, letterSpacing: '0.06em' }}>⚡ 57 Arts AI Engine</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanChatWidget;