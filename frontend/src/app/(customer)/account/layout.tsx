'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/account', label: 'Tài khoản', icon: User },
  { href: '/account/bookings', label: 'Đặt tour', icon: ShoppingBag },
  { href: '/account/wishlist', label: 'Yêu thích', icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex gap-8">
        <aside className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                  pathname === href ? 'bg-blue-50 text-blue-700' : 'text-neutral-600 hover:bg-neutral-100',
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
