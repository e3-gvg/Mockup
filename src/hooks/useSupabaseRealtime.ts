'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabaseAuth } from './useSupabaseAuth';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface SensorData {
  id: string;
  machineId: string;
  sensorType: string;
  value: number;
  unit: string;
  timestamp: string;
  machine?: {
    id: string;
    name: string;
    type: string;
    location: string;
  };
}

interface Alert {
  id: string;
  machineId: string;
  tenantId: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  createdAt: string;
  machine?: {
    id: string;
    name: string;
    type: string;
    location: string;
  };
}

interface Machine {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'ERROR';
  mqttTopic: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseRealtimeOptions {
  enableSensorData?: boolean;
  enableAlerts?: boolean;
  enableMachines?: boolean;
  machineIds?: string[];
}

interface UseRealtimeReturn {
  sensorData: SensorData[];
  alerts: Alert[];
  machines: Machine[];
  isConnected: boolean;
  connectionStatus: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastUpdate: Date | null;
  subscribe: () => void;
  unsubscribe: () => void;
  acknowledgeAlert: (alertId: string) => Promise<void>;
}

export const useSupabaseRealtime = (options: UseRealtimeOptions = {}): UseRealtimeReturn => {
  const {
    enableSensorData = true,
    enableAlerts = true,
    enableMachines = true,
    machineIds = []
  } = options;

  const { user, session } = useSupabaseAuth();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR'>('DISCONNECTED');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const isSubscribedRef = useRef(false);

  // Handle sensor data changes
  const handleSensorDataChange = useCallback((payload: RealtimePostgresChangesPayload<SensorData>) => {
    console.log('Sensor data change:', payload);
    
    switch (payload.eventType) {
      case 'INSERT':
        setSensorData(prev => {
          const newData = payload.new as SensorData;
          // Keep only last 100 records per machine to prevent memory issues
          const filtered = prev.filter(item => 
            item.machineId !== newData.machineId || 
            prev.filter(p => p.machineId === newData.machineId).length < 100
          );
          return [newData, ...filtered].slice(0, 500); // Global limit of 500 records
        });
        break;
      case 'UPDATE':
        setSensorData(prev => 
          prev.map(item => 
            item.id === payload.new.id ? { ...item, ...payload.new } : item
          )
        );
        break;
      case 'DELETE':
        setSensorData(prev => 
          prev.filter(item => item.id !== payload.old.id)
        );
        break;
    }
    setLastUpdate(new Date());
  }, []);

  // Handle alert changes
  const handleAlertChange = useCallback((payload: RealtimePostgresChangesPayload<Alert>) => {
    console.log('Alert change:', payload);
    
    switch (payload.eventType) {
      case 'INSERT':
        setAlerts(prev => [payload.new as Alert, ...prev]);
        break;
      case 'UPDATE':
        setAlerts(prev => 
          prev.map(item => 
            item.id === payload.new.id ? { ...item, ...payload.new } : item
          )
        );
        break;
      case 'DELETE':
        setAlerts(prev => 
          prev.filter(item => item.id !== payload.old.id)
        );
        break;
    }
    setLastUpdate(new Date());
  }, []);

  // Handle machine changes
  const handleMachineChange = useCallback((payload: RealtimePostgresChangesPayload<Machine>) => {
    console.log('Machine change:', payload);
    
    switch (payload.eventType) {
      case 'INSERT':
        setMachines(prev => [payload.new as Machine, ...prev]);
        break;
      case 'UPDATE':
        setMachines(prev => 
          prev.map(item => 
            item.id === payload.new.id ? { ...item, ...payload.new } : item
          )
        );
        break;
      case 'DELETE':
        setMachines(prev => 
          prev.filter(item => item.id !== payload.old.id)
        );
        break;
    }
    setLastUpdate(new Date());
  }, []);

  // Subscribe to realtime changes
  const subscribe = useCallback(() => {
    if (!user || !session || isSubscribedRef.current) {
      return;
    }

    console.log('Subscribing to realtime changes for tenant:', user.tenantId);
    setConnectionStatus('CONNECTING');

    // Create a channel for this tenant
    const channel = supabase.channel(`tenant_${user.tenantId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Subscribe to sensor data changes
    if (enableSensorData) {
      const baseFilter = `machine.tenant_id=eq.${user.tenantId}`;
      const machineFilter = machineIds.length > 0 ? ` AND machine_id=in.(${machineIds.join(',')})` : '';
      
      channel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sensor_data',
        filter: baseFilter + machineFilter
      }, handleSensorDataChange);
    }

    // Subscribe to alert changes
    if (enableAlerts) {
      channel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alerts',
        filter: `tenant_id=eq.${user.tenantId}`
      }, handleAlertChange);
    }

    // Subscribe to machine changes
    if (enableMachines) {
      channel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'machines',
        filter: `tenant_id=eq.${user.tenantId}`
      }, handleMachineChange);
    }

    // Handle connection status
    channel.on('system', {}, (payload) => {
      console.log('Realtime system event:', payload);
      if (payload.extension === 'postgres_changes') {
        if (payload.status === 'ok') {
          setIsConnected(true);
          setConnectionStatus('CONNECTED');
        } else {
          setIsConnected(false);
          setConnectionStatus('ERROR');
        }
      }
    });

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('Realtime subscription status:', status);
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        setConnectionStatus('CONNECTED');
        isSubscribedRef.current = true;
      } else if (status === 'CHANNEL_ERROR') {
        setIsConnected(false);
        setConnectionStatus('ERROR');
        isSubscribedRef.current = false;
      } else if (status === 'TIMED_OUT') {
        setIsConnected(false);
        setConnectionStatus('ERROR');
        isSubscribedRef.current = false;
      }
    });

    channelRef.current = channel;
  }, [user, session, enableSensorData, enableAlerts, enableMachines, machineIds, handleSensorDataChange, handleAlertChange, handleMachineChange]);

  // Unsubscribe from realtime changes
  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      console.log('Unsubscribing from realtime changes');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
      setIsConnected(false);
      setConnectionStatus('DISCONNECTED');
    }
  }, []);

  // Acknowledge alert function
  const acknowledgeAlert = useCallback(async (alertId: string) => {
    if (!user || !session) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await supabase
        .from('alerts')
        .update({
          is_acknowledged: true,
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: user.id
        })
        .eq('id', alertId)
        .eq('tenant_id', user.tenantId); // Ensure tenant isolation

      if (error) {
        throw error;
      }

      console.log('Alert acknowledged:', alertId);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }, [user, session]);

  // Auto-subscribe when user is authenticated
  useEffect(() => {
    if (user && session && !isSubscribedRef.current) {
      subscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [user, session, subscribe, unsubscribe]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  // Auto-reconnect on connection loss
  useEffect(() => {
    if (connectionStatus === 'ERROR' && user && session) {
      const reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect...');
        unsubscribe();
        setTimeout(subscribe, 1000);
      }, 5000);

      return () => clearTimeout(reconnectTimer);
    }
  }, [connectionStatus, user, session, subscribe, unsubscribe]);

  return {
    sensorData,
    alerts,
    machines,
    isConnected,
    connectionStatus,
    lastUpdate,
    subscribe,
    unsubscribe,
    acknowledgeAlert
  };
};

// Hook for specific machine data
export const useMachineRealtime = (machineId: string) => {
  return useSupabaseRealtime({
    enableSensorData: true,
    enableAlerts: true,
    enableMachines: true,
    machineIds: [machineId]
  });
};

// Hook for alerts only
export const useAlertsRealtime = () => {
  return useSupabaseRealtime({
    enableSensorData: false,
    enableAlerts: true,
    enableMachines: false
  });
};

// Hook for sensor data only
export const useSensorDataRealtime = (machineIds?: string[]) => {
  return useSupabaseRealtime({
    enableSensorData: true,
    enableAlerts: false,
    enableMachines: false,
    machineIds
  });
};