import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
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
      showToast('API key updated successfully!', 'success');
    } else {
      localStorage.removeItem('devpilot_gemini_api_key');
      showToast('API key cleared, falling back to mock engine.', 'info');
    }
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-neutral-darkBg flex flex-col justify-between relative">
      {/* Top Navbar */}
      <Navbar 
        user={user} 
        currentPage={currentPage} 
        setPage={handleSetPage} 
        logoutUser={logoutUser}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-brand-accent/10 border-brand-accent/30 text-brand-accent' :
            toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
            'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'
          }`}>
            <Terminal className="w-4 h-4 flex-shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* API Key settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-border space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-white flex items-center gap-1.5"><Key className="w-5 h-5 text-brand-primary" /> API Configurations</h3>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-neutral-border rounded text-gray-400 hover:text-white">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              We process API queries in-memory. Enter a custom Google Gemini API Key to enable real LLM generations. Leave blank to run local mock response engines.
            </p>

            <form onSubmit={handleSaveAPIKey} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Gemini Key</label>
                <div className="relative">
                  <input 
                    type={showKey ? 'text' : 'password'}
                    placeholder="AIzaSy..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
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
                className="w-full py-3 bg-brand-primary text-neutral-darkBg font-bold text-xs rounded-xl shadow neon-shadow flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save API Config
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-grow">
        {currentPage === 'home' && <Home setPage={handleSetPage} />}
        {currentPage === 'about' && <About />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'privacy' && <Privacy />}
        {currentPage === 'terms' && <Terms />}
        
        {currentPage === 'login' && <Login setPage={handleSetPage} loginUser={loginUser} showToast={showToast} />}
        {currentPage === 'register' && <Register setPage={handleSetPage} loginUser={loginUser} showToast={showToast} />}
        
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
  );
}

export default App;
