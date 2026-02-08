'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/cvs', label: 'CVs', icon: FileText },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const sidebar = (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      <div className="p-4 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
          <FileText className="w-6 h-6 text-cv-blue-400" />
          <span className="text-lg font-bold">CV Chap Chap</span>
        </Link>
        <span className="inline-block mt-1 bg-red-500 text-xs px-2 py-0.5 rounded font-medium">
          ADMIN
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="text-sm text-gray-400 truncate mb-2">{profile?.email}</div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64">
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <span className="font-semibold text-gray-900">Admin</span>
          <div className="w-6" />
        </header>

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
