import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, Search, Filter, ArrowUpDown, Plus, 
  Trash2, Edit, ExternalLink, Calendar, Code2, RefreshCw
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  framework: string;
  language: string;
  repoUrl?: string;
  status: 'Active' | 'Archived' | 'Planning';
  createdAt: string;
}

interface ProjectsProps {
  token: string | null;
  setPage: (page: string, projectId?: string | null) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const Projects: React.FC<ProjectsProps> = ({ token, setPage, showToast }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProjects(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to retrieve projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      showToast('Project deleted successfully', 'success');
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete project', 'error');
    }
  };

  useEffect(() => {
    if (token) fetchProjects();
  }, [token]);

  // Extract frameworks list for filters
  const frameworks = ['All', ...Array.from(new Set(projects.map(p => p.framework)))];

  // Filtering & Sorting logic
  const filteredProjects = projects
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      const matchesFramework = frameworkFilter === 'All' || p.framework === frameworkFilter;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesFramework && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Unique styling helper for cover gradient based on project name
  const getCoverGradient = (name: string) => {
    const gradients = [
      'from-cyan-500/20 to-indigo-500/20 border-cyan-500/30',
      'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
      'from-amber-500/20 to-orange-500/20 border-amber-500/30'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return gradients[sum % gradients.length];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20';
      case 'Planning':
        return 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Projects</h1>
          <p className="text-sm text-gray-400">Create, edit, and audit software projects inside DevPilot.</p>
        </div>
        <button 
          onClick={() => setPage('add-project')}
          className="px-5 py-3 rounded-xl bg-brand-primary text-neutral-darkBg font-bold text-sm shadow neon-shadow flex items-center gap-2 hover:scale-[1.01] transition-transform"
        >
          <Plus className="w-4.5 h-4.5" />
          Create Project
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between border border-neutral-border">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary placeholder-gray-500"
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap gap-4 items-center justify-end w-full md:w-auto">
          {/* Framework Filter */}
          <div className="flex items-center gap-1.5 bg-neutral-darkBg px-3 py-1.5 rounded-xl border border-neutral-border text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select 
              value={frameworkFilter}
              onChange={(e) => setFrameworkFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Frameworks</option>
              {frameworks.filter(f => f !== 'All').map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-neutral-darkBg px-3 py-1.5 rounded-xl border border-neutral-border text-xs">
            <FolderGit2 className="w-3.5 h-3.5 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Sorter */}
          <button 
            onClick={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}
            className="flex items-center gap-1.5 bg-neutral-darkBg px-3 py-2.5 rounded-xl border border-neutral-border text-xs text-gray-300 hover:text-white transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-primary" />
            Sort by: <span className="text-white font-semibold">{sortBy === 'date' ? 'Latest' : 'Alphabetical'}</span>
          </button>
        </div>
      </div>

      {/* Project Card Grid */}
      {loading ? (
        // Skeleton loader
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl h-80 animate-pulse border border-neutral-border flex flex-col justify-between p-6">
              <div className="h-28 bg-neutral-border/30 rounded-xl"></div>
              <div className="space-y-3">
                <div className="h-4 bg-neutral-border/40 rounded w-2/3"></div>
                <div className="h-3 bg-neutral-border/30 rounded w-full"></div>
                <div className="h-3 bg-neutral-border/30 rounded w-5/6"></div>
              </div>
              <div className="h-10 bg-neutral-border/40 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-border rounded-3xl space-y-4 max-w-md mx-auto">
          <FolderGit2 className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="font-bold text-white text-lg">No Projects Found</h3>
          <p className="text-sm text-gray-400">Try adjusting your filters, or create a brand new developer project.</p>
          <button 
            onClick={() => setPage('add-project')}
            className="px-4 py-2 bg-brand-primary text-neutral-darkBg rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((p) => (
            <div 
              key={p.id}
              onClick={() => setPage('project-details', p.id)}
              className="glass-panel rounded-2xl border border-neutral-border flex flex-col justify-between overflow-hidden cursor-pointer hover:translate-y-[-2px] transition-all hover:border-brand-primary/20 group"
            >
              {/* Cover Gradient/Mockup */}
              <div className={`h-24 bg-gradient-to-tr ${getCoverGradient(p.name)} border-b flex items-center justify-center relative p-4`}>
                <Code2 className="w-8 h-8 text-white opacity-40 group-hover:scale-105 transition-transform" />
                <span className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full ${getStatusBadge(p.status)} font-semibold`}>
                  {p.status}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors text-lg truncate" title={p.name}>
                    {p.name}
                  </h3>
                  <span className="text-[10px] text-brand-primary font-semibold uppercase tracking-wider block mt-1">{p.category}</span>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Meta items */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-neutral-border/50 pt-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-brand-secondary" />
                      {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-darkBg border border-neutral-border text-gray-400 font-mono">
                      {p.framework}
                    </span>
                  </div>

                  {/* Actions footer */}
                  <div className="flex justify-between items-center gap-2 pt-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPage('project-details', p.id); }}
                      className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-neutral-darkBg transition-all"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPage('edit-project', p.id); }}
                      className="p-2 bg-neutral-cardBg border border-neutral-border text-gray-400 hover:text-white rounded-lg transition-colors"
                      title="Edit settings"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(p.id, p.name, e)}
                      className="p-2 bg-neutral-cardBg border border-neutral-border text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
