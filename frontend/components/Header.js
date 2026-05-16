import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaHeart,
  FaStore,
  FaShieldAlt,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/products', label: 'المنتجات' },
  { href: '/brands', label: 'العلامات' },
  { href: '/categories', label: 'التصنيفات' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();

  const isActive = (href) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border/80 bg-white/90 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <FaStore className="text-sm" />
          </span>
          <span className="hidden sm:inline">ShopHub</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium ${
                isActive('/admin') ? 'bg-amber-50 text-amber-800' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <FaShieldAlt className="text-xs" /> لوحة الإدارة
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/wishlist"
                className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100"
                aria-label="المفضلة"
              >
                <FaHeart />
              </Link>
              <Link
                href="/cart"
                className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100"
                aria-label="السلة"
              >
                <FaShoppingCart />
              </Link>
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 sm:flex"
              >
                <FaUser className="text-brand-600" />
                {user?.firstName || 'حسابي'}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden sm:inline-flex">
                دخول
              </Link>
              <Link href="/register" className="btn-primary hidden sm:inline-flex">
                تسجيل
              </Link>
            </>
          )}

          <button
            type="button"
            className="rounded-xl p-2.5 text-slate-700 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="القائمة"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-surface-border bg-white px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-amber-800" onClick={() => setOpen(false)}>
              لوحة الإدارة
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link href="/wishlist" className="block rounded-lg px-3 py-2.5 text-sm" onClick={() => setOpen(false)}>المفضلة</Link>
              <Link href="/cart" className="block rounded-lg px-3 py-2.5 text-sm" onClick={() => setOpen(false)}>السلة</Link>
              <Link href="/profile" className="block rounded-lg px-3 py-2.5 text-sm" onClick={() => setOpen(false)}>حسابي</Link>
              <button
                type="button"
                className="mt-2 w-full rounded-lg px-3 py-2.5 text-start text-sm text-red-600"
                onClick={() => { logout(); setOpen(false); router.push('/login'); }}
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block rounded-lg px-3 py-2.5 text-sm" onClick={() => setOpen(false)}>دخول</Link>
              <Link href="/register" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-600" onClick={() => setOpen(false)}>تسجيل</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
