import React from 'react';
import { Globe, Key, Calendar, Activity, MoreVertical, Trash2, Edit, ExternalLink } from 'lucide-react';
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': 
        return {
          color: 'bg-emerald-500',
          text: 'text-emerald-700',
          bg: 'bg-emerald-50',
          label: 'Active'
        };
      case 'inactive': 
        return {
          color: 'bg-slate-400',
          text: 'text-slate-700',
          bg: 'bg-slate-50',
          label: 'Inactive'
        };
      default: 
        return {
          color: 'bg-slate-400',
          text: 'text-slate-700',
          bg: 'bg-slate-50',
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.text} ${statusConfig.bg}`}>
          <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
          {statusConfig.label}
        </div>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-slate-100">
              <ExternalLink className="w-2.5 h-2.5 text-slate-600" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{project.name}</h3>
            <p className="text-sm text-slate-600 font-medium">{project.url}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-10 overflow-hidden">
              <button
                onClick={() => {
                  onEdit(project);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-3 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Project
              </button>
              <button
                onClick={() => {
                  onDelete(project);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Project
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">API Key</span>
          </div>
          <code className="text-xs font-mono text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
            {project.api_key.substring(0, 8)}...
          </code>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Created</span>
          </div>
          <span className="text-sm text-slate-700 font-medium">
            {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </span>
        </div>

        {project.last_ping && (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-600">Last Ping</span>
            </div>
            <span className="text-sm text-slate-700 font-medium">
              {formatDistanceToNow(new Date(project.last_ping), { addSuffix: true })}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={() => onSelect(project)}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
      >
        Open Dashboard
      </button>
    </div>
  );
};