import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">Contact Support</h1>
        <p className="text-gray-400">Have questions? We would love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass-panel p-6 rounded-2xl text-center">
          <Mail className="w-8 h-8 text-brand-primary mx-auto mb-3" />
          <h4 className="font-semibold text-white mb-1">Email Us</h4>
          <p className="text-xs text-gray-400">support@devpilot.ai</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl text-center">
          <MessageSquare className="w-8 h-8 text-brand-secondary mx-auto mb-3" />
          <h4 className="font-semibold text-white mb-1">Live Chat</h4>
          <p className="text-xs text-gray-400">Mon-Fri, 9am - 6pm EST</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl text-center">
          <MapPin className="w-8 h-8 text-brand-accent mx-auto mb-3" />
          <h4 className="font-semibold text-white mb-1">Office</h4>
          <p className="text-xs text-gray-400">Boston, MA, USA</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        {submitted ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-brand-accent mb-2">Message Sent!</h3>
            <p className="text-gray-400 text-sm">We'll review your submission and reply shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" required
                  className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message Topic</label>
              <select className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary">
                <option value="billing">Billing & Subscriptions</option>
                <option value="technical">Technical Bug Report</option>
                <option value="feedback">Product Feedback</option>
                <option value="partnership">Partnership Inquiries</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">How can we help?</label>
              <textarea 
                rows={5} required
                className="w-full px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-white focus:outline-none focus:border-brand-primary resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-brand-primary text-neutral-darkBg font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
