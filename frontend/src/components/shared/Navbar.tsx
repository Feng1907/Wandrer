'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Heart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-neutral-900">Wandrer</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <Link href="/tours" className="hover:text-blue-600 transition-colors">Khám phá Tour</Link>
          <Link href="/compare" className="hover:text-blue-600 transition-colors">So sánh</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/account/wishlist" className="rounded-lg p-2 hover:bg-neutral-100 text-neutral-600">
                <Heart className="h-5 w-5" />
              </Link>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {user.name[0].toUpperCase()}
                  </div>
                  {user.name.split(' ').pop()}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
                    <Link href="/account" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50">
                      <User className="h-4 w-4" /> Tài khoản
                    </Link>
                    <Link href="/account/bookings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50">
                      Lịch sử đặt tour
                    </Link>
                    {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50">
                        <LayoutDashboard className="h-4 w-4" /> Quản trị
                      </Link>
                    )}
                    <hr className="my-1 border-neutral-100" />
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Đăng nhập</Link>
              <Link href="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Đăng ký</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link href="/tours" onClick={() => setMenuOpen(false)}>Khám phá Tour</Link>
            <Link href="/compare" onClick={() => setMenuOpen(false)}>So sánh Tour</Link>
            {user ? (
              <>
                <Link href="/account" onClick={() => setMenuOpen(false)}>Tài khoản</Link>
                <Link href="/account/bookings" onClick={() => setMenuOpen(false)}>Lịch sử đặt tour</Link>
                <button onClick={handleLogout} className="text-left text-red-500">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>Đăng ký</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
