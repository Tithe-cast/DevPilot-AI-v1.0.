import React, { useState } from 'react';
import { Terminal, ShieldAlert, LogIn, Sparkles } from 'lucide-react';

interface LoginProps {
  setPage: (page: string) => void;
  loginUser: (token: string, user: any) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  googleClientId: string;
}

export const Login: React.FC<LoginProps> = ({ setPage, loginUser, showToast, googleClientId }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const contentType = response.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (text.includes('<!DOCTYPE html>') || text.startsWith('<') || text.includes('An error occurred')) {
          throw new Error('Could not connect to the backend server. Make sure your backend server is running on port 5000 (locally) or check your vercel.json Render backend URL (production).');
        }
        throw new Error(text || `HTTP ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      loginUser(data.token, data.user);
      showToast('Welcome back, developer!', 'success');
    } catch (err: any) {
      setError(err.message || 'Server error');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@devpilot.ai');
    setPassword('password123');
    showToast('Demo credentials autofilled!', 'success');
    
    // Autocommit after a tiny delay
    setTimeout(() => {
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) submitBtn.click();
    }, 100);
  };

  const runSimulatedGoogleLogin = async () => {
    setLoading(true);
    try {
      showToast('Connecting with Google (Simulated)...', 'info');
      await new Promise(r => setTimeout(r, 1200));

      const mockGoogleProfile = {
        email: 'google.dev@gmail.com',
        name: 'Alex Mercer',
        avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex'
      };

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockGoogleProfile)
      });

      const contentType = response.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }

      if (!response.ok) throw new Error(data.error);

      loginUser(data.token, data.user);
      showToast('Google login simulated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Google Auth failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!googleClientId) {
      runSimulatedGoogleLogin();
      return;
    }

    try {
      setLoading(true);
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile openid',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            setLoading(false);
            showToast(tokenResponse.error_description || 'Google login cancelled', 'error');
            return;
          }
          try {
            showToast('Verifying Google credentials...', 'success');
            const response = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: tokenResponse.access_token })
            });

            const contentType = response.headers.get('content-type');
            let data: any = {};
            if (contentType && contentType.includes('application/json')) {
              data = await response.json();
            } else {
              const text = await response.text();
              throw new Error(text || `Server returned HTTP ${response.status}`);
            }

            if (!response.ok) throw new Error(data.error || 'Google validation failed');

            loginUser(data.token, data.user);
            showToast('Google login successful!', 'success');
          } catch (err: any) {
            showToast(err.message || 'Google validation failed', 'error');
          } finally {
            setLoading(false);
          }
        }
      });
      client.requestAccessToken();
    } catch (err: any) {
      setLoading(false);
      showToast('Google Client failed to initialize. Check Client ID settings.', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-8 rounded-3xl border border-neutral-border shadow-xl">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">Log in to DevPilot</h2>
          <p className="mt-2 text-sm text-gray-400">
            Or{' '}
            <button 
              onClick={() => setPage('register')} 
              className="font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              create a free workspace
            </button>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3 items-center text-red-400 text-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              id="submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-primary text-neutral-darkBg font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            {/* Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-3 bg-neutral-border/40 text-brand-primary font-bold rounded-xl border border-brand-primary/20 flex items-center justify-center gap-2 hover:bg-neutral-border/60 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Demo Login
            </button>

            {/* Google simulated Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-neutral-cardBg text-white rounded-xl border border-neutral-border flex items-center justify-center gap-2 hover:bg-neutral-border/30 transition-all text-sm font-semibold"
            >
              <svg className="w-4.5 h-4.5 mr-1" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.75 21.56,11.4 21.35,11.1z" fill="#4285F4" />
                  <path d="M12,20.7c2.35,0 4.32,-0.78 5.76,-2.1l-3.3,-2.57c-0.92,0.6 -2.1,0.97 -3.3,0.97 -2.54,0 -4.7,-1.72 -5.47,-4.03H2.2v2.66C3.65,18.47 7.55,20.7 12,20.7z" fill="#34A853" />
                  <path d="M6.53,12.97c-0.2,-0.6 -0.3,-1.23 -0.3,-1.87s0.1,-1.27 0.3,-1.87V6.57H2.2c-0.78,1.55 -1.2,3.3 -1.2,5.13s0.42,3.58 1.2,5.13L6.53,12.97z" fill="#FBBC05" />
                  <path d="M12,5.13c1.28,0 2.42,0.44 3.33,1.3l2.5,-2.5C16.32,2.58 14.35,1.8 12,1.8 7.55,1.8 3.65,4.03 2.2,6.97L6.53,9.63C7.3,7.32 9.46,5.13 12,5.13z" fill="#EA4335" />
                </g>
              </svg>
              {googleClientId ? 'Google Sign In' : 'Google Sign In (Simulated)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
