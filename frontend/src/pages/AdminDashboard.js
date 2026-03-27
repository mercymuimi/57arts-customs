import React, { useState } from 'react';

const sideLinks = ['Dashboard', 'Vendors', 'Orders', 'Dispute Resolution', 'User Management', 'Platform Settings'];

const disputes = [
  { id: 'ORDER-45421', type: 'Non-delivery Claim', parties: 'David M. vs Julian Artisan', urgency: 'HIGH', color: 'border-red-500' },
  { id: 'ORDER-45388', type: 'Product Mismatch', parties: 'Sarah J. vs Custom Crafters', urgency: 'MEDIUM', color: 'border-yellow-500' },
];

const users = [
  { name: 'Alex Rivera', role: 'Admin', status: 'ACTIVE', avatar: 'A' },
  { name: 'John Doe', role: 'Vendor', status: 'ACTIVE', avatar: 'J' },
];

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div className="min-h-screen text-white flex" style={{ backgroundColor: '#1a1500' }}>

      {/* SIDEBAR */}
      <div className="w-52 flex-shrink-0 border-r border-gray-800 py-8 px-4"
        style={{ backgroundColor: '#0d0d00' }}>
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="bg-yellow-400 text-black w-7 h-7 rounded flex items-center justify-center text-xs font-black">57</span>
          <span className="text-white font-black text-sm">ARTS</span>
        </div>
        <p className="text-gray-600 text-xs uppercase tracking-widest px-2 mb-3">Main Menu</p>
        <div className="space-y-1 mb-6">
          {sideLinks.slice(0, 3).map((link) => (
            <button key={link} onClick={() => setActivePage(link)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                activePage === link
                  ? 'bg-yellow-400 bg-opacity-20 text-yellow-400 font-black'
                  : 'text-gray-500 hover:text-white hover:bg-white hover:bg-opacity-5'
              }`}>
              {link}
            </button>
          ))}
        </div>
        <p className="text-gray-600 text-xs uppercase tracking-widest px-2 mb-3">Management</p>
        <div className="space-y-1">
          {sideLinks.slice(3).map((link) => (
            <button key={link} onClick={() => setActivePage(link)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                activePage === link
                  ? 'bg-yellow-400 bg-opacity-20 text-yellow-400 font-black'
                  : 'text-gray-500 hover:text-white hover:bg-white hover:bg-opacity-5'
              }`}>
              {link}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black">Platform Overview</h1>
            <p className="text-gray-500 text-sm">Real-time tracking of 57 Arts & Customs business health.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-white text-lg">🔔</button>
            <button className="text-gray-400 hover:text-white text-lg">⚙</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Platform Revenue', value: '$1,245,850.00', change: '+12.5%', icon: '💰' },
            { label: 'Active Vendors', value: '342', change: '+44.2%', icon: '🏪' },
            { label: 'Total Orders', value: '12,894', change: '+48.3%', icon: '📦' },
          ].map((stat) => (
            <div key={stat.label}
              className="rounded-2xl p-6 border border-gray-800"
              style={{ backgroundColor: '#1a1a00' }}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="bg-green-900 text-green-400 text-xs font-black px-2 py-0.5 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-white font-black text-2xl">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Revenue Chart */}
          <div className="rounded-2xl p-6 border border-gray-800"
            style={{ backgroundColor: '#1a1a00' }}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-sm uppercase tracking-wide">Revenue Growth</h2>
              <select className="bg-gray-900 border border-gray-700 text-white text-xs px-2 py-1 rounded focus:outline-none">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="flex items-end gap-2 h-28">
              {[40, 65, 50, 80, 60, 90].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-yellow-400 bg-opacity-80"
                  style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between text-gray-600 text-xs mt-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>

          {/* Pending Disputes */}
          <div className="rounded-2xl p-6 border border-gray-800"
            style={{ backgroundColor: '#1a1a00' }}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-sm uppercase tracking-wide">Pending Disputes</h2>
              <button className="text-yellow-400 text-xs hover:underline">View All</button>
            </div>
            {disputes.map((d) => (
              <div key={d.id}
                className={`border-l-2 ${d.color} pl-4 mb-4 pb-4 border-b border-gray-800 last:border-b-0`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-black text-xs">{d.id}</p>
                    <p className="text-yellow-400 text-xs">{d.type}</p>
                    <p className="text-gray-500 text-xs mt-1">{d.parties}</p>
                  </div>
                  <button className="bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-lg hover:bg-yellow-500 transition">
                    Mediate Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* User Management */}
          <div className="rounded-2xl p-6 border border-gray-800"
            style={{ backgroundColor: '#1a1a00' }}>
            <h2 className="font-black text-sm uppercase tracking-wide mb-5">User Management</h2>
            {users.map((user) => (
              <div key={user.name} className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-800 last:border-0">
                <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-black">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.role}</p>
                </div>
                <span className={`text-xs font-black px-2 py-0.5 rounded ${
                  user.status === 'ACTIVE' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                }`}>
                  {user.status}
                </span>
                <button className="text-gray-500 hover:text-yellow-400 text-lg">⋮</button>
              </div>
            ))}
          </div>

          {/* Platform Settings */}
          <div className="rounded-2xl p-6 border border-gray-800"
            style={{ backgroundColor: '#1a1a00' }}>
            <h2 className="font-black text-sm uppercase tracking-wide mb-5">Platform Settings</h2>
            {[
              { label: 'Maintenance Mode', desc: 'Disable all Platform features' },
              { label: 'New Vendor Registrations', desc: 'Allow new vendors to register' },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white text-sm font-semibold">{setting.label}</p>
                  <p className="text-gray-500 text-xs">{setting.desc}</p>
                </div>
                <div className="w-10 h-5 bg-yellow-400 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;