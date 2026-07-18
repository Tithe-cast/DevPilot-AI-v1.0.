import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, MessageSquare, Plus, Trash2, Code2, 
  Terminal, Sparkles, FolderGit2, RefreshCw, UserCheck
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  framework: string;
  language: string;
}

interface ChatProps {
  token: string | null;
  projectsList: Project[];
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const Chat: React.FC<ChatProps> = ({ token, projectsList, showToast }) => {
  const [projectId, setProjectId] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "How should I structure authentication for this setup?",
    "Suggest folder structure layouts.",
    "Recommend essential packages to install.",
    "What deployment platform matches best?"
  ];

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch('/api/ai/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      const chats = data.aiChats || [];
      setSessions(chats);
      
      if (chats.length > 0 && !activeSessionId) {
        setActiveSessionId(chats[0].id);
        setMessages(chats[0].messages);
        setProjectId(chats[0].projectId || '');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to retrieve conversation logs', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  // Scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleStartNewSession = () => {
    setActiveSessionId(null);
    setMessages([]);
    setProjectId(projectsList[0]?.id || '');
    showToast('New context-aware chat started!', 'success');
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);

    const newMsg = { sender: 'user' as const, content: text, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput('');

    try {
      const clientKey = localStorage.getItem('devpilot_gemini_api_key') || '';
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-api-key': clientKey
        },
        body: JSON.stringify({
          projectId: projectId || undefined,
          messages: updatedMessages,
          chatSessionId: activeSessionId || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Set active session details
      if (!activeSessionId) {
        setActiveSessionId(data.id);
        // refresh sidebar sessions
        fetchHistory();
      }
      
      setMessages(data.messages);
    } catch (err: any) {
      showToast(err.message || 'Message response failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation history?')) return;

    try {
      const response = await fetch(`/api/ai/history/chat/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Deletion failed');
      
      showToast('Conversation removed', 'success');
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
      fetchHistory();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const selectSession = (session: any) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setProjectId(session.projectId || '');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[600px] items-stretch">
        
        {/* Left Side: Sessions History Sidebar */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-3xl border border-neutral-border flex flex-col justify-between space-y-4">
          <div className="space-y-4 flex-1 flex flex-col justify-start">
            <button 
              onClick={handleStartNewSession}
              className="w-full py-3 bg-brand-primary text-neutral-darkBg font-bold text-xs rounded-xl shadow neon-shadow flex items-center justify-center gap-1.5 hover:scale-[1.01] transition-transform"
            >
              <Plus className="w-4 h-4" />
              New Conversation
            </button>

            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest block pt-2">Recent Sessions</span>

            {historyLoading ? (
              <div className="text-center py-8 text-brand-primary animate-pulse">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                <span className="text-[10px] text-gray-500">Retrieving chats...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-10 text-xs text-gray-500 italic">No saved conversations.</div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[400px] pr-1">
                {sessions.map((s) => (
                  <div 
                    key={s.id}
                    onClick={() => selectSession(s)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${activeSessionId === s.id ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' : 'bg-neutral-darkBg/40 border-neutral-border text-gray-400 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-xs truncate font-medium">{s.title}</span>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className="p-1 text-gray-500 hover:text-red-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Box */}
        <div className="lg:col-span-3 glass-panel rounded-3xl border border-neutral-border flex flex-col justify-between overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-neutral-border/50 bg-neutral-cardBg/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-primary" />
              <h3 className="font-bold text-white text-sm">DevPilot Mentor Chat</h3>
            </div>
            
            {/* Context anchor */}
            <div className="flex items-center gap-2 text-xs">
              <FolderGit2 className="w-4 h-4 text-brand-secondary" />
              <span className="text-gray-400">Context:</span>
              <select 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)}
                className="bg-neutral-darkBg border border-neutral-border text-white text-xs px-2 py-1 rounded-lg focus:outline-none focus:border-brand-primary cursor-pointer"
              >
                <option value="">-- No project context --</option>
                {projectsList.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.framework})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[420px] bg-neutral-darkBg/10">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                <Sparkles className="w-12 h-12 text-brand-primary/20 animate-pulse" />
                <div className="max-w-md space-y-2">
                  <h4 className="font-bold text-white text-base">Context-Aware AI Assistant</h4>
                  <p className="text-xs text-gray-400">Select your active project to anchor queries about folder architecture, configurations, and deployment strategies.</p>
                </div>
                
                {/* Suggested followups */}
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {suggestedPrompts.map((p, i) => (
                    <button 
                      key={i} onClick={() => handleSendMessage(p)}
                      className="px-3.5 py-2 bg-neutral-cardBg border border-neutral-border text-xs text-gray-300 rounded-xl hover:border-brand-primary/20 hover:text-white transition-all text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
                    {m.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-bold font-mono">AI</div>
                    )}
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${m.sender === 'user' ? 'bg-brand-primary/10 border-brand-primary/20 text-white rounded-tr-none' : 'bg-neutral-cardBg border-neutral-border text-gray-300 rounded-tl-none'}`}>
                      {/* Code parsing / Markdown highlights */}
                      <div className="whitespace-pre-line font-sans">
                        {m.content}
                      </div>
                    </div>
                    {m.sender === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-brand-secondary/15 border border-brand-secondary/25 flex items-center justify-center text-brand-secondary text-[10px] font-bold"><UserCheck className="w-4.5 h-4.5" /></div>
                    )}
                  </div>
                ))}
                
                {/* Typing indicator */}
                {loading && (
                  <div className="flex gap-3 mr-auto justify-start items-center">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-bold">AI</div>
                    <div className="p-3 bg-neutral-cardBg border border-neutral-border rounded-2xl rounded-tl-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Inputs */}
          <div className="p-4 border-t border-neutral-border/50 bg-neutral-cardBg/30 flex gap-2">
            <input 
              type="text"
              placeholder="Ask anything about coding parameters, server configs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(input); }}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-neutral-darkBg border border-neutral-border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
            />
            <button 
              onClick={() => handleSendMessage(input)}
              disabled={loading || !input.trim()}
              className="p-3.5 bg-brand-primary text-neutral-darkBg rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
