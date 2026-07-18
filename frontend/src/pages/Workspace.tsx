import React, { useState, useEffect } from 'react';
import { 
  Code, Bug, BookOpen, Cpu, Sparkles, Copy, 
  Download, ArrowRight, RefreshCw, ClipboardCheck, AlertCircle, FileText
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  framework: string;
  language: string;
  category: string;
  description: string;
}

interface WorkspaceProps {
  token: string | null;
  projectsList: Project[];
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ token, projectsList, showToast }) => {
  const [activeTab, setActiveTab] = useState<'reviewer' | 'bug' | 'readme' | 'recommend'>('reviewer');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- 1. Code Reviewer State ---
  const [codeLanguage, setCodeLanguage] = useState('TypeScript');
  const [sourceCode, setSourceCode] = useState('');
  const [reviewOutput, setReviewOutput] = useState<any>(null);

  // --- 2. Bug Fixer State ---
  const [errorMessage, setErrorMessage] = useState('');
  const [stackTrace, setStackTrace] = useState('');
  const [bugCodeContext, setBugCodeContext] = useState('');
  const [bugOutput, setBugOutput] = useState<any>(null);

  // --- 3. README State ---
  const [readmeProjName, setReadmeProjName] = useState('');
  const [readmeDesc, setReadmeDesc] = useState('');
  const [readmeFeatures, setReadmeFeatures] = useState('');
  const [readmeInstall, setReadmeInstall] = useState('');
  const [readmeTech, setReadmeTech] = useState('');
  const [readmeOutput, setReadmeOutput] = useState('');

  // --- 4. Recommender State ---
  const [selectedProjId, setSelectedProjId] = useState('');
  const [recommendOutput, setRecommendOutput] = useState<any>(null);

  // Pre-populate README details if project is selected in the system
  useEffect(() => {
    if (projectsList.length > 0 && !selectedProjId) {
      setSelectedProjId(projectsList[0].id);
      setReadmeProjName(projectsList[0].name);
      setReadmeDesc(projectsList[0].description);
      setReadmeTech(`${projectsList[0].framework}, ${projectsList[0].language}`);
    }
  }, [projectsList]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    showToast('Download started!', 'success');
  };

  // --- Submissions ---

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceCode) return;
    setLoading(true);
    try {
      const clientKey = localStorage.getItem('devpilot_gemini_api_key') || '';
      const response = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-api-key': clientKey
        },
        body: JSON.stringify({ language: codeLanguage, sourceCode })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setReviewOutput(data.review);
      showToast('Code review analysis finished!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Review failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorMessage) return;
    setLoading(true);
    try {
      const clientKey = localStorage.getItem('devpilot_gemini_api_key') || '';
      const response = await fetch('/api/ai/bug-fix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-api-key': clientKey
        },
        body: JSON.stringify({ errorMessage, stackTrace, code: bugCodeContext })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setBugOutput(data.analysis);
      showToast('Bug diagnosed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Diagnostics failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReadmeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readmeProjName || !readmeDesc) return;
    setLoading(true);
    try {
      const clientKey = localStorage.getItem('devpilot_gemini_api_key') || '';
      const response = await fetch('/api/ai/readme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-api-key': clientKey
        },
        body: JSON.stringify({
          projectName: readmeProjName,
          description: readmeDesc,
          features: readmeFeatures,
          installation: readmeInstall,
          techStack: readmeTech
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setReadmeOutput(data.content);
      showToast('README markdown generated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjId) {
      showToast('Please select or create a project first', 'error');
      return;
    }
    setLoading(true);
    try {
      const clientKey = localStorage.getItem('devpilot_gemini_api_key') || '';
      const response = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-api-key': clientKey
        },
        body: JSON.stringify({ projectId: selectedProjId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRecommendOutput(data.recommendation);
      showToast('Architecture recommendation generated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Recommendation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Workspace</h1>
        <p className="text-sm text-gray-400">Interact with specialized development agents to accelerate coding tasks.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-neutral-border pb-px overflow-x-auto gap-2">
        <button 
          onClick={() => setActiveTab('reviewer')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === 'reviewer' ? 'border-brand-primary text-brand-primary bg-brand-primary/5' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <Code className="w-4 h-4" /> Code Reviewer
        </button>
        <button 
          onClick={() => setActiveTab('bug')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === 'bug' ? 'border-brand-secondary text-brand-secondary bg-brand-secondary/5' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <Bug className="w-4 h-4" /> Bug Fixer
        </button>
        <button 
          onClick={() => setActiveTab('readme')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === 'readme' ? 'border-brand-accent text-brand-accent bg-brand-accent/5' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <BookOpen className="w-4 h-4" /> README Generator
        </button>
        <button 
          onClick={() => setActiveTab('recommend')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === 'recommend' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          <Cpu className="w-4 h-4" /> Smart Recommender
        </button>
      </div>

      {/* Workspace container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Inputs */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-border space-y-6">
          
          {/* Tab 1: Code Reviewer */}
          {activeTab === 'reviewer' && (
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5"><Code className="w-5 h-5 text-brand-primary" /> Static Code Reviewer</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Programming Language</label>
                <input 
                  type="text" required value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)}
                  placeholder="e.g. TypeScript, JavaScript, Python"
                  className="w-full px-4 py-2.5 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Source Code</label>
                <textarea 
                  rows={10} required value={sourceCode} onChange={(e) => setSourceCode(e.target.value)}
                  placeholder="Paste your function or script here..."
                  className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl font-mono text-xs text-brand-primary focus:outline-none focus:border-brand-primary resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" disabled={loading || !sourceCode}
                className="w-full py-3.5 bg-brand-primary text-neutral-darkBg font-bold text-sm rounded-xl shadow neon-shadow flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Analyzing Code...' : 'Audit Source Code'}
              </button>
            </form>
          )}

          {/* Tab 2: Bug Fixer */}
          {activeTab === 'bug' && (
            <form onSubmit={handleBugSubmit} className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5"><Bug className="w-5 h-5 text-brand-secondary" /> Bug Fix Assistant</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Error Message *</label>
                <input 
                  type="text" required value={errorMessage} onChange={(e) => setErrorMessage(e.target.value)}
                  placeholder="e.g. Cannot read properties of undefined (reading 'map')"
                  className="w-full px-4 py-2.5 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Stack Trace (Optional)</label>
                <textarea 
                  rows={3} value={stackTrace} onChange={(e) => setStackTrace(e.target.value)}
                  placeholder="Paste stack trace details here..."
                  className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl font-mono text-xs text-gray-300 focus:outline-none focus:border-brand-primary resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Source Code Context (Optional)</label>
                <textarea 
                  rows={6} value={bugCodeContext} onChange={(e) => setBugCodeContext(e.target.value)}
                  placeholder="Paste the relevant code block causing the crash..."
                  className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl font-mono text-xs text-brand-primary focus:outline-none focus:border-brand-primary resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" disabled={loading || !errorMessage}
                className="w-full py-3.5 bg-brand-secondary text-white font-bold text-sm rounded-xl shadow flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                {loading ? 'Diagnosing Error...' : 'Diagnose Bug'}
              </button>
            </form>
          )}

          {/* Tab 3: README Generator */}
          {activeTab === 'readme' && (
            <form onSubmit={handleReadmeSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5"><BookOpen className="w-5 h-5 text-brand-accent" /> README Document Generator</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Project Name *</label>
                <input 
                  type="text" required value={readmeProjName} onChange={(e) => setReadmeProjName(e.target.value)}
                  placeholder="e.g. SaaS Billing microservice"
                  className="w-full px-4 py-2 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Overview / Description *</label>
                <textarea 
                  rows={2} required value={readmeDesc} onChange={(e) => setReadmeDesc(e.target.value)}
                  placeholder="A short summary of what this code codebase achieves..."
                  className="w-full px-4 py-2 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Key Features (Comma Separated)</label>
                <input 
                  type="text" value={readmeFeatures} onChange={(e) => setReadmeFeatures(e.target.value)}
                  placeholder="e.g. stripe billing, webhook caching, slack logs"
                  className="w-full px-4 py-2 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Installation Guide</label>
                <input 
                  type="text" value={readmeInstall} onChange={(e) => setReadmeInstall(e.target.value)}
                  placeholder="e.g. npm install, update env, npm start"
                  className="w-full px-4 py-2 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Technology Stack</label>
                <input 
                  type="text" value={readmeTech} onChange={(e) => setReadmeTech(e.target.value)}
                  placeholder="e.g. Node, Express, TypeScript, MongoDB"
                  className="w-full px-4 py-2 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <button 
                type="submit" disabled={loading || !readmeProjName || !readmeDesc}
                className="w-full py-3 bg-brand-accent text-neutral-darkBg font-bold text-sm rounded-xl shadow flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Compiling README...' : 'Generate README.md'}
              </button>
            </form>
          )}

          {/* Tab 4: Smart Recommender */}
          {activeTab === 'recommend' && (
            <form onSubmit={handleRecommendSubmit} className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5"><Cpu className="w-5 h-5 text-purple-400" /> Smart Project Recommender</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Select Target Project</label>
                <select 
                  value={selectedProjId}
                  onChange={(e) => setSelectedProjId(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  <option value="">-- Choose project context --</option>
                  {projectsList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.framework})</option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-xs text-brand-primary leading-relaxed flex gap-2.5 items-start">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>The AI Architect reviews your language stack, database, and category inputs to deliver structural boilerplate directories, security configurations, and hosting frameworks.</span>
              </div>

              <button 
                type="submit" disabled={loading || !selectedProjId}
                className="w-full py-3.5 bg-purple-500 text-white font-bold text-sm rounded-xl shadow flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Analyzing Architecture...' : 'Analyze Project Architecture'}
              </button>
            </form>
          )}

        </div>

        {/* Right Side: AI Outputs */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-border space-y-6 min-h-[500px] flex flex-col justify-between">
          
          <div className="flex-1 flex flex-col justify-start">
            
            {/* Header toolbar */}
            <div className="flex justify-between items-center border-b border-neutral-border/50 pb-4 mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">AI Output Console</span>
              {/* Copy/Download buttons if output exists */}
              <div className="flex gap-2">
                {activeTab === 'reviewer' && reviewOutput && (
                  <button 
                    onClick={() => handleCopy(JSON.stringify(reviewOutput, null, 2))}
                    className="p-2 hover:bg-neutral-border rounded-lg text-gray-400 hover:text-white transition-all"
                    title="Copy full review payload"
                  >
                    {copied ? <ClipboardCheck className="w-4 h-4 text-brand-accent" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
                {activeTab === 'bug' && bugOutput && (
                  <button 
                    onClick={() => handleCopy(JSON.stringify(bugOutput, null, 2))}
                    className="p-2 hover:bg-neutral-border rounded-lg text-gray-400 hover:text-white transition-all"
                    title="Copy bug details"
                  >
                    {copied ? <ClipboardCheck className="w-4 h-4 text-brand-accent" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
                {activeTab === 'readme' && readmeOutput && (
                  <>
                    <button 
                      onClick={() => handleCopy(readmeOutput)}
                      className="p-2 hover:bg-neutral-border rounded-lg text-gray-400 hover:text-white transition-all"
                      title="Copy README content"
                    >
                      {copied ? <ClipboardCheck className="w-4 h-4 text-brand-accent" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => handleDownloadMarkdown(`${readmeProjName.toLowerCase().replace(/\s+/g, '-')}-README.md`, readmeOutput)}
                      className="p-2 hover:bg-neutral-border rounded-lg text-gray-400 hover:text-brand-accent transition-all"
                      title="Download markdown file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                )}
                {activeTab === 'recommend' && recommendOutput && (
                  <button 
                    onClick={() => handleCopy(JSON.stringify(recommendOutput, null, 2))}
                    className="p-2 hover:bg-neutral-border rounded-lg text-gray-400 hover:text-white transition-all"
                    title="Copy configuration tree"
                  >
                    {copied ? <ClipboardCheck className="w-4 h-4 text-brand-accent" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Empty view */}
            {!loading && 
              ((activeTab === 'reviewer' && !reviewOutput) ||
               (activeTab === 'bug' && !bugOutput) ||
               (activeTab === 'readme' && !readmeOutput) ||
               (activeTab === 'recommend' && !recommendOutput)) && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-gray-500 space-y-3">
                  <Sparkles className="w-10 h-10 text-neutral-border" />
                  <p className="text-xs">Provide inputs on the left and submit to view AI responses.</p>
                </div>
            )}

            {/* Loading view */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-brand-primary space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <p className="text-xs text-gray-400 animate-pulse">Running semantic analysis chains...</p>
              </div>
            )}

            {/* AI Response Display Panels */}
            {!loading && (
              <div className="space-y-4 text-xs leading-relaxed max-h-[500px] overflow-y-auto pr-1">
                
                {/* 1. Reviewer Render */}
                {activeTab === 'reviewer' && reviewOutput && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
                      <span className="text-[10px] text-brand-primary font-semibold uppercase tracking-wider block mb-1">Code Quality Overview</span>
                      <p className="text-gray-300 text-xs">{reviewOutput.overview}</p>
                    </div>

                    <div className="space-y-4">
                      {reviewOutput.bestPractices?.length > 0 && (
                        <div>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase block mb-1.5">Best Practices</span>
                          <ul className="list-disc list-inside text-gray-400 space-y-1">
                            {reviewOutput.bestPractices.map((b: string, i: number) => <li key={i}>{b}</li>)}
                          </ul>
                        </div>
                      )}

                      {reviewOutput.performance?.length > 0 && (
                        <div>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase block mb-1.5">Performance Optimizations</span>
                          <ul className="list-disc list-inside text-gray-400 space-y-1">
                            {reviewOutput.performance.map((p: string, i: number) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                      )}

                      {reviewOutput.security?.length > 0 && (
                        <div>
                          <span className="text-[10px] text-red-400 font-semibold uppercase block mb-1.5">Security Guidelines</span>
                          <ul className="list-disc list-inside text-gray-400 space-y-1">
                            {reviewOutput.security.map((s: string, i: number) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>

                    {reviewOutput.refactoredCode && (
                      <div>
                        <span className="text-[10px] text-brand-primary font-semibold uppercase block mb-2">Refactored Suggestions</span>
                        <pre className="p-4 rounded-xl bg-neutral-darkBg border border-neutral-border text-brand-primary font-mono text-[10px] overflow-x-auto max-h-48 leading-relaxed">
                          {reviewOutput.refactoredCode}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Bug Fixer Render */}
                {activeTab === 'bug' && bugOutput && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-brand-secondary/5 border border-brand-secondary/15">
                      <span className="text-[10px] text-brand-secondary font-semibold uppercase tracking-wider block mb-1">Root Cause</span>
                      <p className="text-gray-300 text-xs">{bugOutput.rootCause}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase block mb-1.5">Explanation</span>
                      <p className="text-gray-400 leading-relaxed">{bugOutput.explanation}</p>
                    </div>

                    {bugOutput.suggestedSolution && (
                      <div>
                        <span className="text-[10px] text-brand-secondary font-semibold uppercase block mb-2">Suggested Correction</span>
                        <pre className="p-4 rounded-xl bg-neutral-darkBg border border-neutral-border text-brand-secondary font-mono text-[10px] overflow-x-auto max-h-48 leading-relaxed">
                          {bugOutput.suggestedSolution}
                        </pre>
                      </div>
                    )}

                    {bugOutput.preventionTips?.length > 0 && (
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase block mb-1.5">How to prevent</span>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                          {bugOutput.preventionTips.map((p: string, i: number) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. README Render */}
                {activeTab === 'readme' && readmeOutput && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-brand-accent bg-brand-accent/5 px-3 py-1.5 rounded-xl border border-brand-accent/15">
                      <FileText className="w-4.5 h-4.5" />
                      <span>README.md document compiled successfully. Download or copy above.</span>
                    </div>
                    <pre className="p-5 rounded-2xl bg-neutral-darkBg border border-neutral-border text-gray-300 font-mono text-[10px] leading-relaxed overflow-x-auto max-h-96">
                      {readmeOutput}
                    </pre>
                  </div>
                )}

                {/* 4. Recommender Render */}
                {activeTab === 'recommend' && recommendOutput && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-2">Folder Layout Diagram</span>
                      <pre className="p-4 rounded-xl bg-neutral-darkBg border border-neutral-border text-brand-primary font-mono text-[10px] leading-relaxed overflow-x-auto max-h-48">
                        {recommendOutput.folderStructure}
                      </pre>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-neutral-darkBg/50 border border-neutral-border">
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold mb-1">Recommended Packages</span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {recommendOutput.packages?.map((pkg: string) => (
                            <span key={pkg} className="px-2 py-0.5 rounded bg-neutral-border text-[9px] text-white font-mono">{pkg}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-neutral-darkBg/50 border border-neutral-border">
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold mb-1">Authentication Package</span>
                        <p className="text-xs font-bold text-white mt-1.5">{recommendOutput.authLibrary}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-neutral-darkBg/50 border border-neutral-border">
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold mb-1">Database choice</span>
                        <p className="text-xs text-gray-300 leading-relaxed mt-1.5">{recommendOutput.database}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-neutral-darkBg/50 border border-neutral-border">
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold mb-1">Deployment recommendations</span>
                        <p className="text-xs text-gray-300 leading-relaxed mt-1.5">{recommendOutput.deployment}</p>
                      </div>
                    </div>

                    <div className="border-t border-neutral-border pt-4">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase block mb-1.5">Architecture tips</span>
                      <p className="text-gray-400 leading-relaxed">{recommendOutput.architectureTips}</p>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
};
