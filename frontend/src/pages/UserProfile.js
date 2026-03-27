import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ── MOCK USER ─────────────────────────────────────────────
const DEFAULT_USER = {
  name: 'Alex Julian',
  email: 'alex.julian@bespoke-arts.com',
  phone: '+1 (555) 892-0192',
  tier: 'VIP',
  badge: 'Collector',
  since: 'Since Oct 2023',
  avatar: 'AJ',
  address: {
    street: '722 Luxury Lane, Suite 57',
    city: 'Manhattan, NY 10001',
    country: 'United States',
  },
  stats: { orders: 12, designs: 5, wishlist: 24, drafts: 3 },
  orders: [
    {
      id: '#ART-9921',
      name: 'Golden Horizon - Custom Acrylic',
      date: 'Placed Oct 22, 2023',
      price: '$4,250.00',
      status: 'DELIVERED',
      img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100',
    },
    {
      id: '#ART-9844',
      name: 'Bespoke Carbon Fiber Sculpture',
      date: 'Placed Oct 15, 2023',
      price: '$12,800.00',
      status: 'IN TRANSIT',
      img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=100',
    },
  ],
  savedDesigns: [
    {
      name: 'Obsidian Ring Design',
      status: 'DRAFT · CART PENDING',
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300',
    },
    {
      name: 'Midnight GT Interior Concept',
      status: 'AWAITING REVIEW',
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300',
    },
  ],
  wishlist: [
    { name: 'Neural Tides #5',      price: '$1,200', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200' },
    { name: 'Heritage Chronograph', price: '$3,400', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
    { name: 'Carrara Flow #2',      price: '$890',   img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200' },
  ],
};

const statusColors = {
  DELIVERED:    'bg-green-500',
  'IN TRANSIT': 'bg-yellow-500',
  PROCESSING:   'bg-blue-500',
  CANCELLED:    'bg-red-500',
};

// ── PASSWORD STRENGTH ─────────────────────────────────────
const checkStrength = (pw) => {
  const rules = [
    { label: 'At least 8 characters',         pass: pw.length >= 8                         },
    { label: 'One uppercase letter (A-Z)',     pass: /[A-Z]/.test(pw)                       },
    { label: 'One lowercase letter (a-z)',     pass: /[a-z]/.test(pw)                       },
    { label: 'One number (0-9)',               pass: /[0-9]/.test(pw)                       },
    { label: 'One special character (!@#$…)',  pass: /[!@#$%^&*(),.?":{}|<>]/.test(pw)     },
  ];
  const score = rules.filter(r => r.pass).length;
  return { rules, score };
};

const strengthMeta = (score) => {
  if (score <= 1) return { label: 'Very Weak',  bar: 'bg-red-500',    text: 'text-red-400'    };
  if (score === 2) return { label: 'Weak',       bar: 'bg-orange-500', text: 'text-orange-400' };
  if (score === 3) return { label: 'Fair',       bar: 'bg-yellow-500', text: 'text-yellow-400' };
  if (score === 4) return { label: 'Strong',     bar: 'bg-blue-500',   text: 'text-blue-400'   };
  return               { label: 'Very Strong', bar: 'bg-green-500',  text: 'text-green-400'  };
};

// ── HELPERS ───────────────────────────────────────────────
const getInitials = (name) =>
  name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

// ── COMPONENT ─────────────────────────────────────────────
const UserProfile = () => {
  const navigate = useNavigate();

  // Auth
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const [authMode, setAuthMode]         = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [registered, setRegistered]     = useState(false);
  const [countdown, setCountdown]       = useState(3);

  // Forms
  const [signinForm, setSigninForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '', email: '', password: '', confirm: '', role: 'buyer',
  });

  // Logged-in user — starts null, set on login/register
  const [user, setUser] = useState(null);

  // Profile tabs
  const [activeTab, setActiveTab] = useState('personal');

  // Edit profile modal
  const [editOpen, setEditOpen]   = useState(false);
  const [editForm, setEditForm]   = useState({});
  const [editSection, setEditSection] = useState('contact');
  const [editSaved, setEditSaved] = useState(false);

  // Change password inside edit modal
  const [pwForm, setPwForm]             = useState({ current: '', newPw: '', confirm: '' });
  const [showPwFields, setShowPwFields] = useState({ current: false, new: false, confirm: false });
  const [pwError, setPwError]           = useState('');
  const [pwSaved, setPwSaved]           = useState(false);

  // Password strength for signup
  const strength = checkStrength(signupForm.password);
  const sl       = strengthMeta(strength.score);

  // New password strength for edit
  const newPwStrength = checkStrength(pwForm.newPw);
  const newPwMeta     = strengthMeta(newPwStrength.score);

  // Countdown after registration
  useEffect(() => {
    if (!registered) return;
    if (countdown === 0) { setIsLoggedIn(true); setRegistered(false); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [registered, countdown]);

  // Open edit modal — populate with current user data
  const openEdit = () => {
    setEditForm({
      name:    user.name,
      email:   user.email,
      phone:   user.phone    || '',
      street:  user.address?.street  || '',
      city:    user.address?.city    || '',
      country: user.address?.country || '',
    });
    setPwForm({ current: '', newPw: '', confirm: '' });
    setPwError('');
    setPwSaved(false);
    setEditSaved(false);
    setEditSection('contact');
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) return;
    setUser(prev => ({
      ...prev,
      name:    editForm.name,
      email:   editForm.email,
      phone:   editForm.phone,
      avatar:  getInitials(editForm.name),
      address: {
        street:  editForm.street,
        city:    editForm.city,
        country: editForm.country,
      },
    }));
    setEditSaved(true);
    setTimeout(() => { setEditSaved(false); setEditOpen(false); }, 1500);
  };

  const savePassword = () => {
    setPwError('');
    if (!pwForm.current)             { setPwError('Enter your current password.'); return; }
    if (newPwStrength.score < 3)     { setPwError('New password is too weak.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('New passwords do not match.'); return; }
    setPwSaved(true);
    setTimeout(() => { setPwSaved(false); setPwForm({ current: '', newPw: '', confirm: '' }); }, 2000);
  };

  // ── VALIDATION ────────────────────────────────────────────
  const validateSignIn = () => {
    if (!signinForm.email.trim())                 return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(signinForm.email))  return 'Enter a valid email address.';
    if (!signinForm.password)                     return 'Password is required.';
    return null;
  };

  const validateSignUp = () => {
    if (!signupForm.name.trim())                  return 'Full name is required.';
    if (!signupForm.email.trim())                 return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(signupForm.email))  return 'Enter a valid email address.';
    if (strength.score < 5)                       return `Password needs: ${strength.rules.filter(r => !r.pass).map(r => r.label).join(', ')}.`;
    if (signupForm.password !== signupForm.confirm) return 'Passwords do not match.';
    return null;
  };

  // ── HANDLERS ─────────────────────────────────────────────
  const handleSignIn = (e) => {
    e.preventDefault();
    const err = validateSignIn();
    if (err) { setError(err); return; }
    setError(''); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Sign in → load mock profile (real backend will return actual user)
      setUser(DEFAULT_USER);
      setIsLoggedIn(true);
    }, 1000);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const err = validateSignUp();
    if (err) { setError(err); return; }
    setError(''); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Create new user from signup form
      setUser({
        name:    signupForm.name,
        email:   signupForm.email,
        phone:   '',
        tier:    'Member',
        badge:   signupForm.role === 'vendor' ? 'Vendor' : 'Buyer',
        since:   `Since ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
        avatar:  getInitials(signupForm.name),
        role:    signupForm.role,
        address: { street: '', city: '', country: '' },
        stats:   { orders: 0, designs: 0, wishlist: 0, drafts: 0 },
        orders:       [],
        savedDesigns: [],
        wishlist:     [],
      });
      setRegistered(true);
      setCountdown(3);
    }, 1200);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setSigninForm({ email: '', password: '' });
    setSignupForm({ name: '', email: '', password: '', confirm: '', role: 'buyer' });
    setActiveTab('personal');
    setError('');
  };

  // ── REGISTRATION SUCCESS ──────────────────────────────────
  if (registered && user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8"
        style={{ backgroundColor: '#1a1500' }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✦
          </div>
          <h1 className="text-white font-black text-3xl uppercase mb-2">
            Welcome to the Collective!
          </h1>
          <p className="text-gray-400 text-sm mb-2 leading-relaxed">
            Your account has been created successfully.
          </p>
          <p className="text-gray-500 text-xs mb-8">
            A verification email has been sent to{' '}
            <span className="text-yellow-400 font-black">{user.email}</span>.
          </p>

          {/* Account summary */}
          <div className="rounded-2xl border border-gray-800 p-6 mb-6 text-left"
            style={{ backgroundColor: '#1a1a00' }}>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-4">
              Account Summary
            </p>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800">
              <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black text-sm">
                {user.avatar}
              </div>
              <div>
                <p className="text-white font-black">{user.name}</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Account type', value: user.role === 'vendor' ? '🏪 Vendor' : '🛍 Buyer' },
                { label: 'Member since', value: user.since },
                { label: 'Tier',         value: user.tier  },
              ].map(r => (
                <div key={r.label} className="flex justify-between border-b border-gray-800 pb-2 last:border-0">
                  <span className="text-gray-500 text-xs">{r.label}</span>
                  <span className="text-white font-black text-xs">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor note */}
          {user.role === 'vendor' && (
            <div className="rounded-2xl border border-yellow-900 p-4 mb-6 text-left"
              style={{ backgroundColor: '#2a2000' }}>
              <p className="text-yellow-400 font-black text-xs mb-1">🏪 Vendor Account</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Your vendor application is under review. We'll email you within
                48 hours once approved to start listing products.
              </p>
            </div>
          )}

          {/* Countdown */}
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center font-black text-yellow-400 text-sm">
              {countdown}
            </div>
            <span>Redirecting to your profile...</span>
          </div>

          <button
            onClick={() => { setIsLoggedIn(true); setRegistered(false); }}
            className="w-full bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition"
          >
            Go to My Profile Now →
          </button>
        </div>
      </div>
    );
  }

  // ── AUTH PAGE ─────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: '#1a1500' }}>

        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
          style={{ backgroundColor: '#1a1a00' }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #FFD700, transparent 60%)' }} />
          <Link to="/" className="flex items-center gap-2 relative z-10">
            <span className="bg-yellow-400 text-black w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm">57</span>
            <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
          </Link>
          <div className="relative z-10">
            <h1 className="text-6xl font-black uppercase leading-none mb-4">
              CRAFT YOUR<br /><span className="text-yellow-400">IDENTITY.</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
              Premium custom art and lifestyle design for the digital age.
              Join the elite collective of creators and collectors.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#FFD700','#FF6B6B','#4ECDC4','#45B7D1'].map((color, i) => (
                  <div key={i}
                    className="w-9 h-9 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-black text-black"
                    style={{ backgroundColor: color }}>
                    {['AJ','MK','OT','RS'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-black text-sm">15K+ MEMBERS</p>
                <p className="text-gray-500 text-xs">ACTIVE CREATORS</p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 text-xs relative z-10">© 2024 57 ARTS & CUSTOMS. ALL RIGHTS RESERVED.</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex items-center justify-center px-8 py-12"
          style={{ backgroundColor: '#1a1500' }}>
          <div className="w-full max-w-md">

            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <span className="bg-yellow-400 text-black w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm">57</span>
              <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
            </Link>

            {/* Tab switcher */}
            <div className="flex rounded-xl p-1 mb-8 border border-gray-800"
              style={{ backgroundColor: '#1a1a00' }}>
              {['signin','signup'].map(mode => (
                <button key={mode}
                  onClick={() => { setAuthMode(mode); setError(''); }}
                  className={`flex-1 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest transition ${
                    authMode === mode ? 'bg-yellow-400 text-black' : 'text-gray-500 hover:text-white'
                  }`}>
                  {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 text-xs px-4 py-3 rounded-xl mb-5 leading-relaxed">
                {error}
              </div>
            )}

            {/* ── SIGN IN ── */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} noValidate>
                <h2 className="text-white font-black text-3xl uppercase mb-1">Welcome Back</h2>
                <p className="text-gray-500 text-sm mb-8">Enter your credentials to access your studio.</p>
                <div className="space-y-5">
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                      Email Address
                    </label>
                    <input type="email" value={signinForm.email}
                      onChange={e => { setSigninForm({ ...signinForm, email: e.target.value }); setError(''); }}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none border border-gray-800 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#1a1a00' }} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-gray-500 text-xs font-black uppercase tracking-widest">Password</label>
                      <button type="button" className="text-yellow-400 text-xs font-black hover:underline">
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={signinForm.password}
                        onChange={e => { setSigninForm({ ...signinForm, password: e.target.value }); setError(''); }}
                        placeholder="••••••••••"
                        className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none border border-gray-800 focus:border-yellow-400 transition placeholder-gray-700 pr-16"
                        style={{ backgroundColor: '#1a1a00' }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-yellow-400 text-xs font-black transition">
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full mt-7 bg-yellow-400 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition disabled:opacity-60">
                  {loading ? 'Authenticating...' : 'AUTHENTICATE'}
                </button>
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="text-gray-600 text-xs uppercase tracking-widest">or connect with</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[{ name: 'Google', icon: '🌐' }, { name: 'Apple', icon: '🍎' }].map(p => (
                    <button key={p.name} type="button"
                      className="flex items-center justify-center gap-2 border border-gray-800 text-gray-400 py-3.5 rounded-xl text-sm font-black hover:border-yellow-400 hover:text-yellow-400 transition"
                      style={{ backgroundColor: '#1a1a00' }}>
                      {p.icon} {p.name.toUpperCase()}
                    </button>
                  ))}
                </div>
                <p className="text-center text-gray-600 text-xs mt-6">
                  By proceeding, you agree to our{' '}
                  <span className="text-yellow-400 cursor-pointer hover:underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-yellow-400 cursor-pointer hover:underline">Privacy Policy</span>
                </p>
              </form>
            )}

            {/* ── SIGN UP ── */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} noValidate>
                <h2 className="text-white font-black text-3xl uppercase mb-1">Join The Collective</h2>
                <p className="text-gray-500 text-sm mb-6">Create your 57 Arts & Customs account.</p>
                <div className="space-y-4">

                  {/* Name */}
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Full Name</label>
                    <input type="text" value={signupForm.name}
                      onChange={e => { setSignupForm({ ...signupForm, name: e.target.value }); setError(''); }}
                      placeholder="Your full name"
                      className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none border border-gray-800 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#1a1a00' }} />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Email Address</label>
                    <input type="email" value={signupForm.email}
                      onChange={e => { setSignupForm({ ...signupForm, email: e.target.value }); setError(''); }}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none border border-gray-800 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#1a1a00' }} />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">I Am A...</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'buyer',  label: '🛍 Buyer',  desc: 'Shop & order'  },
                        { value: 'vendor', label: '🏪 Vendor', desc: 'Sell my craft' },
                      ].map(role => (
                        <button key={role.value} type="button"
                          onClick={() => setSignupForm({ ...signupForm, role: role.value })}
                          className={`p-3 rounded-xl border-2 text-left transition ${
                            signupForm.role === role.value
                              ? 'border-yellow-400 bg-yellow-400 bg-opacity-10'
                              : 'border-gray-800 hover:border-gray-600'
                          }`}
                          style={{ backgroundColor: '#1a1a00' }}>
                          <p className="text-white text-sm font-black">{role.label}</p>
                          <p className="text-gray-500 text-xs">{role.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={signupForm.password}
                        onChange={e => { setSignupForm({ ...signupForm, password: e.target.value }); setError(''); }}
                        placeholder="Create a strong password"
                        className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none border border-gray-800 focus:border-yellow-400 transition placeholder-gray-700 pr-16"
                        style={{ backgroundColor: '#1a1a00' }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-yellow-400 text-xs font-black transition">
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {signupForm.password && (
                      <div className="mt-3">
                        <div className="flex gap-1 mb-2">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                              i <= strength.score ? sl.bar : 'bg-gray-800'
                            }`} />
                          ))}
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className={`text-xs font-black ${sl.text}`}>{sl.label}</span>
                          <span className="text-gray-600 text-xs">{strength.score}/5 met</span>
                        </div>
                        <div className="space-y-1">
                          {strength.rules.map(r => (
                            <div key={r.label} className="flex items-center gap-2">
                              <span className={`text-xs flex-shrink-0 ${r.pass ? 'text-green-400' : 'text-gray-700'}`}>
                                {r.pass ? '✓' : '○'}
                              </span>
                              <span className={`text-xs ${r.pass ? 'text-gray-400' : 'text-gray-700'}`}>
                                {r.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirm ? 'text' : 'password'} value={signupForm.confirm}
                        onChange={e => { setSignupForm({ ...signupForm, confirm: e.target.value }); setError(''); }}
                        placeholder="Repeat your password"
                        className={`w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 pr-16 ${
                          signupForm.confirm && signupForm.password !== signupForm.confirm
                            ? 'border-red-500'
                            : signupForm.confirm && signupForm.password === signupForm.confirm
                            ? 'border-green-500'
                            : 'border-gray-800 focus:border-yellow-400'
                        }`}
                        style={{ backgroundColor: '#1a1a00' }} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-yellow-400 text-xs font-black transition">
                        {showConfirm ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                    {signupForm.confirm && signupForm.password !== signupForm.confirm && (
                      <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                    )}
                    {signupForm.confirm && signupForm.password === signupForm.confirm && (
                      <p className="text-green-400 text-xs mt-1">✓ Passwords match</p>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full mt-6 bg-yellow-400 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition disabled:opacity-60">
                  {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
                </button>
                <p className="text-center text-gray-600 text-xs mt-4">
                  By proceeding, you agree to our{' '}
                  <span className="text-yellow-400 cursor-pointer hover:underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-yellow-400 cursor-pointer hover:underline">Privacy Policy</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── PROFILE (logged in) ───────────────────────────────────
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a1500' }}>

      {/* ── EDIT PROFILE MODAL ───────────────────────────── */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="rounded-2xl border border-gray-800 w-full max-w-lg"
            style={{ backgroundColor: '#1a1a00' }}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <h3 className="text-white font-black text-lg uppercase">Edit Profile</h3>
              <button onClick={() => setEditOpen(false)}
                className="text-gray-500 hover:text-white transition text-xl">✕</button>
            </div>

            {/* Section tabs */}
            <div className="flex border-b border-gray-800">
              {[
                { key: 'contact',  label: 'Contact'  },
                { key: 'address',  label: 'Address'  },
                { key: 'password', label: 'Password' },
              ].map(s => (
                <button key={s.key} onClick={() => setEditSection(s.key)}
                  className={`flex-1 py-3.5 font-black text-xs uppercase tracking-widest border-b-2 -mb-px transition ${
                    editSection === s.key
                      ? 'text-yellow-400 border-yellow-400'
                      : 'text-gray-600 border-transparent hover:text-white'
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="p-6">

              {/* Contact section */}
              {editSection === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Full Name</label>
                    <input type="text" value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Email Address</label>
                    <input type="email" value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Phone Number</label>
                    <input type="text" value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                  <button onClick={saveEdit}
                    className="w-full bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition mt-2">
                    {editSaved ? '✓ Saved!' : 'Save Contact Details'}
                  </button>
                </div>
              )}

              {/* Address section */}
              {editSection === 'address' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Street Address</label>
                    <input type="text" value={editForm.street}
                      onChange={e => setEditForm({ ...editForm, street: e.target.value })}
                      placeholder="123 Artisan Way"
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">City & Postcode</label>
                    <input type="text" value={editForm.city}
                      onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                      placeholder="Nairobi, 00100"
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700"
                      style={{ backgroundColor: '#2a2000' }} />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">Country</label>
                    <select value={editForm.country}
                      onChange={e => setEditForm({ ...editForm, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition"
                      style={{ backgroundColor: '#2a2000' }}>
                      <option value="">Select country...</option>
                      {['Kenya','Nigeria','Ghana','South Africa','Uganda','Tanzania',
                        'Ethiopia','Rwanda','United Kingdom','United States',
                        'Canada','Germany','France','Netherlands','Australia'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={saveEdit}
                    className="w-full bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition mt-2">
                    {editSaved ? '✓ Saved!' : 'Save Address'}
                  </button>
                </div>
              )}

              {/* Password section */}
              {editSection === 'password' && (
                <div className="space-y-4">
                  {pwError && (
                    <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 text-xs px-4 py-3 rounded-xl">
                      {pwError}
                    </div>
                  )}

                  {/* Current password */}
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPwFields.current ? 'text' : 'password'}
                        value={pwForm.current}
                        onChange={e => { setPwForm({ ...pwForm, current: e.target.value }); setPwError(''); }}
                        placeholder="••••••••••"
                        className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700 pr-16"
                        style={{ backgroundColor: '#2a2000' }} />
                      <button type="button"
                        onClick={() => setShowPwFields(p => ({ ...p, current: !p.current }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-yellow-400 text-xs font-black transition">
                        {showPwFields.current ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPwFields.new ? 'text' : 'password'}
                        value={pwForm.newPw}
                        onChange={e => { setPwForm({ ...pwForm, newPw: e.target.value }); setPwError(''); }}
                        placeholder="Create a new strong password"
                        className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none border border-gray-700 focus:border-yellow-400 transition placeholder-gray-700 pr-16"
                        style={{ backgroundColor: '#2a2000' }} />
                      <button type="button"
                        onClick={() => setShowPwFields(p => ({ ...p, new: !p.new }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-yellow-400 text-xs font-black transition">
                        {showPwFields.new ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>

                    {/* New pw strength */}
                    {pwForm.newPw && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1.5">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                              i <= newPwStrength.score ? newPwMeta.bar : 'bg-gray-800'
                            }`} />
                          ))}
                        </div>
                        <span className={`text-xs font-black ${newPwMeta.text}`}>
                          {newPwMeta.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm new password */}
                  <div>
                    <label className="text-gray-500 text-xs font-black uppercase tracking-widest block mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPwFields.confirm ? 'text' : 'password'}
                        value={pwForm.confirm}
                        onChange={e => { setPwForm({ ...pwForm, confirm: e.target.value }); setPwError(''); }}
                        placeholder="Repeat new password"
                        className={`w-full px-4 py-3 rounded-xl text-white text-sm outline-none border transition placeholder-gray-700 pr-16 ${
                          pwForm.confirm && pwForm.newPw !== pwForm.confirm
                            ? 'border-red-500'
                            : pwForm.confirm && pwForm.newPw === pwForm.confirm
                            ? 'border-green-500'
                            : 'border-gray-700 focus:border-yellow-400'
                        }`}
                        style={{ backgroundColor: '#2a2000' }} />
                      <button type="button"
                        onClick={() => setShowPwFields(p => ({ ...p, confirm: !p.confirm }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-yellow-400 text-xs font-black transition">
                        {showPwFields.confirm ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                    {pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                      <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                    )}
                    {pwForm.confirm && pwForm.newPw === pwForm.confirm && (
                      <p className="text-green-400 text-xs mt-1">✓ Passwords match</p>
                    )}
                  </div>

                  <button onClick={savePassword}
                    className="w-full bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-500 transition mt-2">
                    {pwSaved ? '✓ Password Updated!' : 'Update Password'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ backgroundColor: '#1a1a00' }} className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center font-black text-black text-lg">
                {user.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-white font-black text-lg">{user.name}</h1>
                <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full">{user.tier}</span>
                <span className="border border-yellow-700 text-yellow-600 text-xs font-black px-2 py-0.5 rounded-full">{user.badge}</span>
              </div>
              <p className="text-gray-500 text-xs">{user.email} · {user.since}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={openEdit}
              className="border border-gray-700 text-gray-300 px-4 py-2 rounded-xl font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition">
              Edit Profile
            </button>
            <button onClick={handleLogout}
              className="border border-red-800 text-red-400 px-4 py-2 rounded-xl font-black text-xs hover:bg-red-500 hover:bg-opacity-20 transition">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { value: user.stats.orders,   label: 'Total Orders'   },
            { value: user.stats.designs,  label: 'Active Designs' },
            { value: user.stats.wishlist, label: 'Wishlist Items'  },
            { value: user.stats.drafts,   label: 'Draft Requests'  },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl p-5 border border-gray-800 text-center"
              style={{ backgroundColor: '#1a1a00' }}>
              <p className="text-yellow-400 font-black text-3xl">{stat.value}</p>
              <p className="text-gray-600 text-xs uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-1 border-b border-gray-800 mb-6">
          {[
            { key: 'personal', label: 'Personal Info'  },
            { key: 'orders',   label: 'Order History'  },
            { key: 'designs',  label: 'Saved Designs'  },
            { key: 'wishlist', label: 'Wishlist'        },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 font-black text-xs uppercase tracking-widest transition border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'text-yellow-400 border-yellow-400'
                  : 'text-gray-600 border-transparent hover:text-white'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* PERSONAL INFO */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-2xl p-6 border border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
              <p className="text-gray-600 text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                <span>👤</span> Contact Details
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Full Name',     value: user.name              },
                  { label: 'Email Address', value: user.email             },
                  { label: 'Phone Number',  value: user.phone || '—'      },
                  { label: 'Account Type',  value: user.badge             },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-gray-700 text-xs uppercase tracking-widest mb-1">{f.label}</p>
                    <p className="text-white text-sm">{f.value}</p>
                  </div>
                ))}
              </div>
              <button onClick={openEdit}
                className="mt-5 text-yellow-400 text-xs font-black hover:underline">
                Edit Contact Details →
              </button>
            </div>
            <div className="rounded-2xl p-6 border border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
              <p className="text-gray-600 text-xs font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                <span>📍</span> Shipping Address
              </p>
              {user.address?.street ? (
                <div className="space-y-1 mb-5">
                  <p className="text-white text-sm">{user.address.street}</p>
                  <p className="text-gray-400 text-sm">{user.address.city}</p>
                  <p className="text-gray-400 text-sm">{user.address.country}</p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm mb-5 italic">No address added yet.</p>
              )}
              <button onClick={() => { openEdit(); setEditSection('address'); }}
                className="text-yellow-400 text-xs font-black hover:underline">
                {user.address?.street ? 'Change Address →' : 'Add Address →'}
              </button>
            </div>
          </div>
        )}

        {/* ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {user.orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-700 p-16 text-center"
                style={{ backgroundColor: '#1a1a00' }}>
                <p className="text-gray-500 text-sm mb-4">No orders yet.</p>
                <Link to="/shop"
                  className="bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                  Start Shopping →
                </Link>
              </div>
            ) : user.orders.map(order => (
              <div key={order.id}
                className="rounded-2xl p-4 border border-gray-800 flex items-center gap-4"
                style={{ backgroundColor: '#1a1a00' }}>
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={order.img} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`${statusColors[order.status] || 'bg-gray-500'} text-white text-xs font-black px-2 py-0.5 rounded-full`}>
                      {order.status}
                    </span>
                    <span className="text-gray-600 text-xs">{order.id}</span>
                  </div>
                  <p className="text-white font-black text-sm truncate">{order.name}</p>
                  <p className="text-gray-600 text-xs">{order.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-yellow-400 font-black">{order.price}</p>
                  <div className="flex gap-2 mt-1.5">
                    <button onClick={() => navigate('/order-tracking')}
                      className="text-xs border border-gray-700 text-gray-400 px-3 py-1 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition font-black">
                      Track
                    </button>
                    <button className="text-xs bg-yellow-400 text-black px-3 py-1 rounded-lg hover:bg-yellow-500 transition font-black">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SAVED DESIGNS */}
        {activeTab === 'designs' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-gray-500 text-sm">Your saved custom design requests</p>
              <Link to="/custom-order"
                className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-black text-xs hover:bg-yellow-500 transition">
                + New Request
              </Link>
            </div>
            {user.savedDesigns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-700 p-16 text-center"
                style={{ backgroundColor: '#1a1a00' }}>
                <p className="text-gray-500 text-sm mb-4">No saved designs yet.</p>
                <Link to="/custom-order"
                  className="bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                  Start a Custom Order →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {user.savedDesigns.map(design => (
                  <div key={design.name}
                    className="rounded-2xl overflow-hidden border border-gray-800 group cursor-pointer"
                    style={{ backgroundColor: '#1a1a00' }}>
                    <div className="h-40 overflow-hidden">
                      <img src={design.img} alt={design.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                    <div className="p-4">
                      <p className="text-white font-black text-sm">{design.name}</p>
                      <p className="text-yellow-600 text-xs mt-1 uppercase tracking-wide">{design.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            {user.wishlist.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-700 p-16 text-center"
                style={{ backgroundColor: '#1a1a00' }}>
                <p className="text-gray-500 text-sm mb-4">Your wishlist is empty.</p>
                <Link to="/shop"
                  className="bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-500 transition">
                  Browse Products →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {user.wishlist.map(item => (
                  <div key={item.name}
                    className="rounded-2xl overflow-hidden border border-gray-800 group cursor-pointer"
                    style={{ backgroundColor: '#1a1a00' }}>
                    <div className="h-44 overflow-hidden relative">
                      <img src={item.img} alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <button className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center text-red-400 hover:bg-opacity-80 transition">
                        ♥
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-white font-black text-sm">{item.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-yellow-400 font-black">{item.price}</p>
                        <button className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-lg hover:bg-yellow-500 transition">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0d0d00' }} className="border-t border-yellow-900 px-8 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-black w-6 h-6 rounded flex items-center justify-center text-xs font-black">57</span>
            <span className="text-white font-black text-sm">57 ARTS & CUSTOMS</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/shop"         className="hover:text-yellow-400 transition">Shop</Link>
            <Link to="/custom-order" className="hover:text-yellow-400 transition">Custom Orders</Link>
            <Link to="/about"        className="hover:text-yellow-400 transition">About</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2024 57 Arts & Customs.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserProfile;