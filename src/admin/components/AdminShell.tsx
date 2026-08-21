'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ClipboardList, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { adminApi } from '@/admin/lib/api';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<'checking' | 'ok' | 'anon'>('checking');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    adminApi
      .me()
      .then((res) => setAuthState(res.authenticated ? 'ok' : 'anon'))
      .catch(() => setAuthState('anon'));
  }, []);

  useEffect(() => {
    if (authState === 'anon') router.replace(`/admin/login`);
  }, [authState, router]);

  const handleLogout = async () => {
    await adminApi.logout().catch(() => {});
    router.replace('/admin/login');
  };

  if (authState !== 'ok') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-sm font-semibold text-slate-500">Loading admin portal…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#0B2559] text-white">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-[#0B2559] text-white flex items-center justify-between px-4 py-3 shadow-md">
        <span className="font-black tracking-wide">CCL Admin</span>
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60" onClick={() => setMenuOpen(false)}>
          <div className="w-72 h-full bg-[#0B2559] text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-3">
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent pathname={pathname} onLogout={handleLogout} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

function SidebarContent({
  pathname,
  onLogout,
  onNavigate,
}: {
  pathname: string;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-white/10">
        <h1 className="font-black text-lg tracking-tight">Crystal Clean</h1>
        <p className="text-xs text-sky-300 font-semibold">Admin Portal</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active ? 'bg-white/10 text-white' : 'text-sky-100/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-sky-100/80 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Website
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
