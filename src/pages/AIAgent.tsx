import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader, Bot, Lightbulb, CheckCircle } from 'lucide-react';
import { useAI } from '../hooks/useAI';

const AIAgent = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent'; content: string }>>([
    {
      role: 'agent',
      content:
        "Hey! I'm Hustler, your personal AI content assistant. I can help you brainstorm ideas, optimize your content strategy, analyze your performance, and guide you through monetization. What would you like help with?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { generateText, error } = useAI();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await generateText(userMessage, 'chat_assistant');
      setMessages((prev) => [...prev, { role: 'agent', content: response }]);
    } catch (err) {
      console.error('Failed to get response:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'agent', content: error || 'Sorry, I had trouble processing that. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { icon: Lightbulb, text: 'Generate viral content ideas for TikTok' },
    { icon: CheckCircle, text: 'Create a posting schedule for maximum engagement' },
    { icon: Lightbulb, text: 'Analyze my analytics to find growth opportunities' },
    { icon: CheckCircle, text: 'Suggest monetization strategies for my niche' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Hustler - AI Agent</h1>
              <p className="text-slate-400">Your personal content and growth assistant</p>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-6 mb-4 overflow-y-auto flex flex-col gap-4"
        >
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-lg flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Hustler is thinking...</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {suggestions.map((suggestion, idx) => {
              const Icon = suggestion.icon;
              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    setInput(suggestion.text);
                  }}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-3 text-left transition"
                >
                  <Icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{suggestion.text}</span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Hustler anything..."
            disabled={loading}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg px-6 py-3 font-semibold flex items-center gap-2 disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
            Send
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default AIAgent;
