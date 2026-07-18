import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-gray-300">
      <h1 className="text-4xl font-extrabold text-white mb-6 text-center">Terms & Conditions</h1>
      <p className="text-sm mb-6 text-gray-400 text-center">Last Updated: July 18, 2026</p>

      <div className="glass-panel p-8 rounded-2xl space-y-6 text-sm leading-relaxed">
        <section>
          <h3 className="text-lg font-bold text-white mb-2">1. Use of Services</h3>
          <p>
            By accessing DevPilot AI, you agree to comply with standard security procedures. You must not attempt to upload malicious scripts, compromise other user accounts, or overload the API gateways.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-2">2. Accounts and Passwords</h3>
          <p>
            Users are solely responsible for protecting their session JWTs and API configurations. You must notify us immediately if you suspect any credential leakage or unauthorized account login.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-white mb-2">3. Limitation of Liability</h3>
          <p>
            DevPilot AI provides programming suggestions, diagnostics, and template documents "as is". We are not responsible for any architectural bugs, production downtime, or security issues introduced in your deployments as a result of using these AI recommendations.
          </p>
        </section>
      </div>
    </div>
  );
};
