'use client';

import { useState } from 'react';

export default function ApiKeysTable({ 
  apiKeys, 
  onEditKey, 
  onDeleteKey, 
  onCopyKey, 
  onToggleVisibility 
}) {
  const [visibleKeys, setVisibleKeys] = useState({});

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
    onToggleVisibility(keyId);
  };

  if (apiKeys.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div className="col-span-3">NAME</div>
            <div className="col-span-2">USAGE</div>
            <div className="col-span-3">KEY</div>
            <div className="col-span-2">PERMISSIONS</div>
            <div className="col-span-2">OPTIONS</div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="text-gray-500 mb-2">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys found</h3>
          <p className="text-gray-500">Create your first API key to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div className="flex-3 min-w-[120px]">NAME</div>
            <div className="flex-2 min-w-[80px]">USAGE</div>
            <div className="flex-3 min-w-[200px]">KEY</div>
            <div className="flex-2 min-w-[120px]">PERMISSIONS</div>
            <div className="flex-2 min-w-[140px]">OPTIONS</div>
          </div>
        </div>
        
        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {apiKeys.map((key) => (
            <div key={key.id} className="flex px-6 py-4 items-center hover:bg-gray-50">
              <div className="flex-3 min-w-[120px]">
                <div className="font-medium text-gray-900">{key.name}</div>
              </div>
              <div className="flex-2 min-w-[80px]">
                <div className="text-gray-900">{key.usage}</div>
              </div>
              <div className="flex-3 min-w-[200px]">
                <div className="font-mono text-sm text-gray-600">
                  {visibleKeys[key.id] ? key.fullKey : key.key}
                </div>
              </div>
              <div className="flex-2 min-w-[120px]">
                <div className="flex flex-wrap gap-1">
                  {key.permissions && key.permissions.length > 0 ? (
                    key.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {permission}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">No permissions</span>
                  )}
                </div>
              </div>
              <div className="flex-2 min-w-[140px]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleKeyVisibility(key.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600"
                    title="View/Hide Key"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onCopyKey(key.fullKey)}
                    className="p-1.5 text-gray-400 hover:text-gray-600"
                    title="Copy Key"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onEditKey(key)}
                    className="p-1.5 text-gray-400 hover:text-gray-600"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteKey(key.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
