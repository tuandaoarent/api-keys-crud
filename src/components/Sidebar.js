'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ onCollapseChange }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
  ];

  const isActiveItem = (item) => {
    return pathname === item.href;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={handleMobileMenuClose}
        />
      )}
      
      {/* Mobile Menu Button */}
      <button
        onClick={handleMobileMenuToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors bg-white shadow-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
                onClick={() => {
                  // Close mobile menu when navigating
                  handleMobileMenuClose();
                }}
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

      {/* Bottom Button - Close on mobile, Collapse on desktop */}
      <div className="border-t border-gray-200">
        {/* Mobile Close Button */}
        <button
          onClick={handleMobileMenuClose}
          className={`lg:hidden w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Close sidebar"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {!isCollapsed && (
            <span className="font-medium text-gray-700">Close</span>
          )}
        </button>

        {/* Desktop Collapse Button */}
        <button
          onClick={handleToggleCollapse}
          className={`hidden lg:flex w-full items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition-colors ${
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
    </>
  );
}
