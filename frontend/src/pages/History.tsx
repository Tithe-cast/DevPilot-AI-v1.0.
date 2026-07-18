import React, { useState, useEffect } from 'react';
import { 
  History as HistIcon, Search, Trash2, Code2, Bug, BookOpen, Cpu, 
  RefreshCw, Copy, ExternalLink, Calendar, MessageSquare, ClipboardCheck, ArrowLeft
} from 'lucide-react';

interface HistoryProps {
  token: string | null;
  setPage: (page: string) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const History: React.FC<HistoryProps> = ({ token, setPage, showToast }) => {
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'codeReview' | 'bugReport' | 'readme' | 'recommendation'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setHistory(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to retrieve history logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;

    try {
      const response = await fetch(`/api/ai/history/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Deletion failed');
      
      showToast('Audit record removed', 'success');
      fetchHistory();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Loading historical data logs...</p>
      </div>
    );
  }

  // Compile items with mapped fields
  const allItems: any[] = [];
  if (history) {
    history.codeReviews?.forEach((item: any) => {
      allItems.push({
        ...item,
        type: 'codeReview',
        title: `${item.language} Review`,
        meta: `Audit completed on ${new Date(item.createdAt).toLocaleDateString()}`,
        summary: item.review?.overview || 'Review overview',
        rawText: JSON.stringify(item.review, null, 2)
      });
    });
    history.bugReports?.forEach((item: any) => {
      allItems.push({
        ...item,
        type: 'bugReport',
        title: `Bug Diagnostic: ${item.errorMessage}`,
        meta: `Crash analyzed on ${new Date(item.createdAt).toLocaleDateString()}`,
        summary: item.analysis?.rootCause || 'Root cause explanation',
        rawText: JSON.stringify(item.analysis, null, 2)
      });
    });
    history.readmeDocuments?.forEach((item: any) => {
      allItems.push({
        ...item,
        type: 'readme',
        title: `${item.projectName} README.md`,
        meta: `Markdown compiled on ${new Date(item.createdAt).toLocaleDateString()}`,
        summary: item.description || 'README documentation text',
        rawText: item.content
      });
    });
    history.recommendations?.forEach((item: any) => {
      allItems.push({
        ...item,
        type: 'recommendation',
        title: `Architect Recommendation`,
        meta: `Recommendations generated on ${new Date(item.createdAt).toLocaleDateString()}`,
        summary: item.recommendation?.authLibrary ? `Auth: ${item.recommendation.authLibrary} | DB: ${item.recommendation.database}` : 'Boilerplate settings recommendation',
        rawText: JSON.stringify(item.recommendation, null, 2)
      });
    });
  }

  const filteredItems = allItems
    .filter(item => activeTab === 'all' || item.type === activeTab)
    .filter(item => {
      return item.title.toLowerCase().includes(search.toLowerCase()) || 
             item.summary.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case 'codeReview': return <Code2 className="w-5 h-5 text-brand-primary" />;
      case 'bugReport': return <Bug className="w-5 h-5 text-brand-secondary" />;
      case 'readme': return <BookOpen className="w-5 h-5 text-brand-accent" />;
      default: return <Cpu className="w-5 h-5 text-purple-400" />;
    }
  };

  const getTabLabel = (type: string) => {
    switch (type) {
      case 'codeReview': return 'Code Reviews';
      case 'bugReport': return 'Bug Reports';
      case 'readme': return 'READMEs';
      case 'recommendation': return 'Recommendations';
      default: return 'All Logs';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Audit History</h1>
        <p className="text-sm text-gray-400">Browse, reuse, copy, or delete your previous AI suggestions.</p>
      </div>

      {/* Tabs & Search */}
      <div className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between border border-neutral-border">
        
        {/* Navigation Tabs */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto">
          {(['all', 'codeReview', 'bugReport', 'readme', 'recommendation'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${activeTab === tab ? 'bg-brand-primary text-neutral-darkBg shadow' : 'text-gray-400 hover:text-white'}`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search saved logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary placeholder-gray-500"
          />
        </div>

      </div>

      {/* History log rows */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-border rounded-3xl space-y-3 max-w-sm mx-auto">
          <HistIcon className="w-10 h-10 text-gray-500 mx-auto" />
          <h4 className="font-bold text-white text-base">No History Found</h4>
          <p className="text-xs text-gray-400">You haven't run any processes matching this filter yet.</p>
          <button 
            onClick={() => setPage('workspace')}
            className="px-4 py-2 bg-brand-primary text-neutral-darkBg rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Go to AI Workspace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="glass-panel p-5 rounded-2xl border border-neutral-border flex flex-col md:flex-row justify-between gap-4 items-start md:items-center hover:border-brand-primary/10 transition-all"
            >
              <div className="flex gap-4 items-start max-w-3xl">
                <div className="w-10 h-10 rounded-xl bg-neutral-darkBg border border-neutral-border flex items-center justify-center flex-shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-darkBg border border-neutral-border text-gray-400 font-semibold uppercase">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.meta}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 pt-1.5">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full md:w-auto justify-end border-t border-neutral-border/40 pt-3 md:pt-0 md:border-t-0">
                <button 
                  onClick={() => handleCopyText(item.id, item.rawText)}
                  className="p-2.5 bg-neutral-darkBg border border-neutral-border text-gray-400 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-all"
                  title="Copy full payload text"
                >
                  {copiedId === item.id ? <ClipboardCheck className="w-4 h-4 text-brand-accent" /> : <Copy className="w-4 h-4" />}
                  <span className="md:hidden">Copy</span>
                </button>
                <button 
                  onClick={() => handleDelete(item.type, item.id)}
                  className="p-2.5 bg-neutral-darkBg border border-neutral-border text-gray-400 hover:text-red-400 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                  title="Delete audit log"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="md:hidden">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
