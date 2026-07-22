'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  User,
  Mountain,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
  { label: 'Membership', href: '/dashboard/subscription', icon: CreditCard },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login?redirect=/dashboard');
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore — clear local session regardless
    }
    clearAuth();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-stone-800">
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="w-6 h-6 text-amber-400" />
            <span className="font-display font-black text-lg text-white">
              Devine<span className="text-amber-400">.</span>
            </span>
          </Link>
        </div>

        <div className="p-4 border-b border-stone-800">
          <div className="text-white font-semibold text-sm">{user?.name}</div>
          <div className="text-stone-500 text-xs">{user?.email}</div>
          {user?.role === 'MEMBER' && (
            <span className="inline-block mt-2 bg-amber-400/10 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full">
              Member
            </span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                pathname === href
                  ? 'bg-amber-400/10 text-amber-400 font-medium'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800',
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-stone-400 hover:text-white text-sm transition-colors w-full px-3 py-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">{children}</main>
    </div>
  );
}
