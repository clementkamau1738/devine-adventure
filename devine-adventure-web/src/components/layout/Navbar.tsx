'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { Logo } from '@/components/layout/Logo';

const navLinks = [
  { label: 'Adventures', href: '/events' },
  { label: 'Calendar', href: '/events/calendar' },
  { label: 'Membership', href: '/membership' },
  { label: 'About', href: '/about' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  /** Phase A: light chrome on homepage only (pairs with light hero). */
  const light = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    clearAuth();
    router.push('/');
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        light
          ? scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3 shadow-sm'
            : 'bg-neutral-50 py-5'
          : scrolled
            ? 'bg-stone-950/95 backdrop-blur-md border-b border-stone-800 py-3'
            : 'py-6',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Logo priority theme={light ? 'light' : 'dark'} height={44} />

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === href
                  ? 'text-forest'
                  : light
                    ? 'text-neutral-600 hover:text-ink'
                    : 'text-stone-300 hover:text-white',
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-xs text-forest border border-forest/30 px-3 py-1.5 rounded-full hover:bg-forest/10"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className={cn(
                  'flex items-center gap-2 text-sm transition-colors',
                  light
                    ? 'text-neutral-600 hover:text-ink'
                    : 'text-stone-300 hover:text-white',
                )}
              >
                <User className="w-4 h-4" />
                {user?.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className={cn(
                  'flex items-center gap-1.5 text-sm',
                  light
                    ? 'text-neutral-500 hover:text-ink'
                    : 'text-stone-400 hover:text-stone-200',
                )}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  'text-sm',
                  light
                    ? 'text-neutral-600 hover:text-ink'
                    : 'text-stone-300 hover:text-white',
                )}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-forest text-neutral-50 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-forest-hover transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className={cn(
            'md:hidden',
            light ? 'text-ink' : 'text-stone-300',
          )}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div
          className={cn(
            'md:hidden border-t px-6 py-6 space-y-4',
            light
              ? 'bg-white border-neutral-200'
              : 'bg-stone-950 border-stone-800',
          )}
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'block',
                light
                  ? 'text-neutral-700 hover:text-ink'
                  : 'text-stone-300 hover:text-white',
              )}
            >
              {label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div
              className={cn(
                'pt-4 flex flex-col gap-3 border-t',
                light ? 'border-neutral-200' : 'border-stone-800',
              )}
            >
              <Link
                href="/login"
                className={light ? 'text-neutral-700' : 'text-stone-300'}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-forest text-neutral-50 font-semibold px-5 py-3 rounded-full text-center"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div
              className={cn(
                'pt-4 border-t',
                light ? 'border-neutral-200' : 'border-stone-800',
              )}
            >
              <Link
                href="/dashboard"
                className={cn(
                  'block mb-3',
                  light ? 'text-neutral-700' : 'text-stone-300',
                )}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className={cn(
                  'text-sm',
                  light ? 'text-neutral-500' : 'text-stone-400',
                )}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
