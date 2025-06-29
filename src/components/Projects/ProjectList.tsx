import React, { useState } from 'react';
import { Plus, Search, FolderOpen, Sparkles } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { Project } from '../../types/monitoring';

interface ProjectListProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject }) => {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = async (data: { name: string; url: string }) => {
    setModalLoading(true);
    const result = await createProject(data.name, data.url);
    setModalLoading(false);
    
    if (!result.error) {
      setShowModal(false);
    }
  };

  const handleUpdateProject = async (data: { name: string; url: string }) => {
    if (!editingProject) return;
    
    setModalLoading(true);
    const result = await updateProject(editingProject.id, data);
    setModalLoading(false);
    
    if (!result.error) {
      setShowModal(false);
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      await deleteProject(project.id);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-600/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Project Dashboard</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Monitor and manage your Laravel applications from a centralized, professional dashboard
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Search projects..."
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center gap-3 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
          >
            <Plus className="w-5 h-5" />
            Add New Project
          </button>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="w-24 h-24 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg border border-slate-200">
                <FolderOpen className="w-12 h-12 text-slate-400" />
              </div>
              {projects.length === 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {projects.length === 0 ? 'Ready to Get Started?' : 'No Projects Found'}
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              {projects.length === 0 
                ? 'Create your first project to start monitoring your Laravel application with real-time analytics and error tracking.'
                : 'Try adjusting your search terms to find the projects you\'re looking for.'
              }
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 inline-flex items-center gap-3 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
              >
                <Plus className="w-5 h-5" />
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={onSelectProject}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <ProjectModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          project={editingProject}
          loading={modalLoading}
        />
      </div>
    </div>
  );
};