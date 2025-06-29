import { createClient } from '@supabase/supabase-js';

// Debug: Log environment variables
console.log('Environment variables debug:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('All env vars:', import.meta.env);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('supabaseUrl:', supabaseUrl);
  console.error('supabaseAnonKey:', supabaseAnonKey);
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          url: string;
          api_key: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          status: 'active' | 'inactive';
          last_ping: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          url: string;
          api_key: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          status?: 'active' | 'inactive';
          last_ping?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          url?: string;
          api_key?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          status?: 'active' | 'inactive';
          last_ping?: string | null;
        };
      };
      system_metrics: {
        Row: {
          id: string;
          project_id: string;
          timestamp: string;
          memory_usage: number;
          cpu_usage: number;
          disk_usage: number;
          active_users: number;
          response_time: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          timestamp: string;
          memory_usage: number;
          cpu_usage: number;
          disk_usage: number;
          active_users: number;
          response_time: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          timestamp?: string;
          memory_usage?: number;
          cpu_usage?: number;
          disk_usage?: number;
          active_users?: number;
          response_time?: number;
          created_at?: string;
        };
      };
      error_logs: {
        Row: {
          id: string;
          project_id: string;
          timestamp: string;
          level: 'error' | 'warning' | 'info' | 'critical';
          message: string;
          file: string;
          line: number;
          trace: string;
          user_id: string | null;
          ip_address: string;
          user_agent: string;
          request_url: string;
          request_method: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          timestamp: string;
          level: 'error' | 'warning' | 'info' | 'critical';
          message: string;
          file: string;
          line: number;
          trace: string;
          user_id?: string | null;
          ip_address: string;
          user_agent: string;
          request_url: string;
          request_method: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          timestamp?: string;
          level?: 'error' | 'warning' | 'info' | 'critical';
          message?: string;
          file?: string;
          line?: number;
          trace?: string;
          user_id?: string | null;
          ip_address?: string;
          user_agent?: string;
          request_url?: string;
          request_method?: string;
          created_at?: string;
        };
      };
    };
  };
};