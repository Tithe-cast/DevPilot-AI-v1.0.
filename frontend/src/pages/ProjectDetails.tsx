import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, Code, Settings, Link, Trash2,
  Cpu, Sparkles, BookOpen, AlertCircle, RefreshCw, FolderGit2, CheckCircle2
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  framework: string;
  language: string;
  repoUrl?: string;
  imageUrl?: string;
  status: 'Active' | 'Archived' | 'Planning';
  createdAt: string;
}

interface ProjectDetailsProps {
  token: string | null;
  projectId: string | null;
  setPage: (page: string, projectId?: string | null) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ 
  token, 
  projectId, 
  setPage, 
  showToast 
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommending, setRecommending] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [readmes, setReadmes] = useState<any[]>([]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // 1. Fetch project profile
      const response = await fetch(`/api/projects/${projectId}`, { headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProject(data);

      // 2. Fetch full history to extract linked recommend and readmes (only if logged in)
      if (token) {
        const histResponse = await fetch('/api/ai/history', { headers });
        const histData = await histResponse.json();
        
        // Filter recommendations linked to this project
        const matchedRec = histData.recommendations?.find((r: any) => r.projectId === projectId);
        if (matchedRec) setRecommendation(matchedRec.recommendation);

        // Filter readmes linked to this project by matching the project name
        const matchedReadmes = histData.readmeDocuments?.filter(
          (doc: any) => doc.projectName.toLowerCase() === data.name.toLowerCase()
        ) || [];
        setReadmes(matchedReadmes);
      }

    } catch (err: any) {
      showToast(err.message || 'Failed to retrieve project details', 'error');
      setPage(token ? 'projects' : 'home');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    setRecommending(true);
    try {
      const response = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ projectId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setRecommendation(data.recommendation);
      showToast('Architecture blueprint generated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Recommendation failed', 'error');
    } finally {
      setRecommending(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchProjectDetails();
  }, [token, projectId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Loading project context...</p>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setPage('projects')}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to projects
        </button>
        <button 
          onClick={() => setPage('edit-project', project.id)}
          className="px-4 py-2 bg-neutral-cardBg border border-neutral-border text-gray-300 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-brand-primary" /> Settings
        </button>
      </div>

      {/* Project Banner Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {project.imageUrl && (
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <img src={project.imageUrl} alt="" className="w-full h-full object-cover filter blur-sm" />
          </div>
        )}
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-semibold uppercase tracking-wider">
              {project.category}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-darkBg text-gray-400 border border-neutral-border font-mono">
              {project.framework}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
              {project.status}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{project.name}</h1>
          <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">{project.description}</p>
          
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-brand-secondary" />
              Created {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Code className="w-4 h-4 text-brand-primary" />
              Language: <span className="text-white font-mono">{project.language}</span>
            </span>
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-primary hover:underline">
                <Link className="w-3.5 h-3.5" /> Repository Link
              </a>
            )}
          </div>
        </div>

        {/* Workspace Quick CTA */}
        {token && (
          <div className="p-5 rounded-2xl bg-neutral-darkBg border border-neutral-border text-center flex flex-col items-center gap-3 max-w-xs">
            <Sparkles className="w-6 h-6 text-brand-secondary" />
            <p className="text-xs text-gray-400">Launch AI workspace anchors automatically to this project.</p>
            <button 
              onClick={() => setPage('workspace')}
              className="w-full py-2.5 bg-brand-primary text-neutral-darkBg font-bold text-xs rounded-xl shadow hover:opacity-90 transition-opacity"
            >
              Launch AI Tools
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Insights & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-border space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brand-primary" />
                <h3 className="text-lg font-bold text-white">AI Architecture Insights</h3>
              </div>
              {token && !recommendation && (
                <button 
                  onClick={handleGenerateRecommendations}
                  disabled={recommending}
                  className="px-4 py-2 bg-brand-primary text-neutral-darkBg text-xs font-bold rounded-xl shadow neon-shadow hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {recommending ? 'Generating...' : 'Analyze Stack'}
                </button>
              )}
            </div>

            {recommendation ? (
              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Folder Structure</h4>
                  <pre className="p-4 rounded-xl bg-neutral-darkBg border border-neutral-border text-xs font-mono text-brand-primary leading-relaxed overflow-x-auto">
                    {recommendation.folderStructure}
                  </pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-darkBg/50 border border-neutral-border">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold mb-1">Recommended Packages</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {recommendation.packages?.map((pkg: string) => (
                        <span key={pkg} className="px-2 py-0.5 rounded bg-neutral-border text-xs text-white font-mono">{pkg}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-darkBg/50 border border-neutral-border">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold mb-1">Auth Configuration</span>
                    <p className="text-xs font-bold text-white mt-1.5">{recommendation.authLibrary}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-darkBg/50 border border-neutral-border">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold mb-1">Database suggestion</span>
                    <p className="text-xs text-gray-300 leading-relaxed mt-1.5">{recommendation.database}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-darkBg/50 border border-neutral-border">
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold mb-1">Deployment recommendations</span>
                    <p className="text-xs text-gray-300 leading-relaxed mt-1.5">{recommendation.deployment}</p>
                  </div>
                </div>

                <div className="border-t border-neutral-border pt-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">Architecture Guidelines</span>
                  <p className="text-xs text-gray-400 leading-relaxed">{recommendation.architectureTips}</p>
                </div>

                {token && (
                  <button 
                    onClick={handleGenerateRecommendations}
                    disabled={recommending}
                    className="py-2.5 px-4 bg-neutral-cardBg border border-neutral-border text-gray-300 rounded-xl text-xs hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-brand-primary ${recommending ? 'animate-spin' : ''}`} />
                    Regenerate recommendations
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3 bg-neutral-darkBg/40 border border-dashed border-neutral-border rounded-2xl">
                <Cpu className="w-10 h-10 text-gray-500 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No Recommendations Generated Yet</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">Click "Analyze Stack" above. The AI Architect will generate project structures, deployment blueprints, and dependency guidelines.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Documents */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-neutral-border space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-accent" />
              <h3 className="font-bold text-white text-base">Generated READMEs</h3>
            </div>
            
            {readmes.length === 0 ? (
              <div className="text-center py-8 bg-neutral-darkBg/40 border border-dashed border-neutral-border rounded-xl">
                <p className="text-xs text-gray-400">No README files generated for this project name.</p>
                <button 
                  onClick={() => setPage('workspace')}
                  className="text-xs text-brand-primary mt-2 hover:underline inline-flex items-center gap-1"
                >
                  Go to README Generator &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {readmes.map((doc) => (
                  <div key={doc.id} className="p-3.5 bg-neutral-darkBg border border-neutral-border rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{doc.projectName} README</h4>
                      <span className="text-[9px] text-gray-500">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                    <button 
                      onClick={() => setPage('history')}
                      className="text-[10px] text-brand-primary hover:underline font-semibold block pt-1"
                    >
                      View markdown &rarr;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
