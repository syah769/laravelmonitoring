import React, { useState, useEffect } from 'react';
import { X, Globe, Key, Copy, Check, ExternalLink } from 'lucide-react';
import { Project } from '../../types/monitoring';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; url: string }) => void;
  project?: Project | null;
  loading?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  loading = false
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setUrl(project.url);
    } else {
      setName('');
      setUrl('');
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, url });
  };

  const copyApiKey = async () => {
    if (project?.api_key) {
      await navigator.clipboard.writeText(project.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {project ? 'Edit Project' : 'Add New Project'}
            </h2>
            <p className="text-slate-600 mt-1">
              {project ? 'Update your project details' : 'Create a new monitoring project'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Project Name
            </label>
            <div className="relative group">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="My Laravel Application"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Application URL
            </label>
            <div className="relative group">
              <ExternalLink className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="https://myapp.com"
                required
              />
            </div>
          </div>

          {project && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                API Key
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative group">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={project.api_key}
                    readOnly
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={copyApiKey}
                  className="px-4 py-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 hover:text-slate-900 transition-all duration-200 flex items-center justify-center"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <strong>Important:</strong> Use this API key in your Laravel application's .env file
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25"
            >
              {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};