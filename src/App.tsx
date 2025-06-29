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
import { Activity, Server, MemoryStick as Memory, Users, Clock, TrendingUp } from 'lucide-react';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const { metrics, errors, systemStatus, loading: monitoringLoading } = useMonitoring(
    selectedProject?.id
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-slate-600 font-medium">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
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
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader project={selectedProject} onBack={() => setSelectedProject(null)} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            </div>
            <p className="text-slate-600 font-medium">Loading Analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const latestMetrics = metrics[metrics.length - 1];

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader project={selectedProject} onBack={() => setSelectedProject(null)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              color="from-blue-500 to-blue-600"
              trend="up"
            />
            <MetricCard
              title="CPU Usage"
              value={`${latestMetrics.cpu_usage.toFixed(1)}%`}
              change="-1.2%"
              changeType="positive"
              icon={Activity}
              color="from-emerald-500 to-emerald-600"
              trend="down"
            />
            <MetricCard
              title="Active Users"
              value={latestMetrics.active_users || 0}
              change="+12"
              changeType="positive"
              icon={Users}
              color="from-violet-500 to-violet-600"
              trend="up"
            />
            <MetricCard
              title="Response Time"
              value={`${latestMetrics.response_time.toFixed(0)}ms`}
              change="+15ms"
              changeType="negative"
              icon={Clock}
              color="from-amber-500 to-amber-600"
              trend="up"
            />
          </div>
        )}

        {/* Charts */}
        {metrics.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <PerformanceChart
                data={metrics}
                title="Memory Usage"
                dataKey="memory_usage"
                color="#3B82F6"
                unit="%"
                gradient="from-blue-500/20 to-blue-500/5"
              />
              <PerformanceChart
                data={metrics}
                title="Response Time"
                dataKey="response_time"
                color="#10B981"
                unit="ms"
                gradient="from-emerald-500/20 to-emerald-500/5"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <PerformanceChart
                data={metrics}
                title="CPU Usage"
                dataKey="cpu_usage"
                color="#F59E0B"
                unit="%"
                gradient="from-amber-500/20 to-amber-500/5"
              />
              <PerformanceChart
                data={metrics}
                title="Active Users"
                dataKey="active_users"
                color="#8B5CF6"
                gradient="from-violet-500/20 to-violet-500/5"
              />
            </div>
          </>
        )}

        {/* Error List */}
        <ErrorList errors={errors} />

        {/* No Data State */}
        {metrics.length === 0 && errors.length === 0 && (
          <div className="text-center py-16">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Server className="w-12 h-12 text-slate-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to Monitor</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              Install our monitoring package in your Laravel application to start collecting real-time performance data and error logs.
            </p>
            <div className="bg-white rounded-2xl p-8 max-w-3xl mx-auto border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-900">Quick Integration</h4>
              </div>
              <div className="space-y-6 text-left">
                <div>
                  <p className="text-slate-700 font-medium mb-3">Install the monitoring package:</p>
                  <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm">
                    <code className="text-emerald-400">composer require your-package/laravel-monitor</code>
                  </div>
                </div>
                <div>
                  <p className="text-slate-700 font-medium mb-3">Add your API key to .env:</p>
                  <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm">
                    <code className="text-blue-400">PRODUCTION_MONITOR_API_KEY=</code>
                    <code className="text-amber-400">{selectedProject.api_key}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;