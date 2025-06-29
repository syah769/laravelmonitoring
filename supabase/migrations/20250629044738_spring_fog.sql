/*
  # Create monitoring system tables

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `url` (text)
      - `api_key` (text, unique)
      - `user_id` (uuid, foreign key to auth.users)
      - `status` (text, enum: active/inactive)
      - `last_ping` (timestamptz, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `system_metrics`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `timestamp` (timestamptz)
      - `memory_usage` (numeric)
      - `cpu_usage` (numeric)
      - `disk_usage` (numeric)
      - `active_users` (integer)
      - `response_time` (numeric)
      - `created_at` (timestamptz)
    
    - `error_logs`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `timestamp` (timestamptz)
      - `level` (text, enum: error/warning/info/critical)
      - `message` (text)
      - `file` (text)
      - `line` (integer)
      - `trace` (text)
      - `user_id` (text, nullable)
      - `ip_address` (text)
      - `user_agent` (text)
      - `request_url` (text)
      - `request_method` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add API key authentication for external Laravel apps
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  api_key text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_ping timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create system_metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz NOT NULL,
  memory_usage numeric NOT NULL DEFAULT 0,
  cpu_usage numeric NOT NULL DEFAULT 0,
  disk_usage numeric NOT NULL DEFAULT 0,
  active_users integer NOT NULL DEFAULT 0,
  response_time numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz NOT NULL,
  level text NOT NULL CHECK (level IN ('error', 'warning', 'info', 'critical')),
  message text NOT NULL,
  file text NOT NULL,
  line integer NOT NULL,
  trace text NOT NULL,
  user_id text,
  ip_address text NOT NULL,
  user_agent text NOT NULL,
  request_url text NOT NULL,
  request_method text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_api_key ON projects(api_key);
CREATE INDEX IF NOT EXISTS idx_system_metrics_project_id ON system_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_project_id ON error_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_level ON error_logs(level);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for projects table
CREATE POLICY "Users can manage their own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for system_metrics table
CREATE POLICY "Users can view metrics for their projects"
  ON system_metrics
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Create policies for error_logs table
CREATE POLICY "Users can view errors for their projects"
  ON error_logs
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();