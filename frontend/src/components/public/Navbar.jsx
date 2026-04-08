import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Showroom', to: '/' },
    { label: 'Jual Motor', to: '/jual-motor' },
    { label: 'Saran', to: '/saran' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl shadow-2xl shadow-orange-900/20">
      <div className="flex justify-between items-center px-8 py-4 max-w-full">
        <Link to="/" className="text-2xl font-black italic text-orange-500 tracking-tighter">
          Bagong Jaya Motor
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 tracking-tight">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                location.pathname === link.to
                  ? 'text-orange-500 font-bold border-b-2 border-orange-500 pb-1'
                  : 'text-slate-300 hover:text-white transition-colors font-medium'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="hidden lg:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-orange-500 transition-all">
            <span className="material-symbols-outlined text-slate-400 mr-2 text-sm">search</span>
            <input
              className="bg-transparent border-none focus:outline-none text-sm w-48 text-white placeholder-slate-500"
              placeholder="Cari unit..."
              type="text"
            />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl px-8 pt-2 pb-6 flex flex-col gap-4 border-t border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={
                location.pathname === link.to
                  ? 'text-orange-500 font-bold'
                  : 'text-slate-300 hover:text-white transition-colors font-medium'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
