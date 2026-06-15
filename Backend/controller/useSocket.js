import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../utils/constant';

/**
 * Custom hook to manage Socket.io connections
 * @param {string} userId - The ID of the logged-in user
 * @returns {Object} socketRef.current instance
 */
export const useSocket = (userId) => {
  const socketRef = useRef();

  useEffect(() => {
    if (userId) {
      socketRef.current = io(API_BASE_URL, {
        query: { userId },
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        socketRef.current.emit('join-notifications', userId);
      });
    }

    return () => socketRef.current?.disconnect();
  }, [userId]);

  return socketRef.current;
};