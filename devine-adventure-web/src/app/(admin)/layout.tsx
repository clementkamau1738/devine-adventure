'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Events', href: '/admin/events', icon: Calendar },
  { label: 'Bookings', href: '/admin/bookings', icon: BookOpen },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Revenue', href: '/admin/revenue', icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore — clear local session regardless
    }
    clearAuth();
    router.push('/');
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-neutral-200 flex items-center gap-2">
          <Shield className="w-5 h-5 text-forest" />
          <span className="font-display font-normal text-ink uppercase tracking-normal">
            Admin<span className="text-forest">.</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                pathname === href
                  ? 'bg-forest/10 text-forest font-medium'
                  : 'text-neutral-500 hover:text-ink hover:bg-neutral-100',
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <Link
            href="/"
            className="block text-neutral-500 hover:text-ink text-sm px-3 py-2 mb-1"
          >
            ← Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-neutral-500 hover:text-ink text-sm px-3 py-2 w-full"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
