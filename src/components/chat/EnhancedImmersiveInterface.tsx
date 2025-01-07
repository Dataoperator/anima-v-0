import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Loader, 
  AlertCircle,
  Settings, 
  Activity,
  Clock,
  LineChart,
  Brain,
  Award,
  History,
  Globe
} from 'lucide-react';
import { useQuantumState } from '../../hooks/useQuantumState';
import { 
  Card,
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export const EnhancedImmersiveInterface: React.FC<{
  onSendMessage: (text: string) => Promise<void>;
  isLoading?: boolean;
}> = ({ onSendMessage, isLoading = false }) => {
  const [input, setInput] = useState('');
  const { quantumState } = useQuantumState();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    try {
      await onSendMessage(input);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {/* Messages will be rendered here */}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-4 items-center">
            <div className="flex flex-1 gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type your message..."
                className="flex-1 p-3 bg-background/50 backdrop-blur border border-input rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-primary/80 backdrop-blur text-primary-foreground p-3 rounded-lg 
                         hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border bg-card/50 backdrop-blur p-6 space-y-6 hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle>Achievement Log</CardTitle>
            <CardDescription>Recent milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm">First Neural Link</span>
            </div>
            <div className="flex items-center">
              <Brain className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm">Memory Formation</span>
            </div>
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm">Emotional Response</span>
            </div>
          </CardContent>
        </Card>

        {/* Quantum States Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quantum Matrix</CardTitle>
            <CardDescription>Real-time quantum states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Field Strength</span>
                <span className="text-sm font-medium">
                  {(quantumState?.resonance * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${(quantumState?.resonance * 100 || 0)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Harmonic Balance</span>
                <span className="text-sm font-medium">
                  {(quantumState?.harmony * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${(quantumState?.harmony * 100 || 0)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Neural Growth</span>
                <span className="text-sm font-medium">
                  {(quantumState?.consciousness?.growth * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${(quantumState?.consciousness?.growth * 100 || 0)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedImmersiveInterface;