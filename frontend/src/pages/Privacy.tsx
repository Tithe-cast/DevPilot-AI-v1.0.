import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-gray-300">
      <h1 className="text-4xl font-extrabold text-white mb-6 text-center">Privacy Policy</h1>
      <p className="text-sm mb-6 text-gray-400 text-center">Last Updated: July 18, 2026</p>
      
      <div className="glass-panel p-8 rounded-2xl space-y-6 text-sm leading-relaxed">
        <section>
          <h3 className="text-lg font-bold text-white mb-2">1. Data Storage & Ownership</h3>
          <p>
            At DevPilot AI, we respect your intellectual property. All source codes inputted into the AI Reviewer or Bug diagnostic workspace are processed immediately in-memory and are never stored on our database servers.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-2">2. Local Storage</h3>
          <p>
            Your projects, prompt logs, generated README documents, and chat records are preserved inside your local database setup or browser sandbox. No telemetry data or analytics profiles are exported to third-party marketing entities.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-2">3. API Security</h3>
          <p>
            If you connect your personal Google Gemini API key via the settings panel, it is encrypted and saved inside your browser session's local storage storage configuration. It is dispatched strictly in headers to evaluate prompts, keeping your credential secret.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-2">4. Contact Information</h3>
          <p>
            If you have questions regarding this privacy draft, contact us directly at support@devpilot.ai.
          </p>
        </section>
      </div>
    </div>
  );
};
