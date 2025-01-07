import React from 'react';
import { Activity, Brain, Settings, LogOut, ChevronDown, Shield, Sparkles } from 'lucide-react';

function IconWrapper({ icon: Icon, ...props }) {
  try {
    return <Icon {...props} />;
  } catch (error) {
    console.error(`Failed to load icon:`, error);
    return <IconFallback />;
  }
}

export function IconFallback() {
  return (
    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
  );
}

// Export wrapped versions of all icons
export const AnimaIcons = {
  Activity: (props) => <IconWrapper icon={Activity} {...props} />,
  Brain: (props) => <IconWrapper icon={Brain} {...props} />,
  Settings: (props) => <IconWrapper icon={Settings} {...props} />,
  LogOut: (props) => <IconWrapper icon={LogOut} {...props} />,
  ChevronDown: (props) => <IconWrapper icon={ChevronDown} {...props} />,
  Shield: (props) => <IconWrapper icon={Shield} {...props} />,
  Sparkles: (props) => <IconWrapper icon={Sparkles} {...props} />,
};