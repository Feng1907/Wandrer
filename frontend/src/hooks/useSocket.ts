'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';

export const useSocket = (onNotification?: (data: any) => void) => {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    socketRef.current.on('notification', (data) => {
      onNotification?.(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [accessToken]);

  return socketRef.current;
};
