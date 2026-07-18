import React, { useState } from 'react';
import { 
  Terminal, Shield, Zap, Sparkles, Code, Cpu, BookOpen, Bug, 
  ArrowRight, Play, CheckCircle2, ChevronDown, RefreshCw, BarChart2
} from 'lucide-react';

interface HomeProps {
  setPage: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setPage }) => {
  // Calculator States
  const [devCount, setDevCount] = useState<number>(3);
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
  const [hourlyRate, setHourlyRate] = useState<number>(50);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Math calculation
  const totalSavedHours = devCount * weeklyHours * 0.4; // assume 40% efficiency boost
  const weeklySavings = totalSavedHours * hourlyRate;
  const yearlySavings = weeklySavings * 52;

  const faqs = [
    {
      q: "How does DevPilot AI achieve context-awareness?",
      a: "When you select a project inside the workspace, DevPilot injects its specific framework, libraries, database, and backend parameters into the prompt payload. This ensures code reviews, recommendations, and chats align exactly with your target project's design."
    },
    {
      q: "Do I need a paid API key to use the services?",
      a: "No! DevPilot supports a free-tier Gemini API key config. You can enter your own key in the navigation settings to ensure uninterrupted API limits. If no key is set, a high-fidelity local simulator runs to demonstrate features."
    },
    {
      q: "Is my source code uploaded or stored externally?",
      a: "Absolutely not. DevPilot stores project schema metadata and request history locally in a file-based storage setup. API requests to Gemini are direct, keeping your repository secure."
    },
    {
      q: "Can I use DevPilot on mobile and tablets?",
      a: "Yes! The entire application is fully responsive and optimized for touch targets, permitting you to review code or generate README templates on the go."
    }
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Driven Engineering Workspace
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Forge Better Code with <span className="bg-gradient-to-r from-brand-primary via-purple-400 to-brand-secondary bg-clip-text text-transparent">DevPilot AI</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-8 leading-relaxed">
            The context-aware developer hub for review, debugging, documentation generation, and architecture recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setPage('register')}
              className="px-8 py-4 bg-brand-primary text-neutral-darkBg font-bold rounded-xl shadow-lg neon-shadow hover:scale-[1.02] transition-all flex items-center gap-2 group"
            >
              Get Started Free 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setPage('login')}
              className="px-8 py-4 bg-neutral-cardBg border border-neutral-border text-white font-bold rounded-xl hover:bg-neutral-border/50 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-brand-primary" />
              Sign In (Demo Account)
            </button>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics */}
      <section className="py-12 bg-neutral-cardBg/40 border-y border-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <h3 className="text-3xl font-extrabold text-brand-primary mb-1">100k+</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">AI Reviews Completed</p>
            </div>
            <div className="p-4">
              <h3 className="text-3xl font-extrabold text-white mb-1">99.8%</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">API Uptime Guarantee</p>
            </div>
            <div className="p-4">
              <h3 className="text-3xl font-extrabold text-brand-accent mb-1">45%</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Average Time Saved</p>
            </div>
            <div className="p-4">
              <h3 className="text-3xl font-extrabold text-white mb-1">12,500+</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Developers Registered</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Engineered for Modern Teams</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-16">
            A workspace that integrates directly with your frameworks to deliver contextual reviews and solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl text-left hover:scale-[1.01] transition-transform">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enterprise Grade Privacy</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your code remains yours. We configure direct LLM pipelines to evaluate scripts safely without persisting copies of source files.
              </p>
            </div>
            <div className="glass-panel p-8 rounded-2xl text-left hover:scale-[1.01] transition-transform">
              <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-brand-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Execution</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Receive prompt responses, suggestions, and full README outputs. No lagging compilation queues or heavy processes.
              </p>
            </div>
            <div className="glass-panel p-8 rounded-2xl text-left hover:scale-[1.01] transition-transform">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center mb-6">
                <Terminal className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Context Anchoring</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Bind your conversations to active project frameworks and settings. The AI automatically matches your language guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI Tools Overview */}
      <section id="tools" className="py-20 bg-neutral-cardBg/20 border-t border-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Supercharge Your Workflows</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-16">
            Four specialized workspaces tailored to accelerate development cycles.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl text-left border-l-2 border-l-brand-primary">
              <Code className="w-8 h-8 text-brand-primary mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Code Reviewer</h4>
              <p className="text-xs text-gray-400 mb-4">Submit source files to receive safety checks, pattern audits, and refactored snippets.</p>
              <span className="text-[10px] text-brand-primary font-semibold flex items-center gap-1">Available now <CheckCircle2 className="w-3.5 h-3.5" /></span>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-left border-l-2 border-l-brand-secondary">
              <Bug className="w-8 h-8 text-brand-secondary mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Bug Fix Assistant</h4>
              <p className="text-xs text-gray-400 mb-4">Paste error logs or stack traces to diagnose issues, resolve race conditions, and get preventative recommendations.</p>
              <span className="text-[10px] text-brand-secondary font-semibold flex items-center gap-1">Available now <CheckCircle2 className="w-3.5 h-3.5" /></span>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-left border-l-2 border-l-brand-accent">
              <BookOpen className="w-8 h-8 text-brand-accent mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">README Generator</h4>
              <p className="text-xs text-gray-400 mb-4">Provide names, installation notes, and descriptions to compile clean, formatted README markdown files.</p>
              <span className="text-[10px] text-brand-accent font-semibold flex items-center gap-1">Available now <CheckCircle2 className="w-3.5 h-3.5" /></span>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-left border-l-2 border-l-purple-500">
              <Cpu className="w-8 h-8 text-purple-500 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Smart Architect</h4>
              <p className="text-xs text-gray-400 mb-4">Analyzes your project tech stack to recommend directory structures, auth systems, database engines, and deployment.</p>
              <span className="text-[10px] text-purple-500 font-semibold flex items-center gap-1">Available now <CheckCircle2 className="w-3.5 h-3.5" /></span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-20 border-t border-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Three Simple Steps</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-16">
            Get up and running with DevPilot AI in minutes.
          </p>
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-neutral-border -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="glass-panel p-6 rounded-2xl bg-neutral-darkBg">
                <div className="w-10 h-10 rounded-full bg-brand-primary text-neutral-darkBg font-bold flex items-center justify-center mx-auto mb-4">1</div>
                <h4 className="text-lg font-semibold text-white mb-2">Create Workspace</h4>
                <p className="text-sm text-gray-400">Add your project profile details, framework settings, and target codebase language.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl bg-neutral-darkBg">
                <div className="w-10 h-10 rounded-full bg-brand-secondary text-white font-bold flex items-center justify-center mx-auto mb-4">2</div>
                <h4 className="text-lg font-semibold text-white mb-2">Select AI Tool</h4>
                <p className="text-sm text-gray-400">Navigate to code review, diagnostic tools, or generated templates depending on your need.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl bg-neutral-darkBg">
                <div className="w-10 h-10 rounded-full bg-brand-accent text-neutral-darkBg font-bold flex items-center justify-center mx-auto mb-4">3</div>
                <h4 className="text-lg font-semibold text-white mb-2">Refactor & Deploy</h4>
                <p className="text-sm text-gray-400">Copy optimized code scripts, download documentation, or follow architectural blueprints to deploy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive ROI Calculator */}
      <section className="py-20 bg-neutral-cardBg/40 border-t border-neutral-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-semibold mb-4">
                <BarChart2 className="w-3.5 h-3.5" />
                Savings Estimator
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Calculate Your Engineering ROI</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                See how much time and financial overhead you can trim by letting DevPilot AI handle code reviews, error logs, and boilerplate documentation.
              </p>
              
              {/* Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                    <span>Number of Developers</span>
                    <span className="text-brand-primary">{devCount} devs</span>
                  </div>
                  <input 
                    type="range" min="1" max="50" value={devCount} 
                    onChange={(e) => setDevCount(Number(e.target.value))} 
                    className="w-full accent-brand-primary bg-neutral-border rounded-lg h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                    <span>Weekly Coding Hours/Dev</span>
                    <span className="text-brand-primary">{weeklyHours} hours</span>
                  </div>
                  <input 
                    type="range" min="5" max="60" value={weeklyHours} 
                    onChange={(e) => setWeeklyHours(Number(e.target.value))} 
                    className="w-full accent-brand-primary bg-neutral-border rounded-lg h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                    <span>Developer Hourly Rate ($)</span>
                    <span className="text-brand-primary">${hourlyRate}/hr</span>
                  </div>
                  <input 
                    type="range" min="20" max="150" value={hourlyRate} 
                    onChange={(e) => setHourlyRate(Number(e.target.value))} 
                    className="w-full accent-brand-primary bg-neutral-border rounded-lg h-2"
                  />
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="p-6 rounded-2xl bg-neutral-darkBg border border-neutral-border text-center">
              <span className="text-xs text-gray-400 uppercase tracking-widest block mb-2">Estimated Annual Savings</span>
              <div className="text-4xl sm:text-5xl font-extrabold text-brand-accent tracking-tight mb-4">
                ${yearlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="h-px bg-neutral-border mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Weekly Time Saved</span>
                  <span className="text-lg font-bold text-white">{totalSavedHours.toFixed(1)} hrs</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Weekly Cash Saved</span>
                  <span className="text-lg font-bold text-white">${weeklySavings.toFixed(0)}</span>
                </div>
              </div>
              <button 
                onClick={() => setPage('register')}
                className="w-full mt-6 py-3 bg-brand-primary text-neutral-darkBg font-bold rounded-xl text-sm shadow hover:opacity-90 transition-opacity"
              >
                Claim Your Workspace Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-20 border-t border-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Trusted by Engineers</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-16">
            Read what other software developers are saying about their workspace productivity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-2xl text-left">
              <p className="text-sm text-gray-300 italic mb-6">
                "The AI Smart Project Recommendation saved me hours of setup on our Next.js project. It recommended folder patterns and database packages that fit perfectly."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary">
                  MD
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">Marcus Vance</h5>
                  <p className="text-xs text-gray-500">Tech Lead, Stripe Integrations</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-left">
              <p className="text-sm text-gray-300 italic mb-6">
                "Having a context-aware chat assistant that knows exactly what framework and db I am using prevents me from asking repetitive prompts. Outstanding UX!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center font-bold text-brand-secondary">
                  JL
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">Jessica Lopez</h5>
                  <p className="text-xs text-gray-500">Senior React Engineer</p>
                </div>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-left">
              <p className="text-sm text-gray-300 italic mb-6">
                "The AI Bug Fixer parsed my Node stack trace and highlighted the exact race condition causing database locks. The prevention advice was extremely useful."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center font-bold text-brand-accent">
                  AK
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">Amit Kumar</h5>
                  <p className="text-xs text-gray-500">Backend Architect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQs Section */}
      <section className="py-20 bg-neutral-cardBg/20 border-t border-neutral-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-panel rounded-xl overflow-hidden border border-neutral-border transition-all">
                <button 
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left text-white hover:bg-neutral-border/20 transition-all font-semibold"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-brand-primary transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-4 pt-2 text-sm text-gray-400 border-t border-neutral-border/40 bg-neutral-darkBg/20 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Call to Action */}
      <section className="py-20 border-t border-neutral-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center bg-gradient-to-tr from-neutral-cardBg to-neutral-darkBg relative overflow-hidden border border-neutral-border">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl"></div>
            <h2 className="text-3xl font-bold text-white mb-4">Start Smarter Coding Today</h2>
            <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
              Create a free account to gain full access to code review workspaces, bug trackers, and personalized engineering suggestions.
            </p>
            <button 
              onClick={() => setPage('register')}
              className="px-8 py-3.5 bg-brand-primary text-neutral-darkBg font-bold rounded-xl shadow-lg hover:scale-[1.01] hover:shadow-cyan-500/20 transition-all"
            >
              Initialize Your Workspace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
