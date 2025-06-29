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
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Recent Errors
        </h2>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {errors.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No errors found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {errors.map((error) => (
              <div key={error.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium border ${getLevelColor(error.level)}`}>
                    <div className="flex items-center gap-1">
                      {getLevelIcon(error.level)}
                      {error.level.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium truncate">{error.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
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