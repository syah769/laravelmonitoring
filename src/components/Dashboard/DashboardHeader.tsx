import React from 'react';
import { ArrowLeft, LogOut, Settings } from 'lucide-react';
import { Project } from '../../types/monitoring';
import { useAuth } from '../../hooks/useAuth';

interface DashboardHeaderProps {
  project: Project;
  onBack: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ project, onBack }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-600">{project.url}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};