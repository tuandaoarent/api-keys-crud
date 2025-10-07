'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiKeysService } from '../../lib/api-keys';
import NotificationPopup, { NOTIFICATION_TYPES } from '../../components/NotificationPopup';
import Sidebar from '../../components/Sidebar';
import ApiKeyForm from '../../components/ApiKeyForm';
import ApiKeysTable from '../../components/ApiKeysTable';

export default function DashboardsPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: NOTIFICATION_TYPES.SUCCESS
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Helper function to show notifications
  const showNotification = (message, type = NOTIFICATION_TYPES.SUCCESS) => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  // Load API keys from Supabase
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const keys = await apiKeysService.getAll();
        setApiKeys(keys);
      } catch (err) {
        console.error('Failed to load API keys:', err);
        setError('Failed to load API keys. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKeys();
  }, []);

  const handleCreateKey = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const newKey = await apiKeysService.create({
        name: formData.name,
        description: formData.description,
        type: 'dev',
        permissions: formData.permissions
      });

      setApiKeys([newKey, ...apiKeys]);
      setShowCreateForm(false);
      showNotification('API key created successfully');
    } catch (err) {
      console.error('Failed to create API key:', err);
      showNotification('Failed to create API key. Please try again.', NOTIFICATION_TYPES.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateKey = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const updatedKey = await apiKeysService.update(editingKey.id, {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      });

      setApiKeys(apiKeys.map(key => 
        key.id === editingKey.id ? updatedKey : key
      ));
      setEditingKey(null);
      setShowCreateForm(false);
      showNotification('API key updated successfully');
    } catch (err) {
      console.error('Failed to update API key:', err);
      showNotification('Failed to update API key. Please try again.', NOTIFICATION_TYPES.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteKey = async (id) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      try {
        setError(null);
        await apiKeysService.delete(id);
        setApiKeys(apiKeys.filter(key => key.id !== id));
        showNotification('API key deleted successfully');
      } catch (err) {
        console.error('Failed to delete API key:', err);
        showNotification('Failed to delete API key. Please try again.', NOTIFICATION_TYPES.ERROR);
      }
    }
  };

  const handleEditKey = (key) => {
    setEditingKey(key);
    setShowCreateForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingKey) {
      handleUpdateKey(formData);
    } else {
      handleCreateKey(formData);
    }
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingKey(null);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied API Key to clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      showNotification('Failed to copy to clipboard', NOTIFICATION_TYPES.ERROR);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar onCollapseChange={setIsSidebarCollapsed} />
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Operational</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Notification Popup */}
        <NotificationPopup
          show={notification.show}
          onClose={hideNotification}
          message={notification.message}
          type={notification.type}
        />

        {/* Current Plan Section */}
        <div className="mb-6 sm:mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 p-4 sm:p-8">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-4">
                <div className="text-white/80 text-sm font-medium uppercase tracking-wide">CURRENT PLAN</div>
                <button className="flex items-center gap-2 bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm sm:text-base">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="hidden sm:inline">Manage Plan</span>
                  <span className="sm:hidden">Manage</span>
                </button>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Researcher</h2>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 text-white/90 mb-2">
                  <span className="font-medium">API Usage</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-white/80 text-sm mb-2">Monthly plan</div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
                <div className="text-white/80 text-sm">0/1,000 Credits</div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">Pay as you go</span>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-auto">
                  <div className="w-12 h-6 bg-white/20 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* API Keys Section */}
        <div className="bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
            <button
              onClick={() => {
                setEditingKey(null);
                setShowCreateForm(true);
              }}
              className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mb-6">
            The key is used to authenticate your requests to the{' '}
            <a href="#" className="underline text-blue-600 hover:text-blue-800">Research API</a>.
            To learn more, see the{' '}
            <a href="#" className="underline text-blue-600 hover:text-blue-800">documentation page</a>.
          </p>

          {/* API Keys Table */}
          <ApiKeysTable
            apiKeys={apiKeys}
            onEditKey={handleEditKey}
            onDeleteKey={handleDeleteKey}
            onCopyKey={copyToClipboard}
            onToggleVisibility={() => {}} // Handled internally by the table component
          />
        </div>

        {/* Create/Edit Form Modal */}
        <ApiKeyForm
          isOpen={showCreateForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          editingKey={editingKey}
          isSubmitting={isSubmitting}
        />
        </div>
      </div>
    </div>
  );
}
