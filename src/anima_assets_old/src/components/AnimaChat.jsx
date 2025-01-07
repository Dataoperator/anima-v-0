import React, { useState, useEffect, useRef } from 'react';

const AnimaChat = ({ actor, animaId, anima, setAnima }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for autonomous messages
  useEffect(() => {
    let checkTimer;
    
    if (animaId && anima?.autonomous_enabled) {
      checkTimer = setInterval(async () => {
        try {
          const result = await actor.check_autonomous_messages(animaId);
          if ('Ok' in result && result.Ok) {
            const autonomousMsg = result.Ok;
            setMessages(prev => [...prev, {
              type: 'anima',
              content: autonomousMsg.response,
              changes: autonomousMsg.personality_updates,
              autonomous: true
            }]);
            
            // Update Anima state
            const animaResult = await actor.get_anima(animaId);
            if ('Ok' in animaResult) {
              setAnima(animaResult.Ok);
            }
          }
        } catch (error) {
          console.error('Failed to check autonomous messages:', error);
        }
      }, 30000);
    }

    return () => {
      if (checkTimer) {
        clearInterval(checkTimer);
      }
    };
  }, [animaId, actor, anima?.autonomous_enabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      // Add user message immediately
      setMessages(prev => [...prev, {
        type: 'user',
        content: input.trim()
      }]);

      // Clear input
      setInput('');

      // Call backend
      const result = await actor.interact(animaId, input.trim());
      
      if ('Ok' in result) {
        // Add Anima response
        setMessages(prev => [...prev, {
          type: 'anima',
          content: result.Ok.response,
          changes: result.Ok.personality_updates,
          autonomous: false
        }]);

        // Update Anima state
        const animaResult = await actor.get_anima(animaId);
        if ('Ok' in animaResult) {
          setAnima(animaResult.Ok);
        }
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to send message. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (msg, idx) => (
    <div
      key={idx}
      className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          msg.type === 'user'
            ? 'bg-blue-500 text-white'
            : msg.type === 'error'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100'
        }`}
      >
        {msg.autonomous && (
          <div className="text-xs text-blue-500 mb-1">
            *Initiated by Anima*
          </div>
        )}
        <p className="whitespace-pre-wrap">{msg.content}</p>
        {msg.changes && msg.changes.length > 0 && (
          <div className="text-xs mt-2 opacity-75">
            <p className="font-semibold mb-1">Personality Updates:</p>
            {msg.changes.map(([trait, value], i) => (
              <p key={i}>{trait}: {value > 0 ? '+' : ''}{value.toFixed(2)}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => renderMessage(msg, idx))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Anima is thinking..." : "Type your message..."}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-4 py-2 rounded-lg ${
              isLoading || !input.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnimaChat;