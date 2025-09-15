'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseAuth } from './useSupabaseAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useRealTime = () => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { user, isAuthenticated } = useSupabaseAuth();
  const subscriptionsRef = useRef<Map<string, (...args: unknown[]) => void>>(new Map());

  // Cleanup function
  const cleanup = useCallback(() => {
    if (channel) {
      supabase.removeChannel(channel);
      setChannel(null);
    }
    subscriptionsRef.current.clear();
    setIsConnected(false);
    setConnectionError(null);
  }, [channel]);



  useEffect(() => {
    if (!isAuthenticated || !user?.tenantId) {
      cleanup();
      return;
    }

    try {
      // Create channel for tenant-specific real-time updates
      const channelName = `tenant_${user.tenantId}`;
      const newChannel = supabase.channel(channelName);

      // Subscribe to the channel
      newChannel
        .on('broadcast', { event: '*' }, (payload) => {
          // Handle broadcast messages from backend
          const { event, payload: data } = payload;
          const callback = subscriptionsRef.current.get(event);
          if (callback) {
            callback(data);
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Connected to Supabase Realtime');
            setIsConnected(true);
            setConnectionError(null);
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Supabase Realtime connection error');
            setConnectionError('Failed to connect to real-time service');
            setIsConnected(false);
          } else if (status === 'TIMED_OUT') {
            console.error('Supabase Realtime connection timed out');
            setConnectionError('Connection timed out');
            setIsConnected(false);
          }
        });

      setChannel(newChannel);
    } catch (error) {
      console.error('Error setting up Supabase Realtime:', error);
      setConnectionError('Failed to initialize real-time connection');
    }

    return cleanup;
  }, [isAuthenticated, user?.tenantId, cleanup]);

  const subscribe = useCallback(
    (event: string, callback: (...args: unknown[]) => void) => {
      if (!channel || !isConnected) {
        console.warn(`Cannot subscribe to '${event}': channel not connected`);
        return () => {};
      }

      // Store the callback for this event
      subscriptionsRef.current.set(event, callback);

      // Return an unsubscribe function
      return () => {
        subscriptionsRef.current.delete(event);
      };
    },
    [channel, isConnected]
  );

  const emit = useCallback(
    (event: string, data?: unknown) => {
      if (!channel || !isConnected) {
        console.warn(`Cannot emit '${event}': channel not connected`);
        return false;
      }
      
      // Send broadcast message
      channel.send({
        type: 'broadcast',
        event: event,
        payload: data
      });
      return true;
    },
    [channel, isConnected]
  );

  return { 
    channel, 
    subscribe, 
    emit, 
    isConnected, 
    connectionError
  };
};
