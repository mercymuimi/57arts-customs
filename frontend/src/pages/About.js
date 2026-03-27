import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0d0d0d' }}>



      {/* HERO */}
      <div className="relative h-screen flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400"
          alt="About Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.95) 50%, rgba(13,13,13,0.3))' }}>
        </div>
        <div className="relative z-10 px-16 max-w-2xl">
          <p className="text-yellow-400 text-xs uppercase tracking-widest font-black mb-4">
            Our Origin
          </p>
          <h1 className="text-6xl font-black leading-tight mb-6">
            <span className="text-white">Tradition meets </span><br />
            <span className="text-yellow-400 italic">Technology</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            We aren't just making products; we're crafting digital legacies.
            Blending heritage craftsmanship with the cutting edge of digital design.
          </p>
        </div>
      </div>

      {/* OUR VISION */}
      <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-0.5 bg-yellow-400"></div>
            <h2 className="text-3xl font-black">Our Vision</h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            Empowering Gen Z creators with tools that bridge the gap between imagination and reality.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            In a world that's increasingly digital, we believe physical artifacts
            should hold the same weight as digital assets. We provide the canvas
            for a new generation of digital and physical artists to express their
            unique identities.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '✏', title: 'Creator First', desc: 'Tools designed for the modern auteur.' },
              { icon: '✦', title: 'Ecosystem', desc: 'A global network of custom artisans.' },
            ].map((item) => (
              <div key={item.title}
                className="rounded-xl p-4 border border-gray-800"
                style={{ backgroundColor: '#1a1a1a' }}>
                <span className="text-yellow-400 text-lg block mb-2">{item.icon}</span>
                <h4 className="text-white font-black text-sm mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Illustration */}
        <div className="rounded-2xl overflow-hidden h-96 bg-gray-100 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"
            alt="Vision"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* THE CRAFT */}
      <div className="py-20 px-8" style={{ backgroundColor: '#111' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-400 text-xs uppercase tracking-widest font-black mb-3">
              Mastery in Detail
            </p>
            <h2 className="text-5xl font-black mb-4">The Craft</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Every piece is a testament to the pursuit of perfection. Bespoke artisanal
              quality that honors time-tested techniques while embracing modern precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Heritage',
                desc: 'Decades of manual mastery preserved in every stitch.',
                img: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500',
              },
              {
                title: 'Precision',
                desc: 'Micron-level accuracy powered by custom industrial tech.',
                img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
              },
              {
                title: 'Uniqueness',
                desc: 'No two pieces are alike. Each holds its own digital DNA.',
                img: 'https://images.unsplash.com/photo-1493106819501-8f9e5ce02e5d?w=500',
              },
            ].map((item) => (
              <div key={item.title}
                className="rounded-2xl overflow-hidden group cursor-pointer border border-gray-800 hover:border-yellow-400 transition">
                <div className="h-56 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5" style={{ backgroundColor: '#1a1a1a' }}>
                  <h3 className="text-white font-black text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THE FUTURE */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Left Card */}
          <div className="rounded-2xl p-10 border border-yellow-900"
            style={{ backgroundColor: '#1a1500' }}>
            <span className="text-yellow-400 text-3xl block mb-6">💡</span>
            <h2 className="text-4xl font-black mb-4">The Future</h2>
            <p className="text-gray-300 text-sm italic leading-relaxed mb-4">
              "Design is no longer static. It is a living dialogue between creator and machine."
            </p>
            <p className="text-yellow-600 text-sm leading-relaxed mb-8">
              We are developing AI-driven personalization engines that analyze your digital
              footprint to suggest aesthetic enhancements that are truly, uniquely yours.
              Your story, translated into matter through intelligence.
            </p>
            <button className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded-lg font-black text-sm hover:bg-yellow-400 hover:text-black transition">
              Pre-order Beta Access
            </button>
          </div>

          {/* Right - Phone Mockup */}
          <div className="flex justify-center">
            <div className="rounded-3xl border-2 border-gray-700 p-4 w-56"
              style={{ backgroundColor: '#1a1a2e' }}>
              <div className="h-2 w-16 bg-gray-700 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-yellow-400 rounded-lg mb-3"></div>
              <div className="h-4 w-20 bg-gray-700 rounded mb-4"></div>
              <div className="h-24 bg-gray-800 rounded-xl flex items-center justify-center mb-3">
                <span className="text-gray-600 text-2xl">🖼</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-12 bg-gray-800 rounded-lg"></div>
                <div className="h-12 bg-gray-800 rounded-lg"></div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-700 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#080808' }}
        className="border-t border-gray-800 px-8 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div className="max-w-xs">
            <h3 className="text-yellow-400 font-black text-lg mb-2">57 Arts & Customs</h3>
            <p className="text-gray-500 text-sm">
              The gold standard in bespoke digital-physical synergy.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Company</h4>
              {['Journal', 'Manifesto', 'Careers'].map((item) => (
                <p key={item} className="text-gray-500 text-sm mb-2 hover:text-yellow-400 cursor-pointer transition">{item}</p>
              ))}
            </div>
            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4">Social</h4>
              {['Instagram', 'X / Twitter', 'Discord'].map((item) => (
                <p key={item} className="text-gray-500 text-sm mb-2 hover:text-yellow-400 cursor-pointer transition">{item}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-600 text-xs">
            © 2024 57 Arts & Customs. All Rights Reserved. Defined by tradition, designed by code.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default About;