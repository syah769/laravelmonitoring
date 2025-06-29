import React from 'react';
import { AlertTriangle, Clock, User, Globe, AlertCircle, XCircle, Info } from 'lucide-react';
import { ErrorLog } from '../types/monitoring';
import { formatDistanceToNow } from 'date-fns';

interface ErrorListProps {
  errors: ErrorLog[];
}

export const ErrorList: React.FC<ErrorListProps> = ({ errors }) => {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'critical': 
        return {
          color: 'text-red-700 bg-red-50 border-red-200',
          icon: XCircle,
          bgColor: 'bg-red-50/50'
        };
      case 'error': 
        return {
          color: 'text-red-600 bg-red-50 border-red-200',
          icon: AlertCircle,
          bgColor: 'bg-red-50/30'
        };
      case 'warning': 
        return {
          color: 'text-amber-700 bg-amber-50 border-amber-200',
          icon: AlertTriangle,
          bgColor: 'bg-amber-50/30'
        };
      default: 
        return {
          color: 'text-blue-700 bg-blue-50 border-blue-200',
          icon: Info,
          bgColor: 'bg-blue-50/30'
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Error Monitoring</h2>
              <p className="text-sm text-slate-600 mt-1">Recent application errors and warnings</p>
            </div>
          </div>
          {errors.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full border border-red-200">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-700">{errors.length} Recent</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {errors.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Errors Detected</h3>
            <p className="text-slate-600">Your application is running smoothly without any reported errors.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {errors.map((error) => {
              const config = getLevelConfig(error.level);
              const LevelIcon = config.icon;
              
              return (
                <div key={error.id} className={`p-6 hover:${config.bgColor} transition-colors duration-200 group`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.color}`}>
                      <div className="flex items-center gap-1.5">
                        <LevelIcon className="w-3.5 h-3.5" />
                        {error.level.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 font-semibold text-lg leading-tight mb-3 group-hover:text-slate-700 transition-colors">
                        {error.message}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                            {error.request_method}
                          </span>
                          <span className="truncate">{error.request_url}</span>
                        </div>
                        {error.user_id && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span>User {error.user_id}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <p className="text-xs font-mono text-slate-600">
                          {error.file}:<span className="font-semibold text-slate-900">{error.line}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};