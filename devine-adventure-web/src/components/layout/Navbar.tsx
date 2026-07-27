'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-stone-950/95 backdrop-blur-md border-b border-stone-800 py-3'
          : 'py-6',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/devine-icon.png"
            alt=""
            width={512}
            height={512}
            className="w-10 h-10"
            priority
          />
          <span className="font-display font-black text-xl leading-none">
            <span className="text-white">Devine</span>{' '}
            <span className="text-[#29692f]">Adventures</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === href
                  ? 'text-amber-400'
                  : 'text-stone-300 hover:text-white',
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="text-xs text-amber-400 border border-amber-400/30 px-3 py-1.5 rounded-full hover:bg-amber-400/10"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-stone-300 hover:text-white text-sm transition-colors"
              >
                <User className="w-4 h-4" />
                {user?.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 text-sm"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-stone-300 hover:text-white text-sm"
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

        {/* Mobile toggle */}
        <button
          className="md:hidden text-stone-300"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-stone-950 border-t border-stone-800 px-6 py-6 space-y-4">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-stone-300 hover:text-white"
            >
              {label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div className="pt-4 flex flex-col gap-3 border-t border-stone-800">
              <Link href="/login" className="text-stone-300">
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
            <div className="pt-4 border-t border-stone-800">
              <Link href="/dashboard" className="block text-stone-300 mb-3">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-stone-400 text-sm">
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
