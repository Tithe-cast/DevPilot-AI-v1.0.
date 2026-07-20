import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { AddProject } from './pages/AddProject';
import { EditProject } from './pages/EditProject';
import { Workspace } from './pages/Workspace';
import { Chat } from './pages/Chat';
import { History } from './pages/History';
import { Profile } from './pages/Profile';

import { Key, Eye, EyeOff, Save, X, Terminal, AlertCircle } from 'lucide-react';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  // Authentication Session
  const [token, setToken] = useState<string | null>(localStorage.getItem('devpilot_token'));
  const [user, setUser] = useState<any>(null);

  // Router
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // API Config Modal
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem('devpilot_gemini_api_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [googleClientId, setGoogleClientId] = useState(localStorage.getItem('devpilot_google_client_id') || '15074263932-vmj6fmdv3lg3tncj6keq2lhtni7sojqt.apps.googleusercontent.com');

  // Global Toast Notifications
  const [toast, setToast] = useState<Toast | null>(null);

  // Global synced data
  const [projectsList, setProjectsList] = useState<any[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    // Dismiss after 4 seconds
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loginUser = (userToken: string, userData: any) => {
    localStorage.setItem('devpilot_token', userToken);
    setToken(userToken);
    setUser(userData);
    showToast('Login successful!', 'success');
    setCurrentPage('dashboard');
  };

  const logoutUser = () => {
    localStorage.removeItem('devpilot_token');
    setToken(null);
    setUser(null);
    setProjectsList([]);
    showToast('Signed out successfully.', 'info');
    setCurrentPage('home');
  };

  const handleSetPage = (page: string, projectId: string | null = null) => {
    // If route has # element
    if (page.includes('#')) {
      const parts = page.split('#');
      setCurrentPage(parts[0]);
      setTimeout(() => {
        const el = document.getElementById(parts[1]);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setCurrentPage(page);
    }
    setCurrentProjectId(projectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Verify auth session on load
  const verifySession = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Session expired');
      }
      setUser(data.user);
      
      // Pre-fetch projects list
      const projResp = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const projData = await projResp.json();
      if (projResp.ok) setProjectsList(projData);

    } catch (err) {
      console.log('Session expired, logging out', err);
      logoutUser();
    }
  };

  // Sync projects list whenever user moves to pages that consume projects
  const syncProjects = async () => {
    if (!token || !user) return;
    try {
      const response = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setProjectsList(data);
    } catch (err) {
      console.error('Error syncing projects list', err);
    }
  };

  useEffect(() => {
    verifySession();
  }, [token]);

  useEffect(() => {
    if (['dashboard', 'projects', 'workspace', 'chat', 'project-details'].includes(currentPage)) {
      syncProjects();
    }
  }, [currentPage]);

  const handleSaveAPIKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      localStorage.setItem('devpilot_gemini_api_key', apiKeyInput.trim());
    } else {
      localStorage.removeItem('devpilot_gemini_api_key');
    }

    if (googleClientId.trim()) {
      localStorage.setItem('devpilot_google_client_id', googleClientId.trim());
      showToast('Configurations updated successfully!', 'success');
    } else {
      localStorage.removeItem('devpilot_google_client_id');
      showToast('Configurations updated, Google Client ID cleared.', 'info');
    }
    setShowSettings(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-neutral-darkBg flex flex-col justify-between font-sans selection:bg-brand-primary/30 text-white selection:text-white">
        
        {/* Global Toast */}
        {toast && (
          <div className={`fixed bottom-5 right-5 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border text-xs font-semibold animate-bounce ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'}`}>
            <span>{toast.message}</span>
          </div>
        )}

        {/* Global Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-neutral-border space-y-6 relative">
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-neutral-cardBg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">API Settings</h3>
                <p className="text-xs text-gray-400">Configure parameters for custom services.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Gemini API Key (Optional)</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type={showKey ? 'text' : 'password'}
                        placeholder="AI functions fallback key..."
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
                      >
                        {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Google OAuth Client ID</label>
                  <input 
                    type="text"
                    placeholder="Enter Client ID..."
                    value={googleClientId}
                    onChange={(e) => setGoogleClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <button 
                  onClick={handleSaveAPIKey}
                  className="w-full py-2.5 bg-brand-primary text-neutral-darkBg font-bold text-xs rounded-xl shadow neon-shadow flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Navigation Header */}
        <Navbar 
          user={user} 
          currentPage={currentPage} 
          setPage={handleSetPage} 
          logoutUser={logoutUser}
          onOpenSettings={() => setShowSettings(true)}
        />

        {/* Main Content Router */}
        <main className="flex-grow">
          {currentPage === 'home' && <Home setPage={handleSetPage} />}
          {currentPage === 'about' && <About />}
          {currentPage === 'contact' && <Contact />}
          {currentPage === 'privacy' && <Privacy />}
          {currentPage === 'terms' && <Terms />}
          
          {currentPage === 'login' && <Login setPage={handleSetPage} loginUser={loginUser} showToast={showToast} googleClientId={googleClientId} />}
          {currentPage === 'register' && <Register setPage={handleSetPage} loginUser={loginUser} showToast={showToast} googleClientId={googleClientId} />}
          
          {currentPage === 'dashboard' && <Dashboard token={token} setPage={handleSetPage} showToast={showToast} />}
          {currentPage === 'projects' && <Projects token={token} setPage={handleSetPage} showToast={showToast} />}
          {currentPage === 'project-details' && <ProjectDetails token={token} projectId={currentProjectId} setPage={handleSetPage} showToast={showToast} />}
          {currentPage === 'add-project' && <AddProject token={token} setPage={handleSetPage} showToast={showToast} />}
          {currentPage === 'edit-project' && <EditProject token={token} projectId={currentProjectId} setPage={handleSetPage} showToast={showToast} />}
          
          {currentPage === 'workspace' && <Workspace token={token} projectsList={projectsList} showToast={showToast} />}
          {currentPage === 'chat' && <Chat token={token} projectsList={projectsList} showToast={showToast} />}
          {currentPage === 'history' && <History token={token} setPage={handleSetPage} showToast={showToast} />}
          {currentPage === 'profile' && <Profile token={token} logoutUser={logoutUser} showToast={showToast} />}
        </main>

        {/* Bottom Footer */}
        <Footer setPage={handleSetPage} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
