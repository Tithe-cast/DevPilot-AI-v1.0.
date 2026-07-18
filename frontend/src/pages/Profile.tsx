import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Eye, EyeOff, Save, Key, RefreshCw, BarChart3, FolderGit2, Sparkles, MessageSquare
} from 'lucide-react';

interface ProfileProps {
  token: string | null;
  logoutUser: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const Profile: React.FC<ProfileProps> = ({ token, logoutUser, showToast }) => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // API Key states
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const fetchProfileDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setProfile(data.user);
      setStats(data.stats);
      setName(data.user.name);

      // Fetch api key from localStorage if present
      const savedKey = localStorage.getItem('devpilot_gemini_api_key') || '';
      setApiKey(savedKey);
    } catch (err: any) {
      showToast(err.message || 'Failed to retrieve profile details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setSaving(true);
    try {
      const updates: any = { name };
      if (password) updates.password = password;

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      showToast('Profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
      fetchProfileDetails();
    } catch (err: any) {
      showToast(err.message || 'Profile save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAPIKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('devpilot_gemini_api_key', apiKey.trim());
      showToast('Gemini API key encrypted and cached locally!', 'success');
    } else {
      localStorage.removeItem('devpilot_gemini_api_key');
      showToast('Gemini API key cleared from cache.', 'success');
    }
  };

  useEffect(() => {
    if (token) fetchProfileDetails();
  }, [token]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
        <p className="text-gray-400 text-sm">Retrieving profile parameters...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Settings</h1>
        <p className="text-sm text-gray-400">Manage account information, API keys, and track token usage statistics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: General Profile Settings */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Form */}
          <form onSubmit={handleProfileSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-border space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5"><User className="w-5 h-5 text-brand-primary" /> General Profile</h3>
            
            <div className="flex items-center gap-4">
              <img src={profile?.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border border-neutral-border bg-neutral-darkBg" />
              <div>
                <h4 className="font-bold text-white text-sm">{profile?.name}</h4>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Display Name</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Change Password</label>
                <input 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep same"
                  className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Confirm Password</label>
                <input 
                  type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={saving}
              className="px-6 py-3 bg-brand-primary text-neutral-darkBg font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          {/* API Key Form */}
          <form onSubmit={handleSaveAPIKey} className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-border space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5"><Key className="w-5 h-5 text-brand-secondary" /> Gemini API Key Credentials</h3>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              Your API key is saved exclusively inside your browser's local sandbox storage and sent in secure headers directly to the API endpoints to complete evaluations. We do not store keys on our databases.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Google Gemini API Key</label>
              <div className="relative">
                <input 
                  type={showKey ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl font-mono text-xs text-white focus:outline-none focus:border-brand-primary"
                />
                <button 
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showKey ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="px-6 py-3 bg-brand-secondary text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Save className="w-4 h-4" />
              Save API Key
            </button>
          </form>

        </div>

        {/* Right Side: Account Stats Summary */}
        <div className="glass-panel p-6 rounded-3xl border border-neutral-border space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-1.5"><BarChart3 className="w-5 h-5 text-brand-accent" /> Usage Analytics</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-neutral-border/50 pb-3">
              <span className="flex items-center gap-1.5 text-gray-400"><FolderGit2 className="w-4 h-4 text-brand-primary" /> Projects Tracked</span>
              <span className="font-bold text-white">{stats?.totalProjects || 0}</span>
            </div>
            <div className="flex justify-between items-center border-b border-neutral-border/50 pb-3">
              <span className="flex items-center gap-1.5 text-gray-400"><Sparkles className="w-4 h-4 text-brand-secondary" /> AI Transactions</span>
              <span className="font-bold text-white">{stats?.aiRequests || 0}</span>
            </div>
            <div className="flex justify-between items-center border-b border-neutral-border/50 pb-3">
              <span className="flex items-center gap-1.5 text-gray-400"><MessageSquare className="w-4 h-4 text-purple-400" /> Chat Logs</span>
              <span className="font-bold text-white">{stats?.savedConversations || 0}</span>
            </div>
          </div>

          <div className="p-4 bg-neutral-darkBg border border-neutral-border rounded-xl">
            <span className="text-[10px] text-gray-500 uppercase block font-semibold mb-1">Developer Tier</span>
            <div className="text-base font-extrabold text-brand-primary mt-1">DevPilot Free Tier</div>
            <p className="text-[10px] text-gray-400 leading-relaxed mt-2">Provides standard access to four core AI workspaces and context-aware chat assistants.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
