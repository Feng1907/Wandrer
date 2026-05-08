'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';

interface NotificationPayload {
  type: string;
  title: string;
  message: string;
}

export const useSocket = (onNotification?: (data: NotificationPayload) => void) => {
  const socketRef = useRef<Socket | null>(null);
  const callbackRef = useRef(onNotification);
  const { accessToken } = useAuthStore();

  // Sync latest callback without reconnecting the socket
  useEffect(() => {
    callbackRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    if (!accessToken) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    socketRef.current.on('notification', (data: NotificationPayload) => {
      callbackRef.current?.(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [accessToken]);

  return socketRef;
};
