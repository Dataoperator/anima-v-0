import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Brain, 
  Sparkles, 
  LineChart,
  Settings
} from 'lucide-react';

const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  personality, 
  loading, 
  autonomousEnabled 
}) => {
  const [input, setInput] = useState('');
  const [showStats, setShowStats] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const renderTraitBar = (trait) => {
    const [name, value] = trait;
    if (typeof value !== 'number') return null;
    
    return (
      <div key={name} className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-300">{name}</span>
          <span className="text-sm font-medium text-gray-300">{Math.round(value * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${value * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const formatPersonalityUpdates = (updates) => {
    if (!Array.isArray(updates)) return [];
    return updates.map(update => {
      if (Array.isArray(update) && update.length === 2) {
        const [trait, value] = update;
        return { trait, value };
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-80 bg-gray-800 p-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="w-8 h-8 text-indigo-500" />
          <h1 className="text-xl font-bold">Anima AI</h1>
        </div>

        <button 
          onClick={() => setShowStats(!showStats)}
          className="flex items-center space-x-2 mb-4 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <LineChart className="w-5 h-5" />
          <span>Personality Stats</span>
        </button>

        {showStats && personality && Array.isArray(personality.traits) && (
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-4">Traits</h2>
            {personality.traits.map(renderTraitBar)}
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <span>Level</span>
                <span className="text-indigo-400">{personality.growth_level || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Interactions</span>
                <span className="text-indigo-400">{personality.interaction_count || 0}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto space-y-2">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {Array.isArray(messages) && messages.map((msg, idx) => (
              <div key={idx} className={`flex mb-4 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-md p-4 rounded-lg
                  ${msg.isUser ? 'bg-indigo-600' : 'bg-gray-700'}
                `}>
                  <div className="flex items-center space-x-2 mb-2">
                    {!msg.isUser && <Sparkles className="w-4 h-4 text-indigo-400" />}
                    <span className="font-medium">
                      {msg.isUser ? 'You' : 'Anima'}
                    </span>
                    {msg.isAutonomous && (
                      <span className="text-xs bg-indigo-800 px-2 py-1 rounded">
                        Autonomous
                      </span>
                    )}
                  </div>
                  <p className="text-gray-100">{msg.content}</p>
                  {msg.personality_updates && msg.personality_updates.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <p className="text-sm text-indigo-300">Personality Updates:</p>
                      {formatPersonalityUpdates(msg.personality_updates).map(({ trait, value }, idx) => (
                        <p key={idx} className="text-xs text-gray-300">
                          {trait}: {value > 0 ? '+' : ''}{(value * 100).toFixed(1)}%
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gray-700 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`
                  px-4 py-2 rounded-lg flex items-center space-x-2
                  ${loading || !input.trim() 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'}
                  transition-colors
                `}
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;