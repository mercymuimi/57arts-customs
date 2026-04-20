import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const allSuggestions = [
  { label: 'Distressed Artisanal Denim', category: 'Fashion', slug: 'distressed-artisanal-denim' },
  { label: 'Linen Riviera Set', category: 'Fashion', slug: 'linen-riviera-set' },
  { label: 'Midnight Velvet Blazer', category: 'Fashion', slug: 'midnight-velvet-blazer' },
  { label: 'Monarch Carry-all', category: 'Fashion', slug: 'monarch-carry-all' },
  { label: 'Vanguard Teak Chair', category: 'Furniture', slug: 'vanguard-teak-chair' },
  { label: 'Handcrafted Stool', category: 'Furniture', slug: 'handcrafted-stool' },
  { label: 'The Sculptor Chair', category: 'Furniture', slug: 'the-sculptor-chair' },
  { label: 'Gold-Infused Obsidian Beads', category: 'Beads', slug: 'gold-infused-obsidian-beads' },
  { label: 'Traditional Bead Set', category: 'Beads', slug: 'traditional-bead-set' },
  { label: 'Kente Bead Stack', category: 'Beads', slug: 'kente-bead-stack' },
  { label: 'Custom Orders', category: 'Page', slug: null, path: '/custom-order' },
  { label: 'Gallery', category: 'Page', slug: null, path: '/gallery' },
  { label: 'Shop All', category: 'Page', slug: null, path: '/shop' },
];

const navLinks = [
  { label: 'Home',          path: '/' },
  { label: 'Fashion',       path: '/fashion' },
  { label: 'Furniture',     path: '/furniture' },
  { label: 'Beads',         path: '/beads' },
  { label: 'Gallery',       path: '/gallery' },
  { label: 'Shop',          path: '/shop' },
  { label: 'Custom Orders', path: '/custom-order' },
  { label: 'About',         path: '/about' },
];

const HIDDEN_NAV_ROUTES = ['/fashion'];

const Navbar = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { itemCount: cartCount } = useCart();
  const { isLoggedIn, isAdmin, isVendor, isAffiliate, user, logout } = useAuth();

  const [searchQuery,       setSearchQuery]       = useState('');
  const [showSuggestions,   setShowSuggestions]   = useState(false);
  const [highlightedIndex,  setHighlightedIndex]  = useState(-1);
  const [showMobileMenu,    setShowMobileMenu]     = useState(false);
  const [searchFocused,     setSearchFocused]      = useState(false);
  const [showUserMenu,      setShowUserMenu]       = useState(false);

  const searchRef  = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setShowMobileMenu(false); }, [location]);

  const isHidden = HIDDEN_NAV_ROUTES.some(route => location.pathname.startsWith(route));
  if (isHidden) return null;

  // Hide navbar on dashboard pages (they have their own sidebar nav)
  const dashboardRoutes = ['/admin', '/vendor/dashboard', '/affiliate/dashboard'];
  if (dashboardRoutes.some(r => location.pathname.startsWith(r))) return null;

  const filtered = searchQuery.trim().length > 0
    ? allSuggestions.filter(s =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSuggestions.slice(0, 6);

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
        handleSuggestionClick(filtered[highlightedIndex]);
      } else if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    if (item.slug) navigate(`/product/${item.slug}`);
    else if (item.path) navigate(item.path);
    setSearchQuery('');
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Dashboard link based on role
  const dashboardLink = isAdmin ? '/admin'
    : isVendor    ? '/vendor/dashboard'
    : isAffiliate ? '/affiliate/dashboard'
    : '/profile';

  const dashboardLabel = isAdmin ? '⚙️ Admin Panel'
    : isVendor    ? '🏪 Vendor Dashboard'
    : isAffiliate ? '🔗 Affiliate Dashboard'
    : '👤 My Profile';

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800" style={{ backgroundColor: '#1a1a00' }}>
      <div className="px-6 h-16 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <span className="bg-yellow-400 text-black w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm group-hover:bg-yellow-500 transition">
            57
          </span>
          <span className="text-white font-black text-sm tracking-wide hidden lg:block">
            57 ARTS <span className="text-yellow-400">&</span> CUSTOMS
          </span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition whitespace-nowrap ${
                isActive(link.path) ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-white'
              }`}>
              {link.label}
            </Link>
          ))}
          {/* Admin badge in nav for admins */}
          {isAdmin && (
            <Link to="/admin"
              className="px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition whitespace-nowrap bg-yellow-400 bg-opacity-10 text-yellow-400 border border-yellow-900 ml-1">
              ⚙️ Admin
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Search */}
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
                searchFocused ? 'border-yellow-400' : 'border-gray-700 hover:border-gray-500'
              }`} style={{ backgroundColor: '#2a2000' }}>
                <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); setHighlightedIndex(-1); }}
                  onFocus={() => { setSearchFocused(true); setShowSuggestions(true); }}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search..."
                  className="bg-transparent text-white text-xs outline-none w-28 placeholder-gray-600"
                />
                {searchQuery && (
                  <button type="button" onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
                    className="text-gray-600 hover:text-white text-xs transition">✕</button>
                )}
              </div>
            </form>

            {showSuggestions && (
              <div className="absolute top-full mt-2 right-0 w-72 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl z-50" style={{ backgroundColor: '#1a1a00' }}>
                {filtered.length > 0 ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-gray-600 text-xs uppercase tracking-widest">
                        {searchQuery ? `Results for "${searchQuery}"` : 'Popular'}
                      </p>
                    </div>
                    {filtered.map((item, index) => (
                      <button key={item.label} onClick={() => handleSuggestionClick(item)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition ${
                          index === highlightedIndex ? 'bg-yellow-400 bg-opacity-10' : 'hover:bg-white hover:bg-opacity-5'
                        }`}>
                        <span className={`text-sm font-semibold ${index === highlightedIndex ? 'text-yellow-400' : 'text-white'}`}>
                          {item.label}
                        </span>
                        <span className="text-gray-600 text-xs">{item.category}</span>
                      </button>
                    ))}
                    {searchQuery && (
                      <button onClick={handleSearchSubmit}
                        className="w-full px-4 py-3 text-yellow-400 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:bg-opacity-10 transition border-t border-gray-800 text-left">
                        See all results for "{searchQuery}" →
                      </button>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-gray-500 text-sm">No results found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-gray-700 hover:border-yellow-400 transition group"
            style={{ backgroundColor: '#2a2000' }}>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-xs font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-700 hover:border-yellow-400 transition"
                style={{ backgroundColor: '#2a2000' }}>
                <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-black text-xs font-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-xs font-semibold hidden sm:block max-w-20 truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute top-full mt-2 right-0 w-52 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl z-50" style={{ backgroundColor: '#1a1a00' }}>
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-white text-sm font-black">{user?.name}</p>
                    <p className="text-gray-500 text-xs">{user?.email}</p>
                    <span className="inline-block mt-1 bg-yellow-400 bg-opacity-20 text-yellow-400 text-xs font-black px-2 py-0.5 rounded capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <div className="py-1">
                    <Link to={dashboardLink} onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5 transition">
                      {dashboardLabel}
                    </Link>
                    <Link to="/profile" onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5 transition">
                      👤 My Profile
                    </Link>
                    <Link to="/order-tracking" onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5 transition">
                      📦 My Orders
                    </Link>
                    <div className="border-t border-gray-800 mt-1 pt-1">
                      <button onClick={() => logout(navigate)}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 transition">
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"
                className="px-3 py-2 text-xs font-black text-gray-400 hover:text-white transition">
                Login
              </Link>
              <Link to="/register"
                className="px-3 py-2 rounded-xl bg-yellow-400 text-black text-xs font-black hover:bg-yellow-500 transition">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-gray-700 hover:border-yellow-400 transition"
            style={{ backgroundColor: '#2a2000' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-gray-800 px-6 py-4" style={{ backgroundColor: '#1a1a00' }}>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition ${
                  isActive(link.path)
                    ? 'bg-yellow-400 bg-opacity-10 text-yellow-400 border border-yellow-900'
                    : 'text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600'
                }`}>
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin"
                className="px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wide bg-yellow-400 bg-opacity-10 text-yellow-400 border border-yellow-900 col-span-2 text-center">
                ⚙️ Admin Panel
              </Link>
            )}
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <Link to="/cart"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-700 text-gray-300 py-3 rounded-xl font-black text-xs hover:border-yellow-400 hover:text-yellow-400 transition">
              🛒 Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            {isLoggedIn ? (
              <button onClick={() => logout(navigate)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-900 text-red-300 py-3 rounded-xl font-black text-xs hover:bg-red-800 transition">
                🚪 Logout
              </button>
            ) : (
              <Link to="/login"
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-black py-3 rounded-xl font-black text-xs hover:bg-yellow-500 transition">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;