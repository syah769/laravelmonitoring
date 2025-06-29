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
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-white">{project.name}</h1>
            <p className="text-sm text-gray-400">{project.url}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};