import React from 'react';
import { Shield, ShieldAlert, ShieldX, Clock, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SystemStatus as SystemStatusType } from '../types/monitoring';

interface SystemStatusProps {
  status: SystemStatusType;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ status }) => {
  const getStatusConfig = (statusType: string) => {
    switch (statusType) {
      case 'healthy':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-600',
          bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50',
          borderColor: 'border-emerald-200',
          text: 'All Systems Operational',
          description: 'Your application is running smoothly'
        };
      case 'warning':
        return {
          icon: ShieldAlert,
          color: 'text-amber-600',
          bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50',
          borderColor: 'border-amber-200',
          text: 'Performance Warning',
          description: 'Some metrics require attention'
        };
      case 'critical':
        return {
          icon: ShieldX,
          color: 'text-red-600',
          bgColor: 'bg-gradient-to-r from-red-50 to-rose-50',
          borderColor: 'border-red-200',
          text: 'Critical Issues Detected',
          description: 'Immediate action required'
        };
      default:
        return {
          icon: Shield,
          color: 'text-slate-600',
          bgColor: 'bg-gradient-to-r from-slate-50 to-gray-50',
          borderColor: 'border-slate-200',
          text: 'Status Unknown',
          description: 'Unable to determine system status'
        };
    }
  };

  const config = getStatusConfig(status.status);
  const StatusIcon = config.icon;

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className={`rounded-2xl p-8 border ${config.bgColor} ${config.borderColor} shadow-sm`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-white shadow-sm border border-white/50`}>
            <StatusIcon className={`w-8 h-8 ${config.color}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{config.text}</h2>
            <p className="text-slate-600 mt-1">{config.description}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${config.color} bg-white/70 border border-white/50`}>
          {status.status.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Uptime</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">
            {formatUptime(status.uptime)}
          </span>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Avg Response</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">
            {status.avg_response_time}ms
          </span>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Errors Today</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">
            {status.total_errors_today}
          </span>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-violet-100">
              <Shield className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Health Score</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">
            {status.status === 'healthy' ? '98%' : status.status === 'warning' ? '75%' : '45%'}
          </span>
        </div>
      </div>
    </div>
  );
};