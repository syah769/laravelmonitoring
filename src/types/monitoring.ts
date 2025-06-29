export interface SystemMetrics {
  id?: string;
  project_id: string;
  timestamp: string;
  memory_usage: number;
  cpu_usage: number;
  disk_usage: number;
  active_users: number;
  response_time: number;
}

export interface ErrorLog {
  id: string;
  project_id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'critical';
  message: string;
  file: string;
  line: number;
  trace: string;
  user_id?: string;
  ip_address: string;
  user_agent: string;
  request_url: string;
  request_method: string;
}

export interface PerformanceMetric {
  id?: string;
  project_id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  response_time: number;
  memory_peak: number;
  status_code: number;
}

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  last_error: string | null;
  total_errors_today: number;
  avg_response_time: number;
}

export interface Project {
  id: string;
  name: string;
  url: string;
  api_key: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
  last_ping?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}