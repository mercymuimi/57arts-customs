import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const conversations = [
  {
    id: 1,
    artisan: 'Master Julian',
    avatar: 'MJ',
    color: '#FFD700',
    order: '#57-992: Hand-carved Gold Frame',
    status: 'Active Now',
    preview: 'Is the varnish dried yet?',
    time: '2m ago',
    unread: 2,
    messages: [
      {
        id: 1,
        from: 'artisan',
        text: "Hello! I've just finished the preliminary sanding on the #57-992 frame. The texture is perfect for the gold leaf application we discussed.",
        time: '10:42 AM',
        read: true,
      },
      {
        id: 2,
        from: 'user',
        text: "That sounds amazing, Julian! I'm really excited about this one. Do you have any photos of the progress?",
        time: '10:45 AM',
        read: true,
      },
      {
        id: 3,
        from: 'artisan',
        text: "Absolutely. Take a look at the detail on the corner carvings. I'm using a slightly different chisel for the filigree to give it more depth.",
        time: '10:52 AM',
        read: true,
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      },
      {
        id: 4,
        from: 'user',
        text: 'Wow that depth is incredible! How much longer before the gold leaf phase?',
        time: '11:01 AM',
        read: true,
      },
      {
        id: 5,
        from: 'artisan',
        text: 'Is the varnish dried yet?',
        time: '2m ago',
        read: false,
      },
    ],
  },
  {
    id: 2,
    artisan: 'Expert Sarah',
    avatar: 'ES',
    color: '#FF6B6B',
    order: 'Material selection for desk',
    status: 'Away',
    preview: 'I sent the oak swatches today.',
    time: '1h ago',
    unread: 0,
    messages: [
      {
        id: 1,
        from: 'artisan',
        text: "I've selected three oak variants for your desk top. The quarter-sawn option will give you the most striking grain pattern.",
        time: 'Yesterday',
        read: true,
      },
      {
        id: 2,
        from: 'user',
        text: 'Please go with the quarter-sawn. Can you send swatches?',
        time: 'Yesterday',
        read: true,
      },
      {
        id: 3,
        from: 'artisan',
        text: 'I sent the oak swatches today.',
        time: '1h ago',
        read: true,
      },
    ],
  },
  {
    id: 3,
    artisan: 'Marcus V.',
    avatar: 'MV',
    color: '#4ECDC4',
    order: 'Metal Engraving Kit',
    status: 'Offline',
    preview: 'Draft 2 is ready for review.',
    time: 'Yesterday',
    unread: 1,
    messages: [
      {
        id: 1,
        from: 'artisan',
        text: 'Draft 2 of your engraving kit layout is ready. I made the adjustments you requested on the handle grip.',
        time: 'Yesterday',
        read: false,
      },
    ],
  },
];

const ArtisanChat = () => {
  const [activeConvo, setActiveConvo] = useState(conversations[0]);
  const [messages, setMessages] = useState(conversations[0].messages);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConvo = (convo) => {
    setActiveConvo(convo);
    setMessages(convo.messages);
    setInput('');
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      from: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      const replies = [
        "I'll get back to you shortly on that!",
        "Great question — let me check on that for you.",
        "Noted! I'll update you with photos soon.",
        "Working on it right now, should be done by end of day.",
      ];
      const reply = {
        id: messages.length + 2,
        from: 'artisan',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const filteredConvos = conversations.filter(c =>
    c.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.order.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#1a1500' }}>

      {/* HEADER */}
      <div style={{ backgroundColor: '#1a1a00' }} className="border-b border-gray-800 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/" className="text-gray-500 text-xs hover:text-yellow-400 transition">Home</Link>
              <span className="text-gray-700">›</span>
              <Link to="/order-tracking" className="text-gray-500 text-xs hover:text-yellow-400 transition">Order Tracking</Link>
              <span className="text-gray-700">›</span>
              <span className="text-yellow-400 text-xs">Artisan Chat</span>
            </div>
            <h1 className="text-white font-black text-lg uppercase tracking-wide">
              Artisan Messages
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative w-9 h-9 border border-gray-700 rounded-xl flex items-center justify-center hover:border-yellow-400 transition"
              style={{ backgroundColor: '#2a2000' }}
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-black w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <Link
              to="/profile"
              className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black text-xs hover:bg-yellow-500 transition"
            >
              AJ
            </Link>
          </div>
        </div>
      </div>

      {/* CHAT LAYOUT */}
      <div className="flex-1 max-w-6xl mx-auto w-full flex" style={{ height: 'calc(100vh - 130px)' }}>

        {/* SIDEBAR */}
        <div
          className="w-80 flex-shrink-0 border-r border-gray-800 flex flex-col"
          style={{ backgroundColor: '#1a1a00' }}
        >
          {/* Search */}
          <div className="p-4 border-b border-gray-800">
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-700 focus-within:border-yellow-400 transition"
              style={{ backgroundColor: '#2a2000' }}
            >
              <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="bg-transparent text-white text-xs outline-none flex-1 placeholder-gray-600"
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filteredConvos.map(convo => (
              <button
                key={convo.id}
                onClick={() => handleSelectConvo(convo)}
                className={`w-full p-4 text-left border-b border-gray-800 hover:bg-white hover:bg-opacity-5 transition ${
                  activeConvo.id === convo.id
                    ? 'bg-yellow-400 bg-opacity-5 border-l-2 border-l-yellow-400'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-xs"
                      style={{ backgroundColor: convo.color }}
                    >
                      {convo.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      convo.status === 'Active Now' ? 'bg-green-400' :
                      convo.status === 'Away' ? 'bg-yellow-400' : 'bg-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-white font-black text-sm truncate">{convo.artisan}</p>
                      <span className="text-gray-600 text-xs flex-shrink-0 ml-2">{convo.time}</span>
                    </div>
                    <p className="text-yellow-600 text-xs truncate mb-0.5">{convo.order}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-xs truncate flex-1">{convo.preview}</p>
                      {convo.unread > 0 && (
                        <span className="ml-2 bg-yellow-400 text-black text-xs font-black w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
                          {convo.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* New inquiry */}
          <div className="p-4 border-t border-gray-800">
            <Link
              to="/custom-order"
              className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-black py-3 rounded-xl font-black text-xs hover:bg-yellow-500 transition"
            >
              ✦ New Custom Inquiry
            </Link>
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: '#1a1500' }}>

          {/* Chat header */}
          <div
            className="px-6 py-4 border-b border-gray-800 flex items-center justify-between"
            style={{ backgroundColor: '#1a1a00' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-xs flex-shrink-0"
                style={{ backgroundColor: activeConvo.color }}
              >
                {activeConvo.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-black text-sm">{activeConvo.artisan}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                    activeConvo.status === 'Active Now'
                      ? 'bg-green-500 bg-opacity-20 text-green-400'
                      : 'bg-gray-700 text-gray-500'
                  }`}>
                    {activeConvo.status === 'Active Now' ? '● Active Now' : activeConvo.status}
                  </span>
                </div>
                <p className="text-yellow-600 text-xs">{activeConvo.order}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-9 h-9 border border-gray-700 rounded-xl flex items-center justify-center hover:border-yellow-400 transition"
                style={{ backgroundColor: '#2a2000' }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button
                className="w-9 h-9 border border-gray-700 rounded-xl flex items-center justify-center hover:border-yellow-400 transition"
                style={{ backgroundColor: '#2a2000' }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-800">
                PROJECT STARTED · OCT 24, 2023
              </span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {msg.from === 'artisan' && (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-xs flex-shrink-0 self-end"
                    style={{ backgroundColor: activeConvo.color }}
                  >
                    {activeConvo.avatar.charAt(0)}
                  </div>
                )}
                <div className={`max-w-sm flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-yellow-400 text-black rounded-tr-sm'
                        : 'text-white rounded-tl-sm'
                    }`}
                    style={msg.from === 'artisan' ? { backgroundColor: '#2a2000', border: '1px solid #3a3000' } : {}}
                  >
                    {msg.img && (
                      <img
                        src={msg.img}
                        alt="Progress"
                        className="w-full rounded-xl mb-2 max-w-xs"
                      />
                    )}
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-600 text-xs">{msg.time}</span>
                    {msg.from === 'user' && (
                      <span className="text-gray-600 text-xs">{msg.read ? '✓✓' : '✓'}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="px-6 py-4 border-t border-gray-800"
            style={{ backgroundColor: '#1a1a00' }}
          >
            <div className="flex items-end gap-3">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 flex-shrink-0 border border-gray-700 rounded-xl flex items-center justify-center hover:border-yellow-400 transition"
                style={{ backgroundColor: '#2a2000' }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              <div
                className="flex-1 flex items-end gap-2 px-4 py-2.5 rounded-xl border border-gray-700 focus-within:border-yellow-400 transition"
                style={{ backgroundColor: '#2a2000' }}
              >
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Type a message to ${activeConvo.artisan.split(' ')[0]}...`}
                  rows={1}
                  className="flex-1 bg-transparent text-white text-sm outline-none resize-none placeholder-gray-600 max-h-24"
                  style={{ lineHeight: '1.5' }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 flex-shrink-0 bg-yellow-400 rounded-xl flex items-center justify-center hover:bg-yellow-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanChat;