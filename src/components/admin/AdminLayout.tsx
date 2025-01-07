import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Activity,
  Settings,
  AlertCircle,
  Brain,
  Database,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const NavItem = ({ href, icon: Icon, label, isActive }) => (
  <Link
    to={href}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${isActive ? 'bg-green-500/10 text-green-500' : 'hover:bg-green-500/5 text-gray-400 hover:text-green-500'}`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

export const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/metrics', icon: Activity, label: 'Metrics' },
    { href: '/admin/users', icon: Users, label: 'User Management' },
    { href: '/admin/quantum', icon: Brain, label: 'Quantum Control' },
    { href: '/admin/system', icon: Database, label: 'System' },
    { href: '/admin/alerts', icon: AlertCircle, label: 'Alerts' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-green-500/20 min-h-screen p-4">
          <div className="mb-8">
            <h2 className="text-green-500 text-lg font-bold flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <span>Anima Admin</span>
            </h2>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.href}
              />
            ))}
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 w-full rounded-lg
                         text-red-400 hover:bg-red-500/5 hover:text-red-500 transition-colors mt-8"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
