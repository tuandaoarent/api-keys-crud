'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ onCollapseChange }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  const navigationItems = [
    { 
      id: 'Overview', 
      label: 'Overview', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ), 
      href: '/dashboards' 
    },
    { 
      id: 'API Playground', 
      label: 'API Playground', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ), 
      href: '/playground' 
    },
    { 
      id: 'Use Cases', 
      label: 'Use Cases', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ), 
      href: '/use-cases' 
    },
    { 
      id: 'Billing', 
      label: 'Billing', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ), 
      href: '/billing' 
    },
    { 
      id: 'Settings', 
      label: 'Settings', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ), 
      href: '/settings' 
    },
    { 
      id: 'Documentation', 
      label: 'Documentation', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ), 
      href: '/documentation', 
      external: true 
    },
    { 
      id: 'Tavily MCP', 
      label: 'Tavily MCP', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
        </svg>
      ), 
      href: '/tavily-mcp', 
      external: true 
    }
  ];

  const isActiveItem = (item) => {
    return pathname === item.href;
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header/Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              {/* Tavily Logo Icon */}
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 relative">
                    {/* Blue arrow pointing up */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-blue-500"></div>
                    {/* Red arrow pointing left */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-r-4 border-t-transparent border-b-transparent border-r-red-500"></div>
                    {/* Yellow arrow pointing right */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-l-4 border-t-transparent border-b-transparent border-l-yellow-500"></div>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">Pepperwood</span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex items-center justify-center w-full">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 relative">
                    {/* Blue arrow pointing up */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-blue-500"></div>
                    {/* Red arrow pointing left */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-r-4 border-t-transparent border-b-transparent border-r-red-500"></div>
                    {/* Yellow arrow pointing right */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-l-4 border-t-transparent border-b-transparent border-l-yellow-500"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Navigation Links */}
      <div className="flex-1">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = isActiveItem(item);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <span className={`${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="font-medium">{item.label}</span>
                    {item.external && (
                      <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Collapse Button */}
      <div className="border-t border-gray-200">
        <button
          onClick={handleToggleCollapse}
          className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg 
            className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!isCollapsed && (
            <span className="font-medium text-gray-700">
              {isCollapsed ? 'Expand' : 'Collapse'}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
