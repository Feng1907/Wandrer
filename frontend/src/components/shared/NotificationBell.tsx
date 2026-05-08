'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

interface Notification {
  type: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function NotificationBell() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  useSocket((data: Notification) => {
    setNotifications((prev) => [{ ...data, createdAt: new Date().toISOString() }, ...prev.slice(0, 19)]);
    setUnread((n) => n + 1);
  });

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (open) setUnread(0); }}
        className="relative rounded-lg p-2 hover:bg-neutral-100 text-neutral-600"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-40 w-80 rounded-2xl border border-neutral-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <span className="font-semibold text-neutral-900">Thông báo</span>
              {notifications.length > 0 && (
                <button onClick={() => setNotifications([])} className="text-xs text-neutral-400 hover:text-neutral-600">Xóa tất cả</button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-neutral-400">Chưa có thông báo nào</div>
              ) : notifications.map((n, i) => (
                <div key={i} className={cn('border-b border-neutral-50 px-4 py-3 last:border-0', i === 0 && 'bg-blue-50/50')}>
                  <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-500 line-clamp-2">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
