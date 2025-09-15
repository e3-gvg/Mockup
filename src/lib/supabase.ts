import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Only warn about missing environment variables in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn('Missing Supabase environment variables - using placeholder values');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          subdomain: string;
          plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
          maxUsers: number;
          maxMachines: number;
          isActive: boolean;
          billingEmail: string | null;
          contactPhone: string | null;
          timezone: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          subdomain: string;
          plan?: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
          maxUsers?: number;
          maxMachines?: number;
          isActive?: boolean;
          billingEmail?: string | null;
          contactPhone?: string | null;
          timezone?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subdomain?: string;
          plan?: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
          maxUsers?: number;
          maxMachines?: number;
          isActive?: boolean;
          billingEmail?: string | null;
          contactPhone?: string | null;
          timezone?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      users: {
        Row: {
          id: string;
          tenantId: string;
          email: string;
          password: string;
          firstName: string;
          lastName: string;
          role: 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER';
          isActive: boolean;
          lastLogin: string | null;
          loginAttempts: number;
          lockedUntil: string | null;
          emailVerified: boolean;
          emailVerificationToken: string | null;
          passwordResetToken: string | null;
          passwordResetExpires: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      machines: {
        Row: {
          id: string;
          tenantId: string;
          name: string;
          type: string;
          location: string;
          description: string | null;
          mqttTopic: string;
          opcuaEndpoint: string | null;
          isActive: boolean;
          isOnline: boolean;
          lastCommunication: string | null;
          lastHeartbeat: string | null;
          configuration: Record<string, unknown>;
          metadata: Record<string, unknown> | null;
          serialNumber: string | null;
          firmwareVersion: string | null;
          ipAddress: string | null;
          createdAt: string;
          updatedAt: string;
        };
      };
      sensor_data: {
        Row: {
          id: string;
          tenantId: string;
          machineId: string;
          sensorType: string;
          sensorName: string;
          value: number;
          unit: string;
          quality: number | null;
          metadata: Record<string, unknown> | null;
          timestamp: string;
          createdAt: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          tenantId: string;
          machineId: string;
          type: 'ERROR' | 'WARNING' | 'INFO' | 'MAINTENANCE';
          severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
          title: string;
          description: string;
          value: number | null;
          threshold: number | null;
          unit: string | null;
          sensorType: string | null;
          isAcknowledged: boolean;
          acknowledgedBy: string | null;
          acknowledgedAt: string | null;
          resolvedAt: string | null;
          autoResolved: boolean;
          escalationLevel: number;
          notificationsSent: number;
          metadata: Record<string, unknown> | null;
          createdAt: string;
          updatedAt: string;
        };
      };
    };
  };
};