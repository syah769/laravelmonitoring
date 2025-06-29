import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SystemMetrics, ErrorLog, SystemStatus } from '../types/monitoring';
import { useAuth } from './useAuth';

export const useMonitoring = (projectId?: string) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: 'healthy',
    uptime: 0,
    last_error: null,
    total_errors_today: 0,
    avg_response_time: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    if (!user || !projectId) return;

    try {
      // Fetch last 24 hours of metrics
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .eq('project_id', projectId)
        .gte('timestamp', twentyFourHoursAgo)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchErrors = async () => {
    if (!user || !projectId) return;

    try {
      // Fetch last 50 errors
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setErrors(data || []);
    } catch (error) {
      console.error('Error fetching errors:', error);
    }
  };

  const fetchSystemStatus = async () => {
    if (!user || !projectId) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Count errors today
      const { count: errorCount } = await supabase
        .from('error_logs')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .gte('timestamp', today);

      // Get latest metrics for avg response time
      const { data: latestMetrics } = await supabase
        .from('system_metrics')
        .select('response_time')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: false })
        .limit(10);

      const avgResponseTime = latestMetrics?.length 
        ? latestMetrics.reduce((sum, m) => sum + m.response_time, 0) / latestMetrics.length
        : 0;

      // Determine status based on error count
      let status: SystemStatus['status'] = 'healthy';
      if (errorCount && errorCount > 50) status = 'critical';
      else if (errorCount && errorCount > 10) status = 'warning';

      setSystemStatus({
        status,
        uptime: 86400, // Mock uptime
        last_error: null,
        total_errors_today: errorCount || 0,
        avg_response_time: Math.round(avgResponseTime)
      });
    } catch (error) {
      console.error('Error fetching system status:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchMetrics(),
      fetchErrors(),
      fetchSystemStatus()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (projectId) {
      fetchAllData();
      
      // Set up real-time subscriptions
      const metricsSubscription = supabase
        .channel('system_metrics')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'system_metrics',
            filter: `project_id=eq.${projectId}`
          }, 
          () => fetchMetrics()
        )
        .subscribe();

      const errorsSubscription = supabase
        .channel('error_logs')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'error_logs',
            filter: `project_id=eq.${projectId}`
          }, 
          () => {
            fetchErrors();
            fetchSystemStatus();
          }
        )
        .subscribe();

      return () => {
        metricsSubscription.unsubscribe();
        errorsSubscription.unsubscribe();
      };
    }
  }, [projectId, user]);

  return {
    metrics,
    errors,
    systemStatus,
    loading,
    refetch: fetchAllData
  };
};