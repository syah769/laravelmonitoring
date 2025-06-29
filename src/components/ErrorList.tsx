import React from 'react';
import { AlertTriangle, Clock, User, Globe } from 'lucide-react';
import { ErrorLog } from '../types/monitoring';
import { formatDistanceToNow } from 'date-fns';

interface ErrorListProps {
  errors: ErrorLog[];
}

export const ErrorList: React.FC<ErrorListProps> = ({ errors }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-900 text-red-200 border-red-700';
      case 'error': return 'bg-red-900/50 text-red-300 border-red-800';
      case 'warning': return 'bg-yellow-900/50 text-yellow-300 border-yellow-800';
      default: return 'bg-blue-900/50 text-blue-300 border-blue-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical':
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Recent Errors
        </h2>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {errors.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No errors found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {errors.map((error) => (
              <div key={error.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${getLevelColor(error.level)}`}>
                    <div className="flex items-center gap-1">
                      {getLevelIcon(error.level)}
                      {error.level.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{error.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(error.timestamp), { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {error.request_method} {error.request_url}
                      </span>
                      {error.user_id && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          User {error.user_id}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {error.file}:{error.line}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};