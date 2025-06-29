import React from 'react';
import { Globe, Key, Calendar, Activity, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Project } from '../../types/monitoring';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200 group shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.url}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
              <button
                onClick={() => {
                  onEdit(project);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
              >
                <Edit className="w-4 h-4" />
                Edit Project
              </button>
              <button
                onClick={() => {
                  onDelete(project);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-red-600 hover:text-red-700 hover:bg-gray-50 flex items-center gap-2 rounded-b-lg"
              >
                <Trash2 className="w-4 h-4" />
                Delete Project
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
            <span className="text-sm text-gray-900 capitalize">{project.status}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">API Key</span>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-gray-400" />
            <code className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
              {project.api_key.substring(0, 8)}...
            </code>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Created</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>

        {project.last_ping && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last Ping</span>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">
                {formatDistanceToNow(new Date(project.last_ping), { addSuffix: true })}
              </span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onSelect(project)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        View Dashboard
      </button>
    </div>
  );
};