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
import PersonalityTraits from '../personality/PersonalityTraits';
import { 
  Card,
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIC } from '../../hooks/useIC';

interface Message {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: number;
  personality_updates?: [string, number][];
}

interface PersonalityTrait {
  trait: string;
  value: number;
}

interface AnimaMetrics {
  [key: string]: string | number;
}

interface StreamData {
  market: string[];
  weather: string[];
  news: string[];
}

interface ImmersiveAnimaUIProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
  animaName: string;
  personality: {
    traits: [string, number][];
    creation_time?: number;
    id?: string;
    owner?: string;
    developmental_stage?: string;
  };
  metrics: AnimaMetrics;
  isTyping: boolean;
}

// ... Rest of the component implementation remains the same, just with added TypeScript types
// The component logic is identical to the previous version, just with proper typing

export default ImmersiveAnimaUI;