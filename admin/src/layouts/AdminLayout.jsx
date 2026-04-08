import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { authClient } from '../services/authClient.js';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/stok', icon: 'two_wheeler', label: 'Stok Motor' },
  { to: '/transaksi', icon: 'receipt_long', label: 'Transaksi' },
  { to: '/request', icon: 'inbox', label: 'Request Pembelian' },
  { to: '/laporan', icon: 'bar_chart', label: 'Laporan Excel' },
  { to: '/saran', icon: 'forum', label: 'Saran Customer' },
  { to: '/admin', icon: 'admin_panel_settings', label: 'Kelola Admin' },
];

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch {
      // ignore sign-out errors and redirect anyway
    }
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        {!collapsed ? (
          <div>
            <div className="text-lg font-black italic text-orange-500 tracking-tighter leading-tight">Bagong Jaya</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Motor — Admin</div>
          </div>
        ) : (
          <span className="material-symbols-outlined text-orange-500 text-2xl">two_wheeler</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-orange-500/15 text-orange-500 border-l-2 border-orange-500'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl shrink-0" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${!collapsed ? '' : 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-orange-500 text-sm">person</span>
          </div>
          {!collapsed && (
            <div>
              <div className="text-white text-xs font-bold">Admin</div>
              <div className="text-slate-500 text-[10px]">Bagong Jaya Motor</div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          {!collapsed && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-slate-950 border-r border-white/5 transition-all duration-200 shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-60 flex flex-col bg-slate-950 h-full">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-900 border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden cursor-pointer text-slate-400 hover:text-white" onClick={() => setMobileOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <button className="hidden md:block cursor-pointer text-slate-400 hover:text-white transition-colors" onClick={() => setCollapsed(!collapsed)}>
              <span className="material-symbols-outlined">{collapsed ? 'menu_open' : 'menu'}</span>
            </button>
            <h1 className="text-white font-bold text-lg leading-none">
              {navItems.find((n) => n.to === location.pathname)?.label ?? 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm hidden sm:block">Halo, <span className="text-white font-semibold">Admin!</span></span>
            <button onClick={handleLogout} className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5">
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
