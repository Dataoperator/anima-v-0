import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, MessageSquare, Brain, LogOut, ChevronDown } from 'lucide-react';

export function TopNav({ isAdmin }) {
  const { logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: null },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/personality', label: 'Personality', icon: Brain },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: Activity }] : [])
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary">
                Living NFT ✨
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname === path
                      ? 'border-b-2 border-primary text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <button
                onClick={logout}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <span className="sr-only">Log out</span>
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-ring">
              <span className="sr-only">Open main menu</span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`${
                location.pathname === path
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-foreground'
              } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              {Icon && <Icon className="mr-3 h-5 w-5" />}
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}