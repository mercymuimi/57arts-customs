import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ backgroundColor: '#1a1a00' }}
      className="text-white px-8 py-4 flex justify-between items-center border-b border-yellow-900">
      <Link to="/" className="flex items-center gap-2">
        <span className="bg-yellow-400 text-black w-8 h-8 rounded flex items-center justify-center text-xs font-black">
          57
        </span>
        <span className="text-white font-black tracking-wide text-sm">
          57 ARTS <span className="text-yellow-400">&</span> CUSTOMS
        </span>
      </Link>
      <div className="hidden md:flex gap-8 items-center text-sm">
        <Link to="/fashion" className="text-gray-300 hover:text-yellow-400 transition">Fashion</Link>
        <Link to="/furniture" className="text-gray-300 hover:text-yellow-400 transition">Furniture</Link>
        <Link to="/beads" className="text-gray-300 hover:text-yellow-400 transition">Beads</Link>
        <Link to="/custom-order" className="text-gray-300 hover:text-yellow-400 transition">Custom Orders</Link>
        <Link to="/about" className="text-gray-300 hover:text-yellow-400 transition">About</Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="bg-transparent text-white text-sm focus:outline-none w-24 placeholder-gray-600"
          />
        </div>
        <Link to="/shop">
          <button className="text-gray-300 hover:text-yellow-400 transition text-xl">🛒</button>
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-yellow-400 text-sm hidden md:block">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-400 hover:text-black transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="text-gray-300 hover:text-yellow-400 transition text-xl">👤</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;