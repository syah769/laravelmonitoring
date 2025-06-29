import React from 'react';
import { Shield, ShieldAlert, ShieldX, Clock, Zap, AlertCircle } from 'lucide-react';
import { SystemStatus as SystemStatusType } from '../types/monitoring';

interface SystemStatusProps {
  status: SystemStatusType;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ status }) => {
  const getStatusConfig = (statusType: string) => {
    switch (statusType) {
      case 'healthy':
        return {
          icon: Shield,
          color: 'text-green-400',
          bgColor: 'bg-green-900/20',
          borderColor: 'border-green-700',
          text: 'System Healthy'
        };
      case 'warning':
        return {
          icon: ShieldAlert,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-900/20',
          borderColor: 'border-yellow-700',
          text: 'System Warning'
        };
      case 'critical':
        return {
          icon: ShieldX,
          color: 'text-red-400',
          bgColor: 'bg-red-900/20',
          borderColor: 'border-red-700',
          text: 'System Critical'
        };
      default:
        return {
          icon: Shield,
          color: 'text-gray-400',
          bgColor: 'bg-gray-900/20',
          borderColor: 'border-gray-700',
          text: 'Unknown Status'
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
    <div className={`rounded-xl p-6 border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-8 h-8 ${config.color}`} />
          <div>
            <h2 className="text-xl font-semibold text-white">{config.text}</h2>
            <p className="text-gray-400 text-sm">System monitoring dashboard</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Uptime</span>
          </div>
          <span className="text-lg font-semibold text-white">
            {formatUptime(status.uptime)}
          </span>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Avg Response</span>
          </div>
          <span className="text-lg font-semibold text-white">
            {status.avg_response_time}ms
          </span>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">Errors Today</span>
          </div>
          <span className="text-lg font-semibold text-white">
            {status.total_errors_today}
          </span>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Status</span>
          </div>
          <span className={`text-lg font-semibold ${config.color}`}>
            {status.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};