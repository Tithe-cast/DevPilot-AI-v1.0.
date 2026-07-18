import React from 'react';
import { Shield, Users, Target, Rocket } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-white mb-4">About DevPilot AI</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          We are dedicated to building context-aware developer assistants that streamline engineering workflows and eliminate boilerplate setup.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="glass-panel p-8 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-6">
            <Users className="w-6 h-6 text-brand-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Developer-Centric Core</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            DevPilot was created by developers, for developers. We design interfaces that are simple, fast, and keyboard-friendly, avoiding cluttered layouts.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center mb-6">
            <Shield className="w-6 h-6 text-brand-secondary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Privacy & Security</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            We understand the sensitivity of source code. Our local storage architecture and optional user-provided API key configurations keep you in control.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-brand-accent" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">High Accuracy</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            By context-anchoring prompt chains to specific frameworks, languages, and settings, our outputs are highly relevant, reducing LLM hallucinations.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
            <Rocket className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Rapid Evolution</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            We are constantly upgrading our agents to support the latest software libraries (like React 19, Next.js 15, and Better Auth), making sure your recommendations remain cutting-edge.
          </p>
        </div>
      </div>

      {/* Mission statement */}
      <div className="glass-panel p-8 rounded-3xl text-center bg-gradient-to-tr from-neutral-cardBg to-neutral-darkBg">
        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
          To build tools that remove developer friction. We want to automate repetitive writing (READMEs), make stack diagnoses instant, and give engineers a smart second brain to construct secure, scalable code architectures.
        </p>
      </div>
    </div>
  );
};
