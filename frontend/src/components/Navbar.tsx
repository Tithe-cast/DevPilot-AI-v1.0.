import React, { useState } from 'react';
import { Menu, X, Terminal, ChevronRight, Settings } from 'lucide-react';

interface NavbarProps {
  user: any;
  currentPage: string;
  setPage: (page: string, projectId?: string | null) => void;
  logoutUser: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  currentPage, 
  setPage, 
  logoutUser,
  onOpenSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    setPage(page);
    setMobileMenuOpen(false);
  };

  const activeClass = (page: string) => 
    currentPage === page 
      ? "text-brand-primary font-semibold" 
      : "text-gray-300 hover:text-white transition-colors duration-200";

  return (
    <nav className="sticky top-0 z-50 w-full bg-neutral-darkBg/80 backdrop-blur-md border-b border-neutral-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavClick(user ? 'dashboard' : 'home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center neon-shadow transition-transform duration-300 group-hover:scale-105">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-primary to-white bg-clip-text text-transparent">
              DevPilot AI
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
              v1.0
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            {!user ? (
              <>
                <button onClick={() => handleNavClick('home')} className={activeClass('home')}>Home</button>
                <button onClick={() => handleNavClick('home#tools')} className="text-gray-300 hover:text-white transition-colors">AI Tools</button>
                <button onClick={() => handleNavClick('about')} className={activeClass('about')}>About</button>
                <button 
                  onClick={() => handleNavClick('login')} 
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleNavClick('register')} 
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-primary text-neutral-darkBg shadow hover:opacity-90 transition-all duration-300"
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavClick('dashboard')} className={activeClass('dashboard')}>Dashboard</button>
                <button onClick={() => handleNavClick('projects')} className={activeClass('projects')}>Projects</button>
                <button onClick={() => handleNavClick('workspace')} className={activeClass('workspace')}>AI Workspace</button>
                <button onClick={() => handleNavClick('chat')} className={activeClass('chat')}>AI Chat</button>
                <button onClick={() => handleNavClick('history')} className={activeClass('history')}>History</button>
                <button onClick={() => handleNavClick('profile')} className={activeClass('profile')}>Profile</button>
                
                {/* Settings & User */}
                <div className="flex items-center gap-4 pl-4 border-l border-neutral-border">
                  <button 
                    onClick={onOpenSettings} 
                    className="p-2 text-gray-400 hover:text-brand-primary hover:bg-neutral-border/40 rounded-lg transition-all"
                    title="API Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full border border-brand-primary/20 bg-neutral-cardBg"
                    />
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <button 
                        onClick={logoutUser} 
                        className="text-[10px] text-gray-400 hover:text-red-400 block transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <button 
                onClick={onOpenSettings}
                className="p-2 text-gray-400 hover:text-brand-primary rounded-lg"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-darkBg border-b border-neutral-border px-4 py-4 space-y-3">
          {!user ? (
            <>
              <button onClick={() => handleNavClick('home')} className={`block w-full text-left py-2 ${activeClass('home')}`}>Home</button>
              <button onClick={() => handleNavClick('home#tools')} className="block w-full text-left py-2 text-gray-300 hover:text-white">AI Tools</button>
              <button onClick={() => handleNavClick('about')} className={`block w-full text-left py-2 ${activeClass('about')}`}>About</button>
              <div className="h-px bg-neutral-border my-2"></div>
              <button onClick={() => handleNavClick('login')} className="block w-full text-center py-2 bg-neutral-cardBg rounded-xl border border-neutral-border font-semibold text-white">Log In</button>
              <button onClick={() => handleNavClick('register')} className="block w-full text-center py-2 bg-brand-primary rounded-xl font-semibold text-neutral-darkBg">Get Started</button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 px-2 py-1 mb-2">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-brand-primary/20 bg-neutral-cardBg" />
                <div>
                  <h4 className="text-sm font-semibold text-white">{user.name}</h4>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="h-px bg-neutral-border my-2"></div>
              <button onClick={() => handleNavClick('dashboard')} className={`block w-full text-left py-2 ${activeClass('dashboard')}`}>Dashboard</button>
              <button onClick={() => handleNavClick('projects')} className={`block w-full text-left py-2 ${activeClass('projects')}`}>Projects</button>
              <button onClick={() => handleNavClick('workspace')} className={`block w-full text-left py-2 ${activeClass('workspace')}`}>AI Workspace</button>
              <button onClick={() => handleNavClick('chat')} className={`block w-full text-left py-2 ${activeClass('chat')}`}>AI Chat</button>
              <button onClick={() => handleNavClick('history')} className={`block w-full text-left py-2 ${activeClass('history')}`}>History</button>
              <button onClick={() => handleNavClick('profile')} className={`block w-full text-left py-2 ${activeClass('profile')}`}>Profile</button>
              <button 
                onClick={() => { logoutUser(); setMobileMenuOpen(false); }} 
                className="block w-full text-left py-2 text-red-400 hover:text-red-300 font-semibold"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
