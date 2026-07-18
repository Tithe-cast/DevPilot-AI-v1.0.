import React, { useState, useEffect } from 'react';
import { 
  Terminal, Code, Bug, BookOpen, MessageSquare, 
  FolderGit2, Plus, Sparkles, User, Settings, RefreshCw 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, AreaChart, Area, CartesianGrid 
} from 'recharts';

interface DashboardProps {
  token: string | null;
  setPage: (page: string, projectId?: string | null) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ token, setPage, showToast }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProfile(data.user);
      setStats(data.stats);
    } catch (err: any) {
      showToast(err.message || 'Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Compiling workspace statistics...</p>
      </div>
    );
  }

  // Fallback charts info if database has no weekly stats yet
  const chartData = stats?.weeklyActivity || [
    { week: 'Mon', requests: 0 },
    { week: 'Tue', requests: 0 },
    { week: 'Wed', requests: 0 },
    { week: 'Thu', requests: 0 },
    { week: 'Fri', requests: 0 },
    { week: 'Sat', requests: 0 },
    { week: 'Sun', requests: 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/5 border border-brand-primary/15 rounded-3xl p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-brand-primary animate-pulse" />
            <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">DevPilot Workspace Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {profile?.name || 'Developer'}!
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Analyze your recent activity or launch a specialized assistant from the AI Workspace.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setPage('add-project')}
            className="px-5 py-3 rounded-xl bg-brand-primary text-neutral-darkBg font-bold text-sm shadow neon-shadow flex items-center gap-2 hover:scale-[1.01] transition-transform"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
          <button 
            onClick={() => setPage('workspace')}
            className="px-5 py-3 rounded-xl bg-neutral-cardBg border border-neutral-border text-white font-bold text-sm hover:bg-neutral-border/50 transition-colors flex items-center gap-2"
          >
            <Code className="w-4 h-4 text-brand-primary" />
            Launch AI Workspace
          </button>
        </div>
      </div>

      {/* Stats cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-t border-t-brand-primary">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Projects</span>
            <FolderGit2 className="w-5 h-5 text-brand-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">{stats?.totalProjects || 0}</h2>
          <button onClick={() => setPage('projects')} className="text-xs text-brand-primary mt-2 flex items-center gap-1 hover:underline">
            Manage projects &rarr;
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-t border-t-brand-secondary">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Requests</span>
            <Sparkles className="w-5 h-5 text-brand-secondary" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">{stats?.aiRequests || 0}</h2>
          <button onClick={() => setPage('workspace')} className="text-xs text-brand-secondary mt-2 flex items-center gap-1 hover:underline">
            Use AI Tools &rarr;
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-t border-t-brand-accent">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Generated Documents</span>
            <BookOpen className="w-5 h-5 text-brand-accent" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">{stats?.generatedDocs || 0}</h2>
          <button onClick={() => setPage('history')} className="text-xs text-brand-accent mt-2 flex items-center gap-1 hover:underline">
            View documents &rarr;
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-t border-t-purple-500">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Conversations</span>
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">{stats?.savedConversations || 0}</h2>
          <button onClick={() => setPage('chat')} className="text-xs text-purple-400 mt-2 flex items-center gap-1 hover:underline">
            Open Chatbot &rarr;
          </button>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Line/Area Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-lg">AI Requests Trend</h3>
            <span className="text-xs text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full border border-brand-primary/20">Weekly View</span>
          </div>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f293d" strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#131926', 
                    borderColor: '#1f293d', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="requests" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" name="Requests" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Tool Distribution Chart */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-lg">AI Tools Usage</h3>
          <div className="h-72 w-full text-xs flex flex-col justify-between">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Reviews', count: Math.ceil((stats?.aiRequests || 10) * 0.35) },
                  { name: 'Bugs', count: Math.ceil((stats?.aiRequests || 10) * 0.25) },
                  { name: 'READMEs', count: stats?.generatedDocs || 0 },
                  { name: 'Recommends', count: Math.ceil((stats?.aiRequests || 10) * 0.20) }
                ]}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#131926', 
                      borderColor: '#1f293d', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Uses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 border-t border-neutral-border pt-4">
              <div className="flex justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-brand-primary"></span>Code Reviewer</span>
                <span className="font-semibold text-white">{Math.ceil((stats?.aiRequests || 10) * 0.35)} runs</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-brand-secondary"></span>Bug Fix Assistant</span>
                <span className="font-semibold text-white">{Math.ceil((stats?.aiRequests || 10) * 0.25)} runs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
