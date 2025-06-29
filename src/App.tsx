import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { SignUpForm } from './components/Auth/SignUpForm';
import { ProjectList } from './components/Projects/ProjectList';
import { DashboardHeader } from './components/Dashboard/DashboardHeader';
import { MetricCard } from './components/MetricCard';
import { ErrorList } from './components/ErrorList';
import { PerformanceChart } from './components/PerformanceChart';
import { SystemStatus } from './components/SystemStatus';
import { useMonitoring } from './hooks/useMonitoring';
import { Project } from './types/monitoring';
import { Activity, Server, MemoryStick as Memory, Users, Clock } from 'lucide-react';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const { metrics, errors, systemStatus, loading: monitoringLoading } = useMonitoring(
    selectedProject?.id
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {isSignUp ? (
          <SignUpForm onToggleMode={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onToggleMode={() => setIsSignUp(true)} />
        )}
      </div>
    );
  }

  if (!selectedProject) {
    return <ProjectList onSelectProject={setSelectedProject} />;
  }

  if (monitoringLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader project={selectedProject} onBack={() => setSelectedProject(null)} />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-900 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading monitoring data...</p>
          </div>
        </div>
      </div>
    );
  }

  const latestMetrics = metrics[metrics.length - 1];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <DashboardHeader project={selectedProject} onBack={() => setSelectedProject(null)} />
      
      <div className="container mx-auto px-4 py-8">
        {/* System Status */}
        <div className="mb-8">
          <SystemStatus status={systemStatus} />
        </div>

        {/* Metrics Cards */}
        {latestMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Memory Usage"
              value={`${latestMetrics.memory_usage.toFixed(1)}%`}
              change="+2.3%"
              changeType="negative"
              icon={Memory}
              color="bg-blue-500"
            />
            <MetricCard
              title="CPU Usage"
              value={`${latestMetrics.cpu_usage.toFixed(1)}%`}
              change="-1.2%"
              changeType="positive"
              icon={Activity}
              color="bg-green-500"
            />
            <MetricCard
              title="Active Users"
              value={latestMetrics.active_users || 0}
              change="+12"
              changeType="positive"
              icon={Users}
              color="bg-purple-500"
            />
            <MetricCard
              title="Response Time"
              value={`${latestMetrics.response_time.toFixed(0)}ms`}
              change="+15ms"
              changeType="negative"
              icon={Clock}
              color="bg-orange-500"
            />
          </div>
        )}

        {/* Charts */}
        {metrics.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PerformanceChart
                data={metrics}
                title="Memory Usage"
                dataKey="memory_usage"
                color="#3B82F6"
                unit="%"
              />
              <PerformanceChart
                data={metrics}
                title="Response Time"
                dataKey="response_time"
                color="#10B981"
                unit="ms"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PerformanceChart
                data={metrics}
                title="CPU Usage"
                dataKey="cpu_usage"
                color="#F59E0B"
                unit="%"
              />
              <PerformanceChart
                data={metrics}
                title="Active Users"
                dataKey="active_users"
                color="#8B5CF6"
              />
            </div>
          </>
        )}

        {/* Error List */}
        <ErrorList errors={errors} />

        {/* No Data State */}
        {metrics.length === 0 && errors.length === 0 && (
          <div className="text-center py-12">
            <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No monitoring data yet</h3>
            <p className="text-gray-500 mb-6">
              Install the monitoring package in your Laravel application to start collecting data.
            </p>
            <div className="bg-white rounded-lg p-4 max-w-2xl mx-auto border border-gray-200 shadow-sm">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Quick Setup:</h4>
              <div className="text-left space-y-2">
                <p className="text-gray-700">1. Install the package in your Laravel app:</p>
                <code className="block bg-gray-100 text-green-600 p-2 rounded text-sm border">
                  composer require your-package/laravel-monitor
                </code>
                <p className="text-gray-700">2. Add your API key to .env:</p>
                <code className="block bg-gray-100 text-green-600 p-2 rounded text-sm border">
                  PRODUCTION_MONITOR_API_KEY={selectedProject.api_key}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;