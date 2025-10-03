'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import NotificationPopup, { NOTIFICATION_TYPES } from '../../components/NotificationPopup';

export default function PlaygroundPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: NOTIFICATION_TYPES.SUCCESS
  });

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

  const validateApiKey = async (keyToValidate) => {
    try {
      // Call the API endpoint to validate the key
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: keyToValidate }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          isValid: false,
          error: result.error || 'Failed to validate API key'
        };
      }

      return result;
    } catch (error) {
      console.error('Error validating API key:', error);
      return {
        isValid: false,
        error: 'Failed to validate API key. Please try again.'
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      showNotification('Please enter an API key', NOTIFICATION_TYPES.ERROR);
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await validateApiKey(apiKey.trim());
      setValidationResult(result);
      
      if (result.isValid) {
        showNotification('API key is valid!', NOTIFICATION_TYPES.SUCCESS);
      } else {
        showNotification(result.error, NOTIFICATION_TYPES.ERROR);
      }
    } catch (error) {
      console.error('Validation error:', error);
      showNotification('An error occurred during validation', NOTIFICATION_TYPES.ERROR);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setValidationResult(null);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar onCollapseChange={setIsSidebarCollapsed} />
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          
          {/* Notification Popup */}
          <NotificationPopup
            show={notification.show}
            onClose={hideNotification}
            message={notification.message}
            type={notification.type}
          />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">API Playground</h1>
            <p className="text-gray-600">
              Test and validate your API keys to ensure they&apos;re working correctly.
            </p>
          </div>

          {/* API Key Validation Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">API Key Validator</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm placeholder-gray-500 text-gray-900"
                    placeholder="Enter your API key (e.g., tvly-dev-...)"
                    disabled={isValidating}
                  />
                  {apiKey && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isValidating || !apiKey.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isValidating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isValidating ? 'Validating...' : 'Validate API Key'}
                </button>
                
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isValidating}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Validation Results */}
          {validationResult && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Result</h3>
              
              {validationResult.isValid ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Valid API Key</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Key Information</h4>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-blue-600 font-medium">Name:</dt>
                          <dd className="font-medium text-gray-900">{validationResult.keyInfo.name}</dd>
                        </div>
                        <div>
                          <dt className="text-blue-600 font-medium">Type:</dt>
                          <dd className="font-medium text-gray-900 capitalize">{validationResult.keyInfo.type}</dd>
                        </div>
                        <div>
                          <dt className="text-blue-600 font-medium">Usage Count:</dt>
                          <dd className="font-medium text-gray-900">{validationResult.keyInfo.usage}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                      <div className="flex flex-wrap gap-2">
                        {validationResult.keyInfo.permissions && validationResult.keyInfo.permissions.length > 0 ? (
                          validationResult.keyInfo.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {permission}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-700 text-sm">No permissions assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="text-sm text-blue-600 font-medium">Created:</span>
                      <span className="ml-2 text-sm font-medium text-gray-900">{validationResult.keyInfo.createdAt}</span>
                    </div>
                    <div>
                      <span className="text-sm text-blue-600 font-medium">Last Used:</span>
                      <span className="ml-2 text-sm font-medium text-gray-900">{validationResult.keyInfo.lastUsed}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Invalid API Key</span>
                </div>
              )}
            </div>
          )}

          {/* Usage Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Enter your API key in the input field above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Click &quot;Validate API Key&quot; to check if the key is valid</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>View detailed information about valid keys including permissions and usage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use this tool to test keys before implementing them in your applications</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
