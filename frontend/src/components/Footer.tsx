import React from 'react';
import { Terminal, Github, Twitter, Linkedin, Heart } from 'lucide-react';

interface FooterProps {
  setPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setPage }) => {
  return (
    <footer className="bg-neutral-darkBg/90 border-t border-neutral-border pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">DevPilot AI</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Next-generation context-aware developer workspace. Streamlining reviews, debugging, recommendations, and documentation.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => setPage('home')} className="hover:text-brand-primary transition-colors text-left">Home</button></li>
              <li><button onClick={() => setPage('home')} className="hover:text-brand-primary transition-colors text-left">AI Workspace</button></li>
              <li><button onClick={() => setPage('about')} className="hover:text-brand-primary transition-colors text-left">About Us</button></li>
              <li><button onClick={() => setPage('contact')} className="hover:text-brand-primary transition-colors text-left">Contact Support</button></li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => setPage('privacy')} className="hover:text-brand-primary transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => setPage('terms')} className="hover:text-brand-primary transition-colors text-left">Terms & Conditions</button></li>
            </ul>
          </div>

          {/* Newsletter section */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Subscribe to DevPilot Weekly</h4>
            <p className="text-sm text-gray-400 mb-4">Get the latest updates, prompts, and tutorials in your inbox.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to DevPilot newsletter successfully!'); }} className="flex gap-2">
              <input 
                type="email" 
                placeholder="developer@domain.com"
                required
                className="w-full px-3 py-2 text-sm bg-neutral-cardBg border border-neutral-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-brand-primary text-neutral-darkBg rounded-lg text-sm font-semibold hover:opacity-95 transition-opacity"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-neutral-border pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} DevPilot AI. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the modern software engineering community.
          </p>
        </div>
      </div>
    </footer>
  );
};
