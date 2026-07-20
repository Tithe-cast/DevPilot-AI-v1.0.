import React, { useState } from 'react';
import { ArrowLeft, Save, FolderGit2, AlertCircle } from 'lucide-react';

interface AddProjectProps {
  token: string | null;
  setPage: (page: string, projectId?: string | null) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const AddProject: React.FC<AddProjectProps> = ({ token, setPage, showToast }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Frontend development');
  const [framework, setFramework] = useState('React.js');
  const [language, setLanguage] = useState('TypeScript');
  const [repoUrl, setRepoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'Active' | 'Planning'>('Active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !category || !framework || !language) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name, description, category, framework, language, repoUrl, imageUrl, status
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create project');

      showToast('Project initialized successfully!', 'success');
      setPage('projects');
    } catch (err: any) {
      setError(err.message || 'Server error');
      showToast(err.message || 'Failed to initialize project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Frontend development',
    'Backend development',
    'Full Stack app',
    'Mobile development',
    'CLI Tool',
    'AI / Machine Learning'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Back button */}
      <button 
        onClick={() => setPage('projects')}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Create New Project</h1>
        <p className="text-sm text-gray-400">Initialize a code context to anchor your AI reviews and chats.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3 items-center text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-neutral-border space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Name *</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stripe Webhook billing server"
              className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description *</label>
            <textarea 
              rows={3} required value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this module does, its key sub-systems, etc."
              className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category *</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Framework / Library *</label>
            <input 
              type="text" required value={framework} onChange={(e) => setFramework(e.target.value)}
              placeholder="e.g. Express.js, Next.js, FastAPI"
              className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Programming Language *</label>
            <input 
              type="text" required value={language} onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. TypeScript, Python, Go"
              className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Initial Status *</label>
            <select 
              value={status} onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
            >
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Repository URL (Optional)</label>
            <input 
              type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/sarahdev/billing-gateway"
              className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Image URL (Optional)</label>
            <input 
              type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600"
              className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full py-4 bg-brand-primary text-neutral-darkBg font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Initializing Context...' : 'Save and Initialize'}
        </button>
      </form>
    </div>
  );
};
